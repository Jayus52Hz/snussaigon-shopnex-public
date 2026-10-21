/**
 * Khuyến mãi theo tổng số lượng sản phẩm trong giỏ — bản HIỂN THỊ.
 * Nguồn chuẩn (checkout tính lại ở server): apps/simple-shop/src/lib/quantity-promotion.ts
 * — sửa logic ở đó thì sửa cả ở đây.
 */
export type PromotionTier = {
    minQuantity: number;
    type: "shipping" | "percentage";
    value?: number | null;
    maxAmount?: number | null;
    label?: string | null;
};

export type Promotion = {
    id: number | string;
    name: string;
    note?: string | null;
    tiers: PromotionTier[];
};

// Cùng định dạng với convertToLocale (giá trong giỏ): "40.000 ₫"
const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { currency: "VND", maximumFractionDigits: 0, style: "currency" }).format(n);

/** Bậc có `minQuantity` cao nhất mà giỏ đạt được, hoặc null. */
export function pickTier(tiers: PromotionTier[], totalQuantity: number): PromotionTier | null {
    let best: PromotionTier | null = null;
    for (const tier of tiers) {
        if (!(tier.minQuantity > 0) || totalQuantity < tier.minQuantity) continue;
        if (!best || tier.minQuantity > best.minQuantity) best = tier;
    }
    return best;
}

/** Số tiền giảm (VND) của một bậc. */
export function tierAmount(
    tier: PromotionTier,
    { subtotal, shippingFee }: { subtotal: number; shippingFee: number }
): number {
    const max = tier.maxAmount && tier.maxAmount > 0 ? tier.maxAmount : null;
    if (tier.type === "shipping") {
        return Math.max(0, max === null ? shippingFee : Math.min(max, shippingFee));
    }
    const pct = Math.min(100, Math.max(0, tier.value ?? 0));
    const amount = Math.round((subtotal * pct) / 100);
    return Math.min(subtotal, max === null ? amount : Math.min(max, amount));
}

/** Câu mô tả một bậc (dòng chương trình trên trang sản phẩm). */
export function tierLabel(tier: PromotionTier, locale: string): string {
    if (tier.label?.trim()) return tier.label.trim();
    const en = locale === "en";
    const max = tier.maxAmount && tier.maxAmount > 0 ? tier.maxAmount : null;
    if (tier.type === "shipping") {
        if (en) {
            return max
                ? `${tier.minQuantity}+ items: up to ${fmt(max)} off shipping`
                : `${tier.minQuantity}+ items: free shipping`;
        }
        return max
            ? `Từ ${tier.minQuantity} sản phẩm: giảm tối đa ${fmt(max)} phí ship`
            : `Từ ${tier.minQuantity} sản phẩm: miễn phí ship`;
    }
    const cap = max ? (en ? ` (up to ${fmt(max)})` : ` (tối đa ${fmt(max)})`) : "";
    return en
        ? `${tier.minQuantity}+ items: ${tier.value ?? 0}% off${cap}`
        : `Từ ${tier.minQuantity} sản phẩm: giảm ${tier.value ?? 0}%${cap}`;
}

/** Dòng hiển thị dưới Tạm tính khi giỏ đạt một bậc. */
export function appliedLabel(tier: PromotionTier, locale: string): string {
    const en = locale === "en";
    const max = tier.maxAmount && tier.maxAmount > 0 ? tier.maxAmount : null;
    if (tier.type === "shipping") {
        if (en) return max ? `Up to ${fmt(max)} off shipping applied` : "Free shipping applied";
        return max ? `Đã được giảm tối đa ${fmt(max)} phí ship` : "Đã được miễn phí ship";
    }
    return en
        ? `${tier.value ?? 0}% off (${tier.minQuantity}+ items)`
        : `Giảm ${tier.value ?? 0}% (từ ${tier.minQuantity} sản phẩm)`;
}

export function computePromotion(
    promotion: Promotion | null | undefined,
    { totalQuantity, subtotal, shippingFee }: { totalQuantity: number; subtotal: number; shippingFee: number }
): { tier: PromotionTier; amount: number } | null {
    if (!promotion) return null;
    const tier = pickTier(promotion.tiers, totalQuantity);
    if (!tier) return null;
    return { tier, amount: tierAmount(tier, { subtotal, shippingFee }) };
}
