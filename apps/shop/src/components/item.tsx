"use client";

import { useLocale } from "@/i18n/locale-provider";
import { convertToLocale } from "@/utils/money";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "react-use-cart";

import Spinner from "./icons/spinner";

type ItemProps = {
    currencyCode: string;
    item: any;
    type?: "full" | "preview";
};

const Item = ({ type = "full", currencyCode, item }: ItemProps) => {
    const [updating, setUpdating] = useState(false);
    const { updateItemQuantity, removeItem } = useCart();
    const { dict, locale } = useLocale();

    // Try every possible source for the product image
    const resolveImage = () => {
        const g = item.gallery;
        if (Array.isArray(g) && g.length > 0) {
            const first = g[0];
            const url = typeof first === 'object' ? (first?.url || first?.thumbnailURL) : null;
            if (url) return url;
        }
        if (item.thumbnail) return item.thumbnail;
        if (item.imageUrl) return item.imageUrl;
        return null;
    };

    const [imageUrl, setImageUrl] = useState<string | null>(resolveImage);

    // Fetch thumbnail from API if not available (old localStorage items)
    useEffect(() => {
        if (imageUrl) return;
        const handle = item.handle || item.productId;
        if (!handle) return;
        const base = process.env.NEXT_PUBLIC_STOREFRONT_URL || "";
        fetch(`${base}/api/products?where[handle][equals]=${handle}&limit=1&depth=2`)
            .then((r) => r.json())
            .then((data) => {
                const g = data?.docs?.[0]?.gallery;
                if (Array.isArray(g) && g.length > 0 && g[0]?.url) {
                    setImageUrl(g[0].url);
                }
            })
            .catch(() => {});
    }, [item.handle, item.productId, imageUrl]);

    const handleQuantityChange = (newQty: number) => {
        if (newQty <= 0) {
            removeItem(item.id);
            return;
        }
        setUpdating(true);
        setTimeout(() => {
            updateItemQuantity(item.id, newQty);
            setUpdating(false);
        }, 200);
    };

    if (type === "preview") {
        return (
            <div className="flex gap-3 py-2">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            src={imageUrl}
                        />
                    ) : (
                        <span className="text-gray-400 text-xs">?</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                        {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                        {locale === "en" ? "Qty" : "SL"}: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-red-600">
                        {convertToLocale({
                            amount: item.price * item.quantity,
                            currency_code: currencyCode,
                        })}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4">
            {/* Product Image */}
            <Link
                className="flex-shrink-0"
                href={`/${item.handle || item.productId}`}
            >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            src={imageUrl}
                        />
                    ) : (
                        <span aria-label="product" role="img">📦</span>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <Link
                    href={`/${item.handle || item.productId}`}
                >
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 hover:text-blue-600 transition-colors">
                        {item.productName}
                    </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                    {[item.brand, item.strength ? `${item.strength}/pouch` : ""]
                        .filter(Boolean)
                        .join(" • ")}
                </p>
                <p className="font-semibold text-red-600 mt-2">
                    {convertToLocale({
                        amount: item.price,
                        currency_code: currencyCode,
                    })}
                </p>
            </div>

            {/* Actions — right side */}
            <div className="flex flex-col items-end justify-between">
                <button
                    aria-label={locale === "en" ? "Remove item" : "Xóa sản phẩm"}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    onClick={() => removeItem(item.id)}
                    type="button"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                    <button
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                        disabled={updating}
                        onClick={() =>
                            handleQuantityChange(item.quantity - 1)
                        }
                        type="button"
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                        {updating ? (
                            <Spinner />
                        ) : (
                            item.quantity
                        )}
                    </span>
                    <button
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                        disabled={updating}
                        onClick={() =>
                            handleQuantityChange(item.quantity + 1)
                        }
                        type="button"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>

                {/* Line Total */}
                <p className="text-sm font-semibold">
                    {convertToLocale({
                        amount: item.price * item.quantity,
                        currency_code: currencyCode,
                    })}
                </p>
            </div>
        </div>
    );
};

export default Item;
