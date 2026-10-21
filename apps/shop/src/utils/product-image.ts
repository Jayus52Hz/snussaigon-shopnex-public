/**
 * Ảnh đại diện của sản phẩm — cùng thứ tự với ProductCard (qua localizeProduct):
 * ảnh đầu gallery variant đầu tiên → thumbnail (nếu có) → ảnh đầu gallery sản phẩm.
 * Gallery phải đã populate (depth ≥ 1) thì mới có `url`.
 */
export function getProductImageUrl(product: any): string | undefined {
    const firstUrl = (gallery: unknown): string | undefined => {
        if (!Array.isArray(gallery)) return undefined;
        const img = gallery[0];
        return img && typeof img === "object" && typeof img.url === "string" && img.url ? img.url : undefined;
    };
    return (
        firstUrl(product?.variants?.[0]?.gallery) ||
        (typeof product?.thumbnail === "string" && product.thumbnail ? product.thumbnail : undefined) ||
        firstUrl(product?.gallery)
    );
}

/** SP chưa có ảnh không hiện trên web: ẩn khỏi mọi danh sách, sitemap, trang chi tiết 404. */
export function hasProductImage(product: any): boolean {
    return !!getProductImageUrl(product);
}

/**
 * Nhiều sản phẩm có thể trùng handle (dữ liệu cũ). Ưu tiên bản có ảnh, rồi bản đang hiện,
 * rồi còn hàng — tránh mở nhầm bản trùng ẩn / hết hàng / không ảnh.
 */
export function pickByHandle<T>(docs: T[]): T | undefined {
    const rank = (p: any) =>
        (hasProductImage(p) ? 4 : 0) + (p.visible !== false ? 2 : 0) + (p.inStock !== false ? 1 : 0);
    return [...docs].sort((a, b) => rank(b) - rank(a))[0];
}
