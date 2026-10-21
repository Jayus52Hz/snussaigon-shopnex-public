"use client";

import { useLocale } from "@/i18n/locale-provider";
import { convertToLocale } from "@/utils/money";
import { useCart } from "react-use-cart";

import { appliedLabel, computePromotion, type Promotion } from "@/utils/quantity-promotion";

type ShippingSettings = {
    baseRate: number;
    freeShippingMinOrder: number;
    notes?: string;
    notes_en?: string;
} | null;

const Summary = ({
    shippingSettings,
    promotion,
}: {
    shippingSettings?: ShippingSettings;
    promotion?: Promotion | null;
}) => {
    const { items } = useCart();
    const { dict, locale } = useLocale();
    const isEn = locale === "en";

    if (!items.length) return null;

    const subtotal = items.reduce(
        (acc, item: any) => acc + item.price * item.quantity,
        0
    );
    const currencyCode = items[0]?.currency || "VND";

    // ── Dynamic shipping from CMS ───────────────────────────────────────────
    // null → không khai báo → ẩn phí vận chuyển
    // baseRate === -1 → ẩn phí vận chuyển (nhưng vẫn có thể hiện notes)
    const hasShipping = shippingSettings != null && shippingSettings.baseRate !== -1;
    const baseRate = shippingSettings?.baseRate ?? 0;
    const freeThreshold = shippingSettings?.freeShippingMinOrder ?? 0;
    const shippingFee = hasShipping
        ? (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : baseRate)
        : 0;
    // Khuyến mãi theo tổng số lượng — chỉ bậc cao nhất (server checkout tính lại)
    const totalQuantity = items.reduce((acc, item: any) => acc + (item.quantity || 0), 0);
    const applied = computePromotion(promotion, { totalQuantity, subtotal, shippingFee });
    const grandTotal = Math.max(0, subtotal + shippingFee - (applied?.amount ?? 0));

    // Notes theo locale
    const notes = isEn
        ? (shippingSettings?.notes_en || shippingSettings?.notes || null)
        : (shippingSettings?.notes || null);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-lg mb-4">{isEn ? "Order Summary" : "Tổng Đơn Hàng"}</h2>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">{isEn ? "Subtotal" : "Tạm tính"}</span>
                    <span>
                        {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
                    </span>
                </div>

                {applied && (
                    <div className="flex justify-between gap-3 text-emerald-700" data-component="cart-promotion">
                        <span>{appliedLabel(applied.tier, locale)}</span>
                        {applied.amount > 0 && (
                            <span className="whitespace-nowrap">
                                −{convertToLocale({ amount: applied.amount, currency_code: currencyCode })}
                            </span>
                        )}
                    </div>
                )}

                {/* Shipping fee — ẩn khi null hoặc baseRate === -1 */}
                {hasShipping && (
                    <>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{isEn ? "Shipping Fee" : "Phí vận chuyển"}</span>
                            <span>
                                {shippingFee === 0 ? (
                                    <span className="text-emerald-600 font-medium">
                                        {isEn ? "Free" : "Miễn phí"}
                                    </span>
                                ) : (
                                    convertToLocale({ amount: shippingFee, currency_code: currencyCode })
                                )}
                            </span>
                        </div>
                        {shippingFee > 0 && freeThreshold > 0 && (
                            <p className="text-xs text-gray-400">
                                {isEn
                                    ? `Free shipping for orders over ${convertToLocale({ amount: freeThreshold, currency_code: currencyCode })}`
                                    : `Miễn phí vận chuyển cho đơn từ ${convertToLocale({ amount: freeThreshold, currency_code: currencyCode })}`}
                            </p>
                        )}
                    </>
                )}

                {/* Notes từ CMS — luôn hiển thị nếu có, kể cả khi baseRate = -1 */}
                {notes && (
                    <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
                        {notes}
                    </p>
                )}

                <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-base">
                        <span>{dict.cart.total}</span>
                        <span className="text-red-600">
                            {convertToLocale({ amount: grandTotal, currency_code: currencyCode })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
