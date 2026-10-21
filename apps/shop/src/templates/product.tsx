"use client";

import { useLocale } from "@/i18n/locale-provider";
import { gtmViewItem } from "@/components/gtm";
import { useEffect } from "react";
import { localizeProduct } from "@/utils/localize-product";
import Breadcrumbs from "@/components/breadcrumbs";
import ImageGallery from "@/components/products/image-gallery/image-gallery";
import ProductActions from "@/components/products/product-actions/product-actions";
import ProductArticle from "@/components/products/product-article";
import ProductReviews from "@/components/products/product-reviews";
import ProductTabs from "@/components/products/product-tabs/product-tabs";
import RelatedProducts from "@/components/products/related-products/related-products";
import BlogSection from "@/components/homepage/blog-section";
import PromotionInfo from "@/components/promotion-info";
import RestockNotifyForm from "@/components/restock-notify-form";
import type { Promotion } from "@/utils/quantity-promotion";

import { notFound } from "next/navigation";
import { useCallback, useState } from "react";

import ProductInfo from "./product-info";

type ProductTemplateProps = {
    product: any;
    blogArticles?: any[];
    relatedProducts?: any[];
    reviews?: any[];
    promotion?: Promotion | null;
};

export default function ProductTemplate({ product, blogArticles = [], relatedProducts = [], reviews = [], promotion }: ProductTemplateProps) {
    const { dict, locale } = useLocale();
    const localizedProduct = localizeProduct(product, locale);
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({});

    const handleAddToCart = useCallback(() => {
        const btn = document.getElementById(
            "product-add-to-cart-btn"
        ) as HTMLButtonElement | null;
        btn?.click();
    }, []);

    if (!localizedProduct || !localizedProduct.id) {
        return notFound();
    }

    // GA4 view_item
    useEffect(() => {
        gtmViewItem({
            id: localizedProduct.id,
            name: localizedProduct.title,
            brand: localizedProduct.brand,
            price: localizedProduct.variants?.[0]?.price || 0,
            currency: localizedProduct.currency || "VND",
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localizedProduct.id]);

    const selectedVariant =
        localizedProduct.variants?.find((variant: any) =>
            variant.options?.every(
                (opt: any) => selectedOptions[opt.option] === opt.value
            )
        ) || localizedProduct.variants?.[0];

    const variantPrice = selectedVariant?.price || 0;

    // Ảnh gallery variant → nếu trống thì gallery cấp sản phẩm ("Product Images" trong CMS,
    // nơi hầu hết sản phẩm gắn ảnh) — giữ alt từng ảnh, đủ mọi ảnh chứ không chỉ ảnh đầu.
    const toImages = (gallery: any[] | undefined) =>
        (gallery || [])
            .map((g: any) =>
                typeof g === "object" && g?.url ? { url: g.url, alt: g.alt || localizedProduct.title } : null
            )
            .filter(Boolean) as { alt?: string; url: string }[];
    const variantImages = toImages(localizedProduct.variants?.[0]?.gallery);
    const allImages = variantImages.length > 0 ? variantImages : toImages(localizedProduct.gallery);
    const thumbnail =
        selectedVariant?.imageUrl ||
        (typeof localizedProduct.variants?.[0]?.gallery?.[0] === "object"
            ? localizedProduct.variants[0].gallery[0].url
            : null) ||
        localizedProduct.thumbnail;

    const firstCollection =
        localizedProduct.collections?.[0] && typeof localizedProduct.collections[0] === "object"
            ? (localizedProduct.collections[0] as { handle: string; title: string })
            : null;

    const breadcrumbItems = [
        { href: locale === "en" ? "/en/snus" : "/snus", label: dict.common.shop },
        ...(firstCollection
            ? [
                  {
                      href: locale === "en" ? `/en/snus-${firstCollection.handle}` : `/snus-${firstCollection.handle}`,
                      label: firstCollection.title,
                  },
              ]
            : []),
        { label: localizedProduct.title || dict.common.products },
    ];

    const allOptionsSelected = (localizedProduct.variantOptions || []).every(
        (opt: any) => selectedOptions[opt.option]
    );
    const isNotForSale = localizedProduct.notForSale === true;
    // Hết hàng: cờ inStock tắt HOẶC tồn kho variant đang chọn = 0 (cùng quy tắc với card)
    const isOutOfStock =
        localizedProduct.inStock === false || selectedVariant?.stockCount === 0;

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />

            {/* Desktop: 2 equal columns — LEFT: Image + Article, RIGHT: Info + Actions + Tabs */}
            {/* Mobile: stacked — Image → Info → Actions → Tabs → Article */}
            <div className="content-container py-4 sm:py-6 lg:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10">

                    {/* LEFT: Image Gallery */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <ImageGallery
                            images={allImages}
                            thumbnail={thumbnail}
                        />
                    </div>

                    {/* RIGHT: Product Info + Actions + Tabs */}
                    <div>
                        <ProductInfo product={localizedProduct} />

                        <div className="mt-4">
                            <ProductActions
                                product={localizedProduct}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={setSelectedOptions}
                            />
                            {isNotForSale ? null : isOutOfStock ? (
                                <RestockNotifyForm locale={locale} productId={localizedProduct.id} />
                            ) : (
                                <PromotionInfo locale={locale} promotion={promotion} />
                            )}
                        </div>

                        <ProductTabs product={localizedProduct} />
                    </div>
                </div>

            </div>

            {/* Mô tả sản phẩm + Reviews — 2 cột desktop, stack mobile */}
            <div className="content-container py-6 sm:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* LEFT: Mô tả sản phẩm */}
                    {localizedProduct.articleBody && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                                {locale === "en" ? "Product Description" : "Mô tả sản phẩm"}
                            </h2>
                            <ProductArticle articleBody={localizedProduct.articleBody} />
                        </div>
                    )}

                    {/* RIGHT: Reviews */}
                    <div className={!localizedProduct.articleBody ? "lg:col-span-2" : ""}>
                        <ProductReviews
                            cmsReviews={reviews}
                            productHandle={localizedProduct.handle}
                            rating={localizedProduct.rating}
                            reviewCount={localizedProduct.reviewCount}
                        />
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="content-container my-6 sm:my-10 lg:my-16">
                <RelatedProducts products={relatedProducts} />
            </div>

            {/* Blog articles matching this product's brand */}
            {blogArticles.length > 0 && (
                <BlogSection articles={blogArticles} />
            )}
        </>
    );
}
