import type { Metadata } from "next";

import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { getSelectedLocation } from "@/i18n/location";
import { getProducts, getRelatedProducts, getProductReviews, getProductSpecLabels, getBrandInfo } from "@/services/products";
import { getActivePromotion, getBrandTerms, getFilterAttributes, getSEOArticles, getRelatedBlogArticles } from "@/services/homepage";
import BrandHero from "@/components/brand-hero";
import { localizePath } from "@/i18n/locale-paths";
import { getBrandEntry } from "@/services/brands";
import ProductTemplate from "@/templates/product";
import StoreTemplate from "@/templates/store";
import { generateBrandSchema, generateProductSchema } from "@/utils/structured-data";
import { payloadSdk } from "@/utils/payload-sdk";
import { hasProductImage, pickByHandle } from "@/utils/product-image";
import { brandOgImageUrl, pickBrandOgProduct, productOgImageUrl } from "@/utils/og-url";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import productRedirects from "@/data/product-redirects.json";
import slugRedirects from "@/data/slug-redirects.json";

type SlugPageProps = {
    params: Promise<{ slug: string }>;
};

// Slug sản phẩm cũ (viết tắt) → slug mới (tên đầy đủ) — 308 permanent redirect giữ SEO.
function productRedirectTarget(slug: string, locale: string): null | string {
    const to = (productRedirects as Record<string, string>)[slug];
    if (!to) return null;
    return locale === "en" ? `/en/${to}` : `/${to}`;
}

// Slug trang cũ (brand đổi tên, danh mục, route legacy) → path đích đầy đủ theo locale.
// Đích lưu sẵn full path (kèm /en) trong slug-redirects.json.
function slugRedirectTarget(slug: string, locale: string): null | string {
    const map = (slugRedirects as Record<string, Record<string, string>>)[locale];
    return map?.[slug] ?? null;
}

export async function generateMetadata(
    props: SlugPageProps
): Promise<Metadata> {
    const { slug } = await props.params;
    const locale = await getLocale();
    const seo = dictionaries[locale].seo;

    // Slug cũ (brand đổi tên / danh mục / legacy) → redirect 308 trước mọi xử lý.
    const slugRedirect = slugRedirectTarget(slug, locale);
    if (slugRedirect) permanentRedirect(slugRedirect);

    // Brand page: /snus-{brand}
    if (slug.startsWith("snus-")) {
        const brandName = slug.replace("snus-", "");
        // Brand không tồn tại → 404 thật (tránh soft-404: mọi /snus-* đều 200)
        const brandInfo = await getBrandInfo(brandName, locale);
        if (!brandInfo) notFound();
        const [brandEntry, products] = await Promise.all([
            getBrandEntry(brandName, locale).catch(() => null),
            // Cùng tham số với trang bên dưới → fetch được dedupe trong cùng request.
            getProducts(locale, await getSelectedLocation(), "snus", "all").catch(() => []),
        ]);
        // OG khi CMS (seo-meta) không có ảnh: ảnh tự sinh từ SP đầu catalog hãng → logo hãng.
        const firstProduct = pickBrandOgProduct(products, brandName);
        return buildMetadata({
            path: `/${slug}`,
            locale,
            fallbackTitle: seo.brandTitle.replace("{brand}", brandInfo.name),
            fallbackDescription: seo.brandDescription.replace("{brand}", brandInfo.name),
            fallbackImage: firstProduct
                ? brandOgImageUrl(brandName, brandInfo.name, brandEntry?.logo, firstProduct)
                : brandEntry?.logo,
        });
    }

    // Product page — truyền locale để lấy meta đúng ngôn ngữ
    const result = await payloadSdk.find({
        collection: "products",
        limit: 10,
        locale: locale as any,
        select: {
            meta: { description: true, title: true, image: true },
            title: true,
            handle: true,
            brand: true,
            gallery: true,
            variants: true,
            visible: true,
            inStock: true,
            notForSale: true,
        },
        where: { handle: { equals: slug } },
    });

    if (!result.docs.length) {
        // Handle không còn trong DB → thử redirect slug cũ→mới, nếu không thì 404.
        const redirectTo = productRedirectTarget(slug, locale);
        if (redirectTo) permanentRedirect(redirectTo);
        notFound();
    }

    const product = pickByHandle(result.docs) as any;
    // SP chưa có ảnh không hiện trên web → 404 (cùng điều kiện với trang bên dưới)
    if (!hasProductImage(product)) notFound();
    // Ảnh OG sản phẩm: meta.image chỉ khi là ảnh OG riêng editor upload. Lúc import, meta.image
    // được gán trùng ảnh gallery → coi như chưa có, dùng ảnh tự sinh (ảnh + tên + giá).
    const metaImage = typeof product.meta?.image === "object" ? product.meta.image : null;
    const productImageIds = new Set(
        [...(product.gallery || []), ...(product.variants || []).flatMap((v: any) => v?.gallery || [])]
            .map((img: any) => (typeof img === "object" ? img?.id : img))
            .filter(Boolean),
    );
    const customOgImage =
        metaImage?.url && !productImageIds.has(metaImage.id) ? (metaImage.url as string) : undefined;
    return buildMetadata({
        path: `/${slug}`,
        locale,
        fallbackTitle: product.meta?.title || `${product.title} | SnusSaigon`,
        fallbackDescription: product.meta?.description || `${product.title}`,
        fallbackImage: customOgImage || productOgImageUrl(product),
    });
}

export default async function SlugPage(props: SlugPageProps) {
    const { slug } = await props.params;
    const locale = await getLocale();
    const selectedLocation = await getSelectedLocation();

    // Slug cũ (brand đổi tên / danh mục / legacy) → redirect 308 trước mọi xử lý.
    const slugRedirect = slugRedirectTarget(slug, locale);
    if (slugRedirect) permanentRedirect(slugRedirect);

    // Brand page: /snus-{brand}
    if (slug.startsWith("snus-")) {
        const brandSlug = slug.replace("snus-", "");
        // Brand không tồn tại → 404 thật (tránh soft-404: mọi /snus-* đều 200)
        const brandInfo = await getBrandInfo(brandSlug, locale);
        if (!brandInfo) notFound();

        const [products, seoArticles, brandEntry, brandTerms, filterAttributes] = await Promise.all([
            // Trang /snus-{brand} là danh mục SNUS của brand → chỉ lấy productType snus
            // (sản phẩm caffeine cùng brand hiển thị ở /danh-muc/caffeine, không lẫn vào đây).
            getProducts(locale, selectedLocation, "snus", "all"),
            getSEOArticles({ brandSlug, pageType: "brand", locale }).catch(() => []),
            // Hero + JSON-LD Brand. Lỗi CMS → bỏ hero, trang danh sách vẫn chạy như cũ.
            getBrandEntry(brandSlug, locale, selectedLocation).catch(() => null),
            getBrandTerms().catch(() => []),
            getFilterAttributes().catch(() => []),
        ]);
        // H1 + breadcrumb: chỉ tên hãng (vd "ZYN"). Title/meta SEO vẫn có "Snus" (generateMetadata).
        const title = brandInfo.name;
        const brandSchema = brandEntry
            ? generateBrandSchema({
                  name: brandEntry.name,
                  url: localizePath(`/${slug}`, locale),
                  logo: brandEntry.logo,
                  description: brandEntry.profile?.intro || brandEntry.profile?.tagline,
              })
            : null;

        return (
            <>
                {brandSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
                    />
                )}
                <Suspense fallback={null}>
                    <StoreTemplate
                        brandSlug={brandSlug}
                        brandTerms={brandTerms}
                        filterAttributes={filterAttributes}
                        breadcrumbParent={{ href: "/brands", label: dictionaries[locale].brands.breadcrumb }}
                        collectionTitle={title}
                        hero={brandEntry ? <BrandHero brand={brandEntry} locale={locale} /> : undefined}
                        products={products}
                        seoArticles={seoArticles}
                    />
                </Suspense>
            </>
        );
    }

    // Product page — truyền locale để lấy title/description/intro đúng ngôn ngữ
    const product = await payloadSdk.find({
        collection: "products",
        depth: 2,
        limit: 10,
        locale: locale as any,
        fallbackLocale: "vi" as any,
        where: { handle: { equals: slug } },
    });

    if (!product.docs.length) {
        // Handle không còn trong DB → thử redirect slug cũ→mới, nếu không thì 404.
        const redirectTo = productRedirectTarget(slug, locale);
        if (redirectTo) permanentRedirect(redirectTo);
        notFound();
    }

    const productDoc = pickByHandle(product.docs) as any;
    // SP chưa có ảnh không hiện trên web (ẩn khỏi danh sách + sitemap) → 404
    if (!hasProductImage(productDoc)) notFound();
    const productBrand = productDoc.brand?.toLowerCase?.() || "";
    const [blogArticles, relatedProducts, reviews, specLabels, promotion] = await Promise.all([
        productBrand
            ? getRelatedBlogArticles({ brand: productBrand, excludeSlug: slug, limit: 4, locale }).catch(() => [])
            : Promise.resolve([]),
        getRelatedProducts({ product: productDoc, locale, locationId: selectedLocation, limit: 4 }).catch(() => []),
        getProductReviews(productDoc.id).catch(() => []),
        getProductSpecLabels(productDoc, locale).catch(() => null),
        getActivePromotion(locale),
    ]);
    // Tên attribute đã resolve từ CMS (server-side) → SSR ra đúng tên, không nháy.
    productDoc.specLabels = specLabels;

    // Product structured data (JSON-LD) — đủ điều kiện rich result giá/tồn kho/đánh giá
    // (sản phẩm "Chưa kinh doanh" không phát Offer: giá CMS là 0đ, không phải giá bán)
    const variant = productDoc.variants?.[0];
    const galleryImage =
        Array.isArray(productDoc.gallery) && typeof productDoc.gallery[0] === "object"
            ? productDoc.gallery[0]?.url
            : null;
    const productImage =
        galleryImage ||
        variant?.imageUrl ||
        (typeof variant?.gallery?.[0] === "object" ? variant.gallery[0].url : null) ||
        productDoc.thumbnail ||
        "";
    const productSchema = generateProductSchema({
        name: productDoc.title,
        description: productDoc.meta?.description || productDoc.title || "",
        image: productImage,
        sku: variant?.sku || productDoc.handle || slug,
        url: locale === "en" ? `/en/${slug}` : `/${slug}`,
        brand: specLabels?.brand || productDoc.brand || "Snus Sài Gòn",
        notForSale: productDoc.notForSale === true,
        price: variant?.price || 0,
        currency: productDoc.currency || "VND",
        inStock:
            !productDoc.notForSale &&
            productDoc.inStock !== false &&
            (variant?.stockCount === undefined ? true : variant.stockCount > 0),
        rating: productDoc.rating,
        reviewCount: productDoc.reviewCount,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <ProductTemplate blogArticles={blogArticles} product={productDoc} promotion={promotion} relatedProducts={relatedProducts} reviews={reviews} />
        </>
    );
}
