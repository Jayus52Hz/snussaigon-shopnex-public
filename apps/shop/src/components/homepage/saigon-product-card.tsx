"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

import { type SaigonProduct, formatVND } from "./saigon-mock-data";

const BADGE_BASE =
    "absolute left-2.5 top-2.5 z-10 inline-block rounded-[2px] px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.08em]";
const BADGE_STYLE: Record<NonNullable<SaigonProduct["badge"]>, string> = {
    NEW: "bg-saigon-base text-white",
    HOT: "bg-saigon-base text-white",
    SALE: "bg-saigon-base text-white",
    "HẾT HÀNG": "bg-saigon-border-dark text-white/70",
};

export default function SaigonProductCard({ product }: { product: SaigonProduct }) {
    const [added, setAdded] = useState(false);
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-[10px] border border-saigon-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-saigon-base hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]">
            <Link
                className="relative block aspect-square overflow-hidden bg-[var(--color-saigon-bg-soft,#f5f5f2)]"
                href="#"
            >
                {product.badge && (
                    <span className={`${BADGE_BASE} ${BADGE_STYLE[product.badge]}`}>
                        {product.badge}
                    </span>
                )}
                <Image
                    alt={product.name}
                    className="object-contain p-4 transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06] md:p-6"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    src={product.image}
                />
            </Link>
            <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 md:px-4">
                <p className="font-display truncate text-[12px] font-medium uppercase tracking-[0.1em] text-saigon-grey">
                    {product.brand} · {product.flavour}
                </p>
                <h3 className="font-body mt-1.5 line-clamp-2 min-h-[42px] text-[15px] font-medium leading-[1.35] text-saigon-base">
                    {product.name}
                </h3>
                <p className="font-body mt-1.5 text-[13px] text-saigon-grey">
                    {product.strength} · {product.pouches} pouches
                </p>
                <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-body text-[16px] font-semibold text-saigon-base">
                        {formatVND(product.price)}
                    </span>
                    {product.originalPrice && (
                        <>
                            <span className="font-body text-[13px] text-saigon-grey line-through">
                                {formatVND(product.originalPrice)}
                            </span>
                            {discount > 0 && (
                                <span className="font-body text-[12px] font-semibold text-saigon-red">
                                    −{discount}%
                                </span>
                            )}
                        </>
                    )}
                </div>
                <button
                    aria-label="Thêm vào giỏ"
                    className={`mt-3.5 inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-[2px] border px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.08em] transition-all ${
                        added
                            ? "border-saigon-base bg-saigon-base text-white"
                            : "border-saigon-base text-saigon-base hover:bg-saigon-base hover:text-white"
                    }`}
                    onClick={() => {
                        setAdded(true);
                        setTimeout(() => setAdded(false), 1200);
                    }}
                    type="button"
                >
                    {added ? (
                        <>
                            <Check className="h-3.5 w-3.5" /> Đã thêm
                        </>
                    ) : (
                        <>
                            Thêm vào giỏ
                            <Plus className="h-3.5 w-3.5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
