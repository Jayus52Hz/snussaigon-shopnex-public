// Hàm thuần (không "use client") để dùng được cả ở server — vd route sinh ảnh OG trang hãng.

/** Mua được: còn hàng và không gắn cờ "Chưa kinh doanh". */
export function isPurchasable(p: any): boolean {
    return p.inStock !== false && p.notForSale !== true;
}

/** Nhóm hiển thị: 0 = còn hàng, 1 = hết hàng, 2 = "Chưa kinh doanh" (luôn cuối). */
export function getStockGroup(p: any): number {
    if (p.notForSale === true) return 2;
    return p.inStock === false ? 1 : 0;
}
