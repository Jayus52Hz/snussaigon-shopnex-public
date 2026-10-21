import type { Metadata } from "next";

import SaigonFaq, {
    type SaigonFaqItem,
} from "@/components/homepage/saigon-faq";
import SaigonHero, {
    type SaigonHeroContent,
} from "@/components/homepage/saigon-hero";
import SaigonLongform from "@/components/homepage/saigon-longform";
import SaigonMap from "@/components/homepage/saigon-map";
import SaigonBlogSection from "@/components/homepage/saigon-blog-section";
import SaigonTrendingSection from "@/components/homepage/saigon-trending-section";
import SaigonMarqueeStrip from "@/components/homepage/saigon-marquee-strip";
import SaigonBrandPills from "@/components/homepage/saigon-brand-pills";
import SaigonMockProductSection from "@/components/homepage/saigon-mock-product-section";
import SaigonProductSection from "@/components/homepage/saigon-product-section";
import SaigonMomentBlock, {
    type SaigonMomentContent,
} from "@/components/homepage/saigon-moment-block";
import SaigonWhyUs, {
    type SaigonWhyUsItem,
} from "@/components/homepage/saigon-why-us";
import { SAIGON_PRODUCTS } from "@/components/homepage/saigon-mock-data";
import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { getSelectedLocation } from "@/i18n/location";
import { buildMetadata } from "@/utils/build-metadata";
import { usableImageUrl } from "@/utils/image-url";
import { getStoreSettings } from "@/services/store-settings";
import {
    getBestSellers,
    getBrandTerms,
    getFAQs,
    getHomepageContent,
    getHomepageStats,
    getMarqueeImages,
    getNewArrivals,
    getPaginatedBlogArticles,
    getFeaturedProducts,
    getTrendingTerms,
    getWhyUsItems,
} from "@/services/homepage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://snussaigon.com";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const seo = dictionaries[locale].seo;
    // CMS (seo-meta path="/") overrides these defaults when present.
    return buildMetadata({
        path: "/",
        locale,
        fallbackTitle: seo.homeTitle,
        fallbackDescription: seo.homeDescription,
    });
}

const LOCAL_BUSINESS_JSONLD = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "Snus Sai Gon",
    alternateName: "Snus Saigon · Engu Pouches",
    description:
        "Cửa hàng snus & nicotine pouch chính hãng tại TP.HCM. Giao hàng nhanh nội thành, COD toàn quốc.",
    url: SITE_URL,
    telephone: "+84896561023",
    address: {
        "@type": "PostalAddress",
        streetAddress: "135/17/44 Nguyễn Hữu Cảnh",
        addressLocality: "Thạnh Mỹ Tây",
        addressRegion: "TP. Hồ Chí Minh",
        addressCountry: "VN",
    },
    openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        opens: "09:00",
        closes: "22:00",
    },
    sameAs: [
        "https://instagram.com/snussaigon",
    ],
};

export const revalidate = 60;

/** Read media URL from a Payload upload field (Media | id | null). */
function mediaUrl(input: any): string | undefined {
    if (!input) return undefined;
    if (typeof input === "string") return undefined; // unresolved id
    return input?.url || input?.sizes?.large?.url || undefined;
}

/** Prefix every internal href with /en when locale === "en", so every
 * homepage CTA, brand card, and "See all" link routes through the user's
 * selected language. External URLs and anchor links pass through untouched. */
function localizeHref(href: string, locale: string): string {
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    if (locale !== "en") return href;
    if (href === "/" || href === "") return "/en";
    if (href.startsWith("/en/") || href === "/en") return href;
    return `/en${href.startsWith("/") ? "" : "/"}${href}`;
}

export default async function HomePage() {
    const locale = await getLocale();
    const selectedLocation = await getSelectedLocation();
    const isEn = locale === "en";
    // Ảnh LocalBusiness = ảnh OG mặc định trong CMS (file /og-default.jpg không tồn tại)
    const { ogImageUrl } = await getStoreSettings();

    /* ── Fetch CMS data in parallel — every call falls back gracefully ───── */
    const [
        homepageContent,
        faqsDocs,
        marqueeDocs,
        whyUsDocs,
        bestSellersDocs,
        newArrivalsDocs,
        featuredDocs,
        statsDocs,
        blogResult,
        trendingDocs,
        brandsDocs,
    ] = await Promise.all([
        getHomepageContent().catch(() => null),
        getFAQs(selectedLocation).catch(() => []),
        getMarqueeImages(selectedLocation).catch(() => []),
        getWhyUsItems(selectedLocation).catch(() => []),
        getBestSellers(selectedLocation).catch(() => []),
        getNewArrivals(selectedLocation).catch(() => []),
        getFeaturedProducts(selectedLocation).catch(() => []),
        getHomepageStats(selectedLocation).catch(() => []),
        getPaginatedBlogArticles({ locale, limit: 3 }).catch(() => ({ docs: [] })),
        getTrendingTerms().catch(() => []),
        // Brand pill "Mua theo thương hiệu" — nguồn attribute "Thương hiệu"
        getBrandTerms().catch(() => []),
    ]);

    /* ── Resolve per-location override for Hero / Moment if present ──────── */
    const matchedOverride = (homepageContent as any)?.locationOverrides?.find(
        (o: any) => {
            const oid =
                typeof o?.location === "string" ? o.location : o?.location?.id;
            return selectedLocation && String(oid) === String(selectedLocation);
        }
    );

    /* ── Hero — bilingual CTA labels, locale-aware internal hrefs ───────── */
    const hc = homepageContent as any;
    const heroCtaPrimaryLabel = hc?.heroCtaPrimaryLabel
        ? isEn
            ? hc.heroCtaPrimaryLabel_en || hc.heroCtaPrimaryLabel
            : hc.heroCtaPrimaryLabel
        : isEn
          ? "Shop now"
          : "Mua ngay";
    const heroCtaSecondaryLabel = hc?.heroCtaSecondaryLabel
        ? isEn
            ? hc.heroCtaSecondaryLabel_en || hc.heroCtaSecondaryLabel
            : hc.heroCtaSecondaryLabel
        : isEn
          ? "View all products"
          : "Xem tất cả sản phẩm";
    const heroContent: SaigonHeroContent | undefined = hc
        ? {
              titleA:
                  matchedOverride?.heroTitleA ||
                  (isEn ? hc.heroTitleA_en : hc.heroTitleA),
              titleBPrefix: hc.heroTitleBPrefix,
              titleBSuffix: hc.heroTitleBSuffix,
              subtitle:
                  matchedOverride?.heroSubtitle ||
                  (isEn ? hc.heroSubtitle_en : hc.heroSubtitle),
              backgroundUrl: mediaUrl(hc.heroBackground),
              ctaPrimary: {
                  label: heroCtaPrimaryLabel,
                  href: localizeHref(hc.heroCtaPrimaryHref || "/snus", locale),
              },
              ctaSecondary: {
                  label: heroCtaSecondaryLabel,
                  href: localizeHref(
                      hc.heroCtaSecondaryHref || "/snus",
                      locale
                  ),
              },
          }
        : undefined;

    /* ── Saigon Moment — same pattern ────────────────────────────────────── */
    const momentCtaPrimaryLabel = hc?.momentCtaPrimaryLabel
        ? isEn
            ? hc.momentCtaPrimaryLabel_en || hc.momentCtaPrimaryLabel
            : hc.momentCtaPrimaryLabel
        : isEn
          ? "Order now"
          : "Đặt ngay";
    const momentCtaSecondaryLabel = hc?.momentCtaSecondaryLabel
        ? isEn
            ? hc.momentCtaSecondaryLabel_en || hc.momentCtaSecondaryLabel
            : hc.momentCtaSecondaryLabel
        : isEn
          ? "View location"
          : "Xem địa điểm";
    const momentContent: SaigonMomentContent | undefined = hc
        ? {
              eyebrow: hc.momentEyebrow,
              title:
                  matchedOverride?.momentTitle ||
                  (isEn ? hc.momentTitle_en : hc.momentTitle),
              body:
                  matchedOverride?.momentBody ||
                  (isEn ? hc.momentBody_en : hc.momentBody),
              backgroundUrl: mediaUrl(hc.momentBackground),
              ctaPrimary: {
                  label: momentCtaPrimaryLabel,
                  href: localizeHref(
                      hc.momentCtaPrimaryHref || "/snus",
                      locale
                  ),
              },
              ctaSecondary: {
                  label: momentCtaSecondaryLabel,
                  // External map link — locale prefix doesn't apply.
                  href:
                      hc.momentCtaSecondaryHref ||
                      "https://maps.app.goo.gl/rczGiRmSjEK22WHC9",
              },
          }
        : undefined;

    /* ── FAQs (localized) ────────────────────────────────────────────────── */
    const faqs: SaigonFaqItem[] = (faqsDocs as any[])
        .map((d: any) => ({
            q: (isEn ? d.question_en : d.question) || d.question || "",
            a: (isEn ? d.answer_en : d.answer) || d.answer || "",
        }))
        .filter((f) => f.q && f.a);

    /* ── Why Us items (localized + icon mapping) ─────────────────────────── */
    const whyUsItems: SaigonWhyUsItem[] = (whyUsDocs as any[])
        .map((d: any) => ({
            iconName: d.iconName || "Package",
            title: (isEn ? d.title_en : d.title) || d.title || "",
            body: (isEn ? d.body_en : d.body) || d.body || "",
        }))
        .filter((i) => i.title);

    /* ── Marquee images ──────────────────────────────────────────────────── */
    const marqueeImages: string[] = (marqueeDocs as any[])
        .map((d: any) => mediaUrl(d.image))
        .filter((u): u is string => !!u);

    /* ── Homepage Stats (CMS, localized label) ───────────────────────────── */
    const homepageStats = (statsDocs as any[])
        .map((d: any) => ({
            value: d.value || "",
            label: (isEn ? d.label_en : d.label) || d.label || "",
        }))
        .filter((s) => s.value && s.label);

    /* ── Blog articles (latest by publish date) ──────────────────────────── */
    const blogItems = ((blogResult as any)?.docs || []).map((d: any) => ({
        title: d.title || "",
        slug: (isEn ? d.slugEn : d.slug) || d.slug || "",
        excerpt: d.excerpt || "",
        // Ưu tiên ảnh UPLOAD (thumbnail) → fallback link ảnh thay thế (thumbnailUrl).
        // Ảnh tạm (placehold.co) / host lạ → không có ảnh, card hiện khung mặc định.
        thumbnailUrl: usableImageUrl(mediaUrl(d.thumbnail)) || usableImageUrl(d.thumbnailUrl),
        publishedAt: d.publishedAt,
    })).filter((a: any) => a.title && a.slug);

    /* ── Trending search terms ───────────────────────────────────────────── */
    const trendingTerms = (trendingDocs as any[])
        .map((d: any) => ({ term: d.term || "", href: d.href || undefined }))
        .filter((t) => t.term);

    /* ── Brand pills (full brand list từ CMS) ────────────────────────────── */
    const brandPills = (brandsDocs as any[])
        .map((b: any) => ({ name: b.name || "", slug: b.slug || "", image: b.image }))
        .filter((b) => b.name && b.slug);

    /* ── Product sections ─────────────────────────────────────────────────
       Prefer real Payload products. Fall back to mock data ONLY when Payload
       returns empty (e.g. CMS down or no products with the matching badge).
       Real ProductCard (with cart, ratings, hydration) gets used either way
       since SaigonProductSection forwards docs to ProductCard. */
    // "Sản phẩm nổi bật" ← sản phẩm tick "Featured Product" trong CMS
    const featuredProducts =
        (featuredDocs as any[])?.length > 0
            ? (featuredDocs as any[])
            : ([...SAIGON_PRODUCTS]
                  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                  .slice(0, 8) as any[]);

    const newArrivalsProducts =
        (newArrivalsDocs as any[])?.length > 0
            ? (newArrivalsDocs as any[])
            : ([
                  ...SAIGON_PRODUCTS.filter((p) => p.badge === "NEW"),
                  ...SAIGON_PRODUCTS.filter((p) => p.badge === "SALE"),
                  ...SAIGON_PRODUCTS.filter((p) => !p.badge),
              ].slice(0, 8) as any[]);

    // "Bán chạy nhất" ← sản phẩm gắn badge "Best Seller (Hot)" trong CMS
    const bestSellersProducts =
        (bestSellersDocs as any[])?.length > 0
            ? (bestSellersDocs as any[])
            : ([
                  ...SAIGON_PRODUCTS.filter((p) => p.badge === "HOT"),
                  ...SAIGON_PRODUCTS.filter((p) => !p.badge),
              ].slice(0, 8) as any[]);

    // Decide which section component to use — real (Payload-shaped) cards vs
    // mock cards. The choice is per-section because each falls back
    // independently when Payload returns empty.
    const FeaturedSection =
        (featuredDocs as any[])?.length > 0
            ? SaigonProductSection
            : SaigonMockProductSection;
    const NewArrivalsSection =
        (newArrivalsDocs as any[])?.length > 0
            ? SaigonProductSection
            : SaigonMockProductSection;
    const BestSellersSection =
        (bestSellersDocs as any[])?.length > 0
            ? SaigonProductSection
            : SaigonMockProductSection;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        ...LOCAL_BUSINESS_JSONLD,
                        ...(ogImageUrl ? { image: ogImageUrl.replace(/ /g, "%20") } : {}),
                    }),
                }}
            />
            {/* Hero preload is auto-injected by next/image priority — no manual
                <link> needed (manual one would point to the un-optimized R2 URL). */}
            <SaigonHero content={heroContent} />
            <SaigonBrandPills brands={brandPills} />
            <FeaturedSection
                href={localizeHref("/snus", locale)}
                products={featuredProducts}
                title={isEn ? "Featured products" : "Sản phẩm nổi bật"}
            />
            <SaigonMomentBlock content={momentContent} />
            <SaigonWhyUs
                    items={whyUsItems}
                    eyebrow={isEn ? "Why choose Snus Sai Gon" : "Tại sao chọn Snus Sai Gon"}
                />
            <NewArrivalsSection
                bg="bg-saigon-bg-warm"
                href={localizeHref("/snus", locale)}
                products={newArrivalsProducts}
                title={isEn ? "New arrivals" : "Mới về"}
            />
            <BestSellersSection
                href={localizeHref("/snus", locale)}
                products={bestSellersProducts}
                title={isEn ? "Best Sellers" : "Bán chạy nhất"}
            />
            <SaigonMarqueeStrip images={marqueeImages} />
            <SaigonFaq items={faqs} />
            <SaigonLongform stats={homepageStats} />
            <SaigonMap />
            <SaigonBlogSection items={blogItems} locale={locale} />
            <SaigonTrendingSection terms={trendingTerms} locale={locale} />
        </>
    );
}
