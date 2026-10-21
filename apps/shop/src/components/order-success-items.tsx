"use client";

import { convertToLocale } from "@/utils/money";
import { Package } from "lucide-react";
import Link from "next/link";

type OrderSuccessItemsProps = {
    items: any[];
    currencyCode: string;
    locale: string;
    subtotal: number;
    shippingFee: number;
    shippingHidden: boolean;
    discountLabel?: string | null;
    discountAmount?: number;
    total: number;
};

const resolveImage = (item: any): string | null => {
    const g = item.gallery;
    if (Array.isArray(g) && g.length > 0) {
        const first = g[0];
        const url = typeof first === "object" ? first?.url || first?.thumbnailURL : null;
        if (url) return url;
    }
    return item.thumbnail || item.imageUrl || null;
};

const OrderSuccessItems = ({
    items,
    currencyCode,
    locale,
    subtotal,
    shippingFee,
    shippingHidden,
    discountLabel,
    discountAmount = 0,
    total,
}: OrderSuccessItemsProps) => {
    const isEn = locale === "en";
    const money = (amount: number) => convertToLocale({ amount, currency_code: currencyCode });

    return (
        <div className="rounded-xl border border-gray-200 mb-6">
            <h3 className="text-sm font-semibold px-4 pt-4 pb-2">
                {isEn ? "Your items" : "Sản phẩm đã đặt"}
            </h3>

            <ul className="divide-y divide-gray-100">
                {items.map((item: any) => {
                    const imageUrl = resolveImage(item);
                    const name = item.productName || item.name;
                    const slug = item.handle || item.productId;
                    const href = isEn ? `/en/${slug}` : `/${slug}`;

                    return (
                        <li className="flex gap-3 px-4 py-3" key={item.id}>
                            <Link className="flex-shrink-0" href={href}>
                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                    {imageUrl ? (
                                        <img
                                            alt={name}
                                            className="w-full h-full object-cover"
                                            src={imageUrl}
                                        />
                                    ) : (
                                        <Package className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link href={href}>
                                    <p className="text-sm font-medium line-clamp-2 hover:text-blue-600 transition-colors">
                                        {name}
                                    </p>
                                </Link>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {item.quantity} × {money(item.price)}
                                </p>
                            </div>
                            <p className="text-sm font-semibold whitespace-nowrap">
                                {money(item.price * item.quantity)}
                            </p>
                        </li>
                    );
                })}
            </ul>

            <dl className="text-sm border-t border-gray-200 px-4 py-3 space-y-1.5">
                <div className="flex justify-between">
                    <dt className="text-gray-500">{isEn ? "Subtotal" : "Tạm tính"}</dt>
                    <dd>{money(subtotal)}</dd>
                </div>
                {discountLabel && (
                    <div className="flex justify-between gap-3 text-emerald-700">
                        <dt>{discountLabel}</dt>
                        {discountAmount > 0 && <dd className="whitespace-nowrap">−{money(discountAmount)}</dd>}
                    </div>
                )}
                {!shippingHidden && (
                    <div className="flex justify-between">
                        <dt className="text-gray-500">{isEn ? "Shipping" : "Phí vận chuyển"}</dt>
                        <dd>
                            {shippingFee === 0 ? (isEn ? "Free" : "Miễn phí") : money(shippingFee)}
                        </dd>
                    </div>
                )}
                <div className="flex justify-between font-semibold pt-1.5 border-t border-gray-100">
                    <dt>{isEn ? "Total" : "Tổng cộng"}</dt>
                    <dd className="text-red-600">{money(total)}</dd>
                </div>
            </dl>
        </div>
    );
};

export default OrderSuccessItems;
