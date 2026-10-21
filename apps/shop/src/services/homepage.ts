import type { HomepageData } from "@/types/homepage";
import type { Promotion } from "@/utils/quantity-promotion";

import { unstable_cache } from "next/cache";
import { payloadSdk } from "@/utils/payload-sdk";
import { hasProductImage } from "@/utils/product-image";
import {
    locationManyWhereClause,
    locationWhereClause,
} from "@/i18n/location-constants";

/* ─────────────────────────────────────────────────────────────────────────────
 * Data cache (Perf #4/#5)
 *
 * Các lệnh gọi Payload đọc (read-only) được bọc `unstable_cache` để lưu ở Next
 * Data Cache — trang vẫn render động (do cookie locale/location) nhưng KHÔNG gọi
 * lại CMS/DB mỗi request, cắt phần lớn TTFB.
 *
 * Cache key = keyParts + arguments của hàm ⇒ `locationId`/`locale` truyền vào tự
 * động vào key, không lẫn dữ liệu giữa cửa hàng / ngôn ngữ.
 *
 * `unstable_cache` KHÔNG cache promise reject → lỗi CMS thoáng qua không bị pin.
 * Với hàm vốn `try/catch` nuốt lỗi, phần fetch (có thể throw) nằm TRONG cache còn
 * fallback nằm NGOÀI, nên fallback lỗi cũng không bị cache.
 * ──────────────────────────────────────────────────────────────────────────── */
const REVALIDATE_STATIC = 300; // nội dung ít đổi (brand, faq, banner, …)
const REVALIDATE_PRODUCTS = 120; // sản phẩm (tồn kho có thể đổi)
const REVALIDATE_BLOG = 120; // blog

export async function getHomepageData(): Promise<HomepageData> {
    const result = await payloadSdk.find({
        collection: "homepage" as any,
    });
    const data: any = result.docs?.[0] || result;
    return data;
}

export const getBanners = unstable_cache(
    async (locationId?: null | string) => {
        const where = locationWhereClause(locationId);
        const result = await payloadSdk.find({
            collection: "banners" as any,
            sort: "sortOrder",
            ...(where ? { where } : {}),
        });
        return result.docs || [];
    },
    ["homepage:getBanners"],
    { revalidate: REVALIDATE_STATIC, tags: ["banners"] }
);

export const getTopbar = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "topbar" as any,
            sort: "sortOrder",
        });
        return result.docs || [];
    },
    ["homepage:getTopbar"],
    { revalidate: REVALIDATE_STATIC, tags: ["topbar"] }
);

export const getTrustBadges = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "trust-badges" as any,
        });
        return result.docs || [];
    },
    ["homepage:getTrustBadges"],
    { revalidate: REVALIDATE_STATIC, tags: ["trust-badges"] }
);

/**
 * Attributes cho bộ lọc trang danh mục (thứ tự mục, tên term VI/EN). Lấy SERVER-side
 * để SSR ra đúng tên ngay; fetch phía client từng thất bại trên production → bộ lọc
 * rơi về hiện slug ("berry", "slim"). Lỗi CMS → [] (hook tự fetch lại phía client).
 */
export const getFilterAttributes = unstable_cache(
    async (): Promise<any[]> => {
        const result = await payloadSdk.find({
            collection: "attributes" as any,
            depth: 1,
            limit: 50,
        });
        return result.docs || [];
    },
    ["shop:getFilterAttributes"],
    { revalidate: REVALIDATE_STATIC, tags: ["attributes"] }
);

/**
 * Term của attribute "Thương hiệu" (slug "brand") — nguồn cho bộ lọc brand ở
 * trang danh mục. Lấy SERVER-side (đáng tin, không phụ thuộc fetch client) và
 * sắp theo sortOrder. Trả [{ name, slug, image? }] — image = URL logo (nếu có).
 */
export const getBrandTerms = unstable_cache(
    async (): Promise<{ name: string; slug: string; image?: string }[]> => {
        const result = await payloadSdk.find({
            collection: "attributes" as any,
            depth: 1,
            limit: 1,
            where: { slug: { equals: "brand" } } as any,
        });
        const attr: any = result.docs?.[0];
        const terms: any[] = Array.isArray(attr?.terms) ? attr.terms : [];
        return terms
            .slice()
            .sort((a, b) => (a?.sortOrder ?? 99) - (b?.sortOrder ?? 99))
            .map((t) => ({
                name: t?.name || t?.slug || "",
                slug: t?.slug || "",
                image: (typeof t?.image === "object" && t.image?.url) || undefined,
            }))
            .filter((t) => t.slug);
    },
    ["homepage:getBrandTerms"],
    { revalidate: REVALIDATE_STATIC, tags: ["attributes"] }
);

/** Merge a base `where` with the location clause (and-joined when both set). */
function mergeWhere(
    base: Record<string, any> | undefined,
    locWhere: Record<string, any> | undefined
) {
    if (!locWhere) return base;
    if (!base) return locWhere;
    return { and: [base, locWhere] };
}

/** SP chưa có ảnh không hiện trên web → bỏ, giữ tối đa `limit` SP. */
const withImages = (docs: any[], limit: number) => docs.filter(hasProductImage).slice(0, limit);

/** Mục "Bán chạy nhất" — sản phẩm gắn badge "Best Seller (Hot)" trong CMS. */
export const getBestSellers = unstable_cache(
    async (locationId?: null | string) => {
        const locWhere = locationManyWhereClause(locationId);
        const where = mergeWhere({ badge: { equals: "hot" }, productType: { equals: "snus" }, inStock: { equals: true }, visible: { equals: true } }, locWhere);
        const result = await payloadSdk.find({
            collection: "products" as any,
            depth: 2,
            // Lấy dư để còn đủ 8 SP sau khi bỏ SP chưa có ảnh
            limit: 16,
            sort: "-rating",
            where: where as any,
        });
        return withImages(result.docs || [], 8);
    },
    ["homepage:getBestSellers"],
    { revalidate: REVALIDATE_PRODUCTS, tags: ["products"] }
);

export const getNewArrivals = unstable_cache(
    async (locationId?: null | string) => {
        const locWhere = locationManyWhereClause(locationId);
        const where = mergeWhere({ badge: { equals: "new" }, productType: { equals: "snus" }, inStock: { equals: true }, visible: { equals: true } }, locWhere);
        const result = await payloadSdk.find({
            collection: "products" as any,
            depth: 2,
            // Lấy dư để còn đủ 8 SP sau khi bỏ SP chưa có ảnh
            limit: 16,
            sort: "-createdAt",
            where: where as any,
        });
        return withImages(result.docs || [], 8);
    },
    ["homepage:getNewArrivals"],
    { revalidate: REVALIDATE_PRODUCTS, tags: ["products"] }
);

/** Mục "Sản phẩm nổi bật" — sản phẩm tick "Featured Product" trong CMS. */
export const getFeaturedProducts = unstable_cache(
    async (locationId?: null | string) => {
        const locWhere = locationManyWhereClause(locationId);
        const where = mergeWhere({ featured: { equals: true }, productType: { equals: "snus" }, inStock: { equals: true }, visible: { equals: true } }, locWhere);
        const result = await payloadSdk.find({
            collection: "products" as any,
            depth: 2,
            // Lấy dư để còn đủ 8 SP sau khi bỏ SP chưa có ảnh
            limit: 16,
            sort: "-rating",
            where: where as any,
        });
        return withImages(result.docs || [], 8);
    },
    ["homepage:getFeaturedProducts"],
    { revalidate: REVALIDATE_PRODUCTS, tags: ["products"] }
);

export const getFeaturedBrandProducts = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "products" as any,
            depth: 2,
            limit: 28,
            where: { badge: { equals: "featured" }, productType: { equals: "snus" }, inStock: { equals: true }, visible: { equals: true } } as any,
        });
        return withImages(result.docs || [], 20);
    },
    ["homepage:getFeaturedBrandProducts"],
    { revalidate: REVALIDATE_PRODUCTS, tags: ["products"] }
);

/**
 * Where-clause: chỉ hiện bài đã tới ngày đăng.
 * - publishedAt trống → vẫn hiện (coi như không hẹn lịch).
 * - publishedAt <= hiện tại → hiện.
 * - publishedAt ở tương lai (đã hẹn lịch) → ẩn.
 */
export function publishedWhere(): Record<string, any> {
    return {
        or: [
            { publishedAt: { exists: false } },
            { publishedAt: { less_than_equal: new Date().toISOString() } },
        ],
    };
}

export const getBlogArticles = unstable_cache(
    async (locale = "vi") => {
        const result = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit: 10,
            locale: locale as any,
            fallbackLocale: "vi" as any,
            sort: "-publishedAt",
            where: publishedWhere(),
        });
        return result.docs || [];
    },
    ["homepage:getBlogArticles"],
    { revalidate: REVALIDATE_BLOG, tags: ["blog-articles"] }
);

export const getPaginatedBlogArticles = unstable_cache(
    async ({
        brand,
        limit = 12,
        locale = "vi",
        page = 1,
        search,
    }: {
        brand?: string;
        limit?: number;
        locale?: string;
        page?: number;
        search?: string;
    } = {}) => {
        const conds: Record<string, any>[] = [publishedWhere()];
        if (brand) conds.push({ brand: { equals: brand.toLowerCase() } });
        if (search) conds.push({ title: { contains: search } });
        const result = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit,
            locale: locale as any,
            fallbackLocale: "vi" as any,
            page,
            sort: "-publishedAt",
            where: { and: conds },
        });
        return {
            docs: result.docs || [],
            totalDocs: result.totalDocs || 0,
            totalPages: result.totalPages || 1,
            page: result.page || page,
            limit,
        };
    },
    ["homepage:getPaginatedBlogArticles"],
    { revalidate: REVALIDATE_BLOG, tags: ["blog-articles"] }
);

export const getBlogArticleBySlug = unstable_cache(
    async (slug: string, locale = "vi") => {
        const result = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit: 1,
            locale: locale as any,
            fallbackLocale: "vi" as any,
            // Khớp slug mặc định HOẶC slugEn → URL tiếng Anh (slugEn) lẫn vi (slug)
            // đều resolve được về đúng bài.
            where: {
                and: [
                    { or: [{ slug: { equals: slug } }, { slugEn: { equals: slug } }] },
                    publishedWhere(),
                ],
            },
        });
        return result.docs?.[0] || null;
    },
    ["homepage:getBlogArticleBySlug"],
    { revalidate: REVALIDATE_BLOG, tags: ["blog-articles"] }
);

export const getRelatedBlogArticles = unstable_cache(
    async ({
        brand,
        excludeSlug,
        limit = 4,
        locale = "vi",
    }: {
        brand?: string;
        excludeSlug: string;
        limit?: number;
        locale?: string;
    }) => {
        const where: Record<string, any> = {
            and: [
                { slug: { not_equals: excludeSlug } },
                publishedWhere(),
                ...(brand ? [{ brand: { equals: brand.toLowerCase() } }] : []),
            ],
        };
        const result = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit,
            locale: locale as any,
            fallbackLocale: "vi" as any,
            sort: "-publishedAt",
            where,
        });
        const docs = result.docs || [];
        if (docs.length < limit && brand) {
            const more = await payloadSdk.find({
                collection: "blog-articles" as any,
                limit: limit - docs.length,
                locale: locale as any,
                fallbackLocale: "vi" as any,
                sort: "-publishedAt",
                where: {
                    and: [
                        { slug: { not_equals: excludeSlug } },
                        { brand: { not_equals: brand.toLowerCase() } },
                        publishedWhere(),
                    ],
                },
            });
            docs.push(...(more.docs || []));
        }
        return docs.slice(0, limit);
    },
    ["homepage:getRelatedBlogArticles"],
    { revalidate: REVALIDATE_BLOG, tags: ["blog-articles"] }
);

export const getBlogBrands = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit: 100,
            where: publishedWhere(),
        });
        const brands = new Set<string>();
        for (const doc of result.docs || []) {
            if (doc.brand) brands.add(doc.brand);
        }
        return Array.from(brands).sort();
    },
    ["homepage:getBlogBrands"],
    { revalidate: REVALIDATE_BLOG, tags: ["blog-articles"] }
);

export const getProductArticles = unstable_cache(
    async (brand?: string) => {
        const conds: Record<string, any>[] = [publishedWhere()];
        if (brand) conds.push({ brand: { equals: brand.toLowerCase() } });
        const result = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit: 4,
            sort: "-publishedAt",
            where: { and: conds },
        });
        return result.docs || [];
    },
    ["homepage:getProductArticles"],
    { revalidate: REVALIDATE_BLOG, tags: ["blog-articles"] }
);

export const getStoreLocations = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "store-locations" as any,
        });
        return result.docs || [];
    },
    ["homepage:getStoreLocations"],
    { revalidate: REVALIDATE_STATIC, tags: ["store-locations"] }
);

export const getFAQs = unstable_cache(
    async (locationId?: null | string) => {
        const where = locationWhereClause(locationId);
        const result = await payloadSdk.find({
            collection: "faqs" as any,
            sort: "sortOrder",
            ...(where ? { where } : {}),
        });
        return result.docs || [];
    },
    ["homepage:getFAQs"],
    { revalidate: REVALIDATE_STATIC, tags: ["faqs"] }
);

export const getMarqueeImages = unstable_cache(
    async (locationId?: null | string) => {
        const where = locationWhereClause(locationId);
        const result = await payloadSdk.find({
            collection: "marquee-images" as any,
            sort: "sortOrder",
            depth: 1,
            ...(where ? { where } : {}),
        });
        return result.docs || [];
    },
    ["homepage:getMarqueeImages"],
    { revalidate: REVALIDATE_STATIC, tags: ["marquee-images"] }
);

export const getWhyUsItems = unstable_cache(
    async (locationId?: null | string) => {
        const where = locationWhereClause(locationId);
        const result = await payloadSdk.find({
            collection: "why-us-items" as any,
            sort: "sortOrder",
            ...(where ? { where } : {}),
        });
        return result.docs || [];
    },
    ["homepage:getWhyUsItems"],
    { revalidate: REVALIDATE_STATIC, tags: ["why-us-items"] }
);

export const getHomepageStats = unstable_cache(
    async (locationId?: null | string) => {
        const where = locationWhereClause(locationId);
        const result = await payloadSdk.find({
            collection: "homepage-stats" as any,
            sort: "sortOrder",
            ...(where ? { where } : {}),
        });
        return result.docs || [];
    },
    ["homepage:getHomepageStats"],
    { revalidate: REVALIDATE_STATIC, tags: ["homepage-stats"] }
);

// try/catch nuốt lỗi → giữ fetch (có thể throw) TRONG cache, fallback NGOÀI cache
// để lỗi CMS thoáng qua không bị pin trong suốt window revalidate.
const _getLocations = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "locations" as any,
            limit: 50,
            sort: "name",
            where: { enabled: { equals: true } } as any,
        });
        return result.docs || [];
    },
    ["homepage:getLocations"],
    { revalidate: REVALIDATE_STATIC, tags: ["locations"] }
);

export async function getLocations() {
    try {
        return await _getLocations();
    } catch {
        return [];
    }
}

const _getHomepageContent = unstable_cache(
    async () => {
        return await payloadSdk.findGlobal({
            slug: "homepage-content" as any,
            depth: 1,
        });
    },
    ["homepage:getHomepageContent"],
    { revalidate: REVALIDATE_STATIC, tags: ["homepage-content"] }
);

export async function getHomepageContent() {
    try {
        return await _getHomepageContent();
    } catch {
        return null;
    }
}

export const getTrendingTerms = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "trending-searches" as any,
        });
        return result.docs || [];
    },
    ["homepage:getTrendingTerms"],
    { revalidate: REVALIDATE_STATIC, tags: ["trending-searches"] }
);

export const getProductDocuments = unstable_cache(
    async () => {
        const result = await payloadSdk.find({
            collection: "product-documents" as any,
            limit: 100,
            sort: "-createdAt",
        });
        return result.docs || [];
    },
    ["homepage:getProductDocuments"],
    { revalidate: REVALIDATE_STATIC, tags: ["product-documents"] }
);

export const getShippingSettings = unstable_cache(
    async (): Promise<{
        baseRate: number;
        freeShippingMinOrder: number;
        notes?: string;
        notes_en?: string;
    } | null> => {
        const result = await payloadSdk.find({
            collection: "shipping" as any,
            limit: 1,
            sort: "id",
            where: { enabled: { equals: true } },
        });
        const method = result.docs?.[0];
        const provider = method?.shippingProvider?.[0];
        if (!provider) return null;
        const baseRate = provider.baseRate ?? 0;
        return {
            baseRate,
            freeShippingMinOrder: provider.freeShippingMinOrder || 0,
            notes: provider.notes || undefined,
            notes_en: provider.notes_en || undefined,
        };
    },
    ["homepage:getShippingSettings"],
    { revalidate: REVALIDATE_STATIC, tags: ["shipping"] }
);

// Khuyến mãi theo số lượng (collection `promotions`) — chương trình đang bật, cập nhật gần nhất.
const _getActivePromotion = unstable_cache(
    async (locale: string): Promise<Promotion | null> => {
        const result = await payloadSdk.find({
            collection: "promotions" as any,
            locale: locale as any,
            fallbackLocale: "vi" as any,
            limit: 1,
            sort: "-updatedAt",
            where: { enabled: { equals: true } },
        });
        const doc: any = result.docs?.[0];
        if (!doc) return null;
        return {
            id: doc.id,
            name: doc.name || "",
            note: doc.note || null,
            tiers: (doc.tiers || []).map((t: any) => ({
                minQuantity: Number(t.minQuantity) || 0,
                type: t.type === "shipping" ? "shipping" : "percentage",
                value: t.value ?? null,
                maxAmount: t.maxAmount ?? null,
                label: t.label ?? null,
            })),
        };
    },
    ["homepage:getActivePromotion"],
    { revalidate: REVALIDATE_STATIC, tags: ["promotions"] }
);

/** Lỗi CMS (vd bảng chưa có) → null: không hiện khuyến mãi, không chặn trang. */
export async function getActivePromotion(locale = "vi"): Promise<Promotion | null> {
    try {
        return await _getActivePromotion(locale);
    } catch {
        return null;
    }
}

export const getSEOArticles = unstable_cache(
    async ({
        brandSlug,
        collectionHandle,
        pageType,
        locale = "vi",
    }: {
        brandSlug?: string;
        collectionHandle?: string;
        pageType?: string;
        locale?: string;
    } = {}) => {
        const where: Record<string, any> = {};
        if (pageType) where.pageType = { equals: pageType };
        if (brandSlug) where.brandSlug = { equals: brandSlug };
        if (collectionHandle) where.collectionHandle = { equals: collectionHandle };
        const result = await payloadSdk.find({
            collection: "seo-articles" as any,
            locale: locale as any,
            fallbackLocale: "vi" as any,
            where: Object.keys(where).length > 0 ? where : undefined,
        });
        return result.docs || [];
    },
    ["homepage:getSEOArticles"],
    { revalidate: REVALIDATE_STATIC, tags: ["seo-articles"] }
);
