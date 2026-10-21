import { payloadSdk } from "@/utils/payload-sdk";
import { locationManyWhereClause } from "@/i18n/location-constants";
import { getStrengthSlug } from "@/utils/product-strength";
import { hasProductImage } from "@/utils/product-image";

export const getVariants = async (variantIds: string[]) => {
    const products = await payloadSdk.find({
        collection: "products",
        where: {
            "variants.id": {
                in: variantIds,
            },
        },
    });

    const variantsMap = new Map<string, any>();

    for (const product of products.docs) {
        const variants: any[] = (product as any).variants || [product];
        for (const variant of variants) {
            if (variantIds.includes(variant.id || "")) {
                const variantGallery =
                    variant.gallery?.map((img: any) => img.url) || [];
                const productGallery =
                    (product as any).gallery?.map((img: any) => img.url) || [];

                variantsMap.set(variant.id || "", {
                    ...variant,
                    gallery:
                        variantGallery.length > 0
                            ? variantGallery
                            : productGallery,
                    product: product.id,
                });
            }
        }
    }

    return variantIds.map((id) => variantsMap.get(id)).filter(Boolean);
};

// Field mà ProductCard + bộ lọc + sort trang danh mục cần. Bỏ description/intro/meta
// (riêng description ~1,5MB cho ~290 SP) vì danh sách được serialize xuống client.
const LISTING_SELECT = {
    title: true,
    handle: true,
    currency: true,
    productType: true,
    inStock: true,
    notForSale: true,
    badge: true,
    brand: true,
    nicotine_mg: true,
    portion_count: true,
    format: true,
    flavor: true,
    flavorCategory: true,
    gallery: true,
    variants: true,
    createdAt: true,
} as const;

const PRODUCTS_PAGE_SIZE = 200;

export const getProducts = async (
    locale?: string,
    locationId?: null | string,
    productType?: string,
    /** "in" = chỉ còn hàng (mặc định, dùng cho gợi ý SP); "all" = mọi SP visible (trang danh mục, lọc Availability ở client). */
    stock: "all" | "in" = "in",
) => {
    const locWhere = locationManyWhereClause(locationId);
    const baseWhere: Record<string, any> = {
        visible: { equals: true },
    };
    if (stock === "in") baseWhere.inStock = { equals: true };
    // Tách nhóm snus / caffeine. Bỏ trống = lấy tất cả (giữ tương thích cũ).
    if (productType) baseWhere.productType = { equals: productType };
    const where = locWhere ? { and: [baseWhere, locWhere] } : baseWhere;
    const fetchPage = (page: number) =>
        payloadSdk.find({
            collection: "products",
            limit: PRODUCTS_PAGE_SIZE,
            page,
            ...(locale ? { locale: locale as any } : {}),
            ...(stock === "all" ? { select: LISTING_SELECT as any } : {}),
            where,
        });
    // Lấy hết các trang (không cắt cứng ở 200 SP).
    const first = await fetchPage(1);
    const docs = [...first.docs];
    const totalPages = first.totalPages || 1;
    if (totalPages > 1) {
        const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
        );
        for (const r of rest) docs.push(...r.docs);
    }
    // SP chưa có ảnh không hiện trên web (catalog, trang hãng, gợi ý…)
    return docs.filter(hasProductImage);
};

/**
 * Sản phẩm gợi ý cho trang chi tiết ("Có thể bạn cũng thích").
 * - Chỉ lấy sản phẩm CÒN HÀNG (inStock) + visible + đúng location (qua getProducts).
 * - Ưu tiên: (1) cùng nhóm độ mạnh → (2) cùng vị → (3) còn lại.
 * - Loại sản phẩm đang xem, không trùng lặp, giữ đúng `limit`.
 */
export const getRelatedProducts = async ({
    product,
    locale,
    locationId,
    limit = 4,
}: {
    product: any;
    locale?: string;
    locationId?: null | string;
    limit?: number;
}) => {
    // Pool: sản phẩm còn hàng + visible + CÙNG NHÓM (snus/caffeine) với SP đang xem
    const pool = (await getProducts(locale, locationId, product?.productType)).filter(
        (p: any) => String(p.id) !== String(product?.id),
    ) as any[];

    const currentMg =
        typeof product?.nicotine_mg === "number" ? product.nicotine_mg : null;
    const currentStrength = currentMg != null ? getStrengthSlug(currentMg) : null;
    const currentFlavor = (product?.flavor || "").toString().toLowerCase().trim();

    const sameStrength: any[] = [];
    const sameFlavor: any[] = [];
    const rest: any[] = [];

    for (const p of pool) {
        const mg = typeof p.nicotine_mg === "number" ? p.nicotine_mg : null;
        const strength = mg != null ? getStrengthSlug(mg) : null;
        const flavor = (p.flavor || "").toString().toLowerCase().trim();

        if (currentStrength && strength === currentStrength) {
            sameStrength.push(p);
        } else if (currentFlavor && flavor === currentFlavor) {
            sameFlavor.push(p);
        } else {
            rest.push(p);
        }
    }

    // Ghép theo thứ tự ưu tiên + dedup theo id
    const seen = new Set<string>();
    const ranked: any[] = [];
    for (const p of [...sameStrength, ...sameFlavor, ...rest]) {
        const id = String(p.id);
        if (seen.has(id)) continue;
        seen.add(id);
        ranked.push(p);
        if (ranked.length >= limit) break;
    }

    return ranked;
};

/**
 * Đánh giá hiển thị cho 1 sản phẩm — chỉ review đã duyệt (approved),
 * mới nhất trước. Liên kết bằng productId (number).
 */
export const getProductReviews = async (productId: number | string, limit = 100) => {
    if (productId == null || productId === "") return [];
    const result = await payloadSdk.find({
        collection: "reviews" as any,
        limit,
        sort: "-reviewDate",
        where: {
            productId: { equals: Number(productId) },
            approved: { equals: true },
        } as any,
    });
    return result.docs || [];
};

/** "ice-caffeine" → "Ice Caffeine" (fallback khi term không có trong CMS). */
function humanizeSlug(value: string): string {
    return value
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/**
 * Resolve slug attribute của 1 sản phẩm → TÊN khai báo trong CMS Attributes
 * (locale-aware). Chạy SERVER-SIDE để SSR ra đúng tên ngay (không nháy, tốt SEO).
 * Trả về object nhãn hiển thị cho product-tabs; luôn có giá trị (fallback viết hoa).
 */
export const getProductSpecLabels = async (product: any, locale = "vi") => {
    const isEn = locale === "en";
    const map: Record<string, Record<string, string>> = {};
    try {
        const res = await payloadSdk.find({
            collection: "attributes" as any,
            depth: 1,
            limit: 30,
        });
        for (const attr of res.docs || []) {
            const terms: Record<string, string> = {};
            for (const t of (attr as any).terms || []) {
                terms[t.slug] = (isEn ? t.name_en || t.name : t.name) || t.slug;
            }
            map[(attr as any).slug] = terms;
        }
    } catch {
        // Không lấy được attributes → fallback humanize bên dưới.
    }
    const label = (attrSlug: string, value?: null | string): string => {
        if (value == null || value === "") return "";
        return map[attrSlug]?.[value] || humanizeSlug(String(value));
    };
    return {
        brand: label("brand", product.brand),
        origin: label("origin", product.origin_country || product.origin),
        format: label("format", product.format),
        flavor: label("flavor", product.flavor || product.flavour),
        netWeight: label("net-weight", product.netWeight || product.weight),
        pouchSize: label("pouch-size", product.pouchSize),
        nicotineType: label("nicotine-type", product.nicotineType),
    };
};

/**
 * Tên hiển thị của 1 danh mục (từ Attributes → nhóm "category"), theo locale.
 * Trả null nếu slug không phải danh mục hợp lệ → dùng để 404 trang /danh-muc/[slug].
 */
export const getCategoryName = async (
    slug: string,
    locale = "vi",
): Promise<null | string> => {
    if (!slug) return null;
    try {
        const res = await payloadSdk.find({
            collection: "attributes" as any,
            depth: 1,
            limit: 1,
            where: { slug: { equals: "category" } } as any,
        });
        const attr = res.docs?.[0] as any;
        const term = (attr?.terms || []).find((t: any) => t.slug === slug);
        if (!term) return null;
        return (locale === "en" ? term.name_en || term.name : term.name) || slug;
    } catch {
        return null;
    }
};

/**
 * Brand hợp lệ cho trang /snus-{brand}? Trả tên hiển thị (theo locale) hoặc null → 404.
 * Hợp lệ khi: có term trong Attributes "brand" HOẶC có ít nhất 1 sản phẩm thuộc brand.
 * Fail-open: nếu CMS lỗi (cả 2 query throw) → coi hợp lệ, tránh 404 oan hàng loạt.
 */
export const getBrandInfo = async (
    slug: string,
    locale = "vi",
): Promise<null | { name: string }> => {
    if (!slug) return null;
    const fallbackName = slug.charAt(0).toUpperCase() + slug.slice(1);
    let apiReachable = false;
    try {
        const res = await payloadSdk.find({
            collection: "attributes" as any,
            depth: 1,
            limit: 1,
            where: { slug: { equals: "brand" } } as any,
        });
        apiReachable = true;
        const term = ((res.docs?.[0] as any)?.terms || []).find(
            (t: any) => t.slug === slug,
        );
        if (term) {
            const name =
                (locale === "en" ? term.name_en || term.name : term.name) || fallbackName;
            return { name };
        }
    } catch {
        // thử tiếp bằng products
    }
    try {
        const res = await payloadSdk.find({
            collection: "products",
            depth: 0,
            limit: 1,
            where: { brand: { equals: slug }, visible: { equals: true } } as any,
        });
        apiReachable = true;
        if (res.docs?.length) return { name: fallbackName };
    } catch {
        // rơi xuống fail-open bên dưới
    }
    return apiReachable ? null : { name: fallbackName };
};

export const getProduct = async (handle: string, locale?: string) => {
    const product = await payloadSdk.find({
        collection: "products",
        depth: 2,
        limit: 1,
        ...(locale ? { locale: locale as any, fallbackLocale: "vi" as any } : {}),
        where: {
            handle: {
                equals: handle,
            },
        },
    });

    return product.docs[0];
};

export const getPaginatedProducts = async ({
    collectionId,
    limit = 12,
    locationId,
    page = 1,
    productsIds,
    sortBy,
}: {
    collectionId?: string;
    limit?: number;
    locationId?: null | string;
    page?: number;
    productsIds?: string[];
    sortBy?: string;
}) => {
    let where: Record<string, any> = {};

    if (collectionId) {
        where = {
            ...where,
            "collection.id": {
                equals: collectionId,
            },
        };
    }

    if (productsIds && productsIds.length > 0) {
        where = {
            ...where,
            id: {
                in: productsIds,
            },
        };
    }

    const locWhere = locationManyWhereClause(locationId);
    if (locWhere) {
        where = Object.keys(where).length > 0 ? { and: [where, locWhere] } : locWhere;
    }

    const [sortName, sortDirection] = sortBy?.split("_") || [];

    const sort =
        sortDirection === "asc"
            ? `variants.[0].${sortName}`
            : `-variants.[0].${sortName}`;

    const products = await payloadSdk.find({
        collection: "products",
        limit,
        page,
        sort,
        where,
    });

    return {
        docs: products.docs,
        limit: products.limit,
        page: products.page,
        total: products.totalDocs,
        // pages: products.pages,
    };
};
