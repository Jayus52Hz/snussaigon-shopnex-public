import { getStockGroup } from "@/utils/product-availability";
import { getProductImageUrl } from "@/utils/product-image";

/**
 * URL ảnh OG tự sinh (route `app/og/...`). Tham số `v` = hash các dữ liệu hiện trên ảnh:
 * đổi giá / tên / ảnh → URL đổi → Facebook, Zalo, nginx không giữ ảnh cũ.
 */

/** Kích thước mọi ảnh OG tự sinh. */
export const OG_SIZE = { width: 1200, height: 630 };

/** Ảnh OG tự sinh (route app/og/*) — dùng để khai báo og:image:width/height. */
export const isGeneratedOgImage = (url: string): boolean => url.startsWith("/og/");

/** FNV-1a 32-bit — đủ để đổi URL khi dữ liệu đổi, không cần crypto. */
function hash(parts: unknown[]): string {
    let h = 0x811c9dc5;
    const s = parts.map((p) => String(p ?? "")).join("|");
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
}

/** Dữ liệu giá hiển thị trên ảnh OG sản phẩm (cùng nguồn với trang chi tiết). */
export function productOgPrice(product: any): { price: number; originalPrice?: number } | null {
    if (product?.notForSale === true) return null;
    const variant = product?.variants?.[0];
    const price = Number(variant?.price) || 0;
    if (price <= 0) return null;
    const original = Number(variant?.originalPrice) || 0;
    return { price, ...(original > price ? { originalPrice: original } : {}) };
}

export function productOgImageUrl(product: any): string {
    const price = productOgPrice(product);
    const v = hash([product.title, product.brand, price?.price, price?.originalPrice, getProductImageUrl(product)]);
    return `/og/product/${encodeURIComponent(product.handle)}?v=${v}`;
}

/** Slug thương hiệu của SP — cùng quy tắc bộ lọc brand ở trang danh mục (use-shop-filters). */
const brandSlugOf = (p: any): string => String(p?.brand || "").toLowerCase().replace(/\s+/g, "-");

/**
 * SP đầu tiên của trang /snus-{brand} theo sort "Mặc định": còn hàng → hết hàng → Chưa kinh doanh,
 * trong nhóm giữ thứ tự API (StoreTemplate không bật defaultSortByStock ở trang hãng).
 * `products` = cùng danh sách trang hãng dùng (getProducts(..., "snus", "all")).
 */
export function pickBrandOgProduct(products: any[], brandSlug: string): any | undefined {
    return products
        .filter((p) => brandSlugOf(p) === brandSlug)
        .sort((a, b) => getStockGroup(a) - getStockGroup(b))[0];
}

export function brandOgImageUrl(brandSlug: string, brandName: string, logo: string | undefined, product: any): string {
    const v = hash([brandName, logo, product?.id, getProductImageUrl(product)]);
    return `/og/brand/${encodeURIComponent(brandSlug)}?v=${v}`;
}
