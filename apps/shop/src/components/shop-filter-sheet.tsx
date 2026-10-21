"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { ActiveFilters, FilterOptions } from "@/hooks/use-shop-filters";
import { applyFilters } from "@/hooks/use-shop-filters";
import ShopFilterSidebar, { hasCustomFilters, resetFilters } from "@/components/shop-filter-sidebar";
import { useLocale } from "@/i18n/locale-provider";

/**
 * Bộ lọc mobile dạng bottom sheet: chọn nháp, số "Xem N sản phẩm" cập nhật ngay,
 * chỉ đổi URL khi bấm nút.
 */
export default function ShopFilterSheet({
    filters,
    filterOptions,
    products,
    brandSlug,
    brandHref,
    onApply,
    onClose,
}: {
    filters: ActiveFilters;
    filterOptions: FilterOptions;
    products: any[];
    brandSlug?: string;
    brandHref?: (slug: string) => string;
    onApply: (next: ActiveFilters) => void;
    onClose: () => void;
}) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const [draft, setDraft] = useState<ActiveFilters>(filters);
    const matched = useMemo(() => applyFilters(products, draft).length, [products, draft]);

    // Khoá cuộn trang nền + Esc để đóng
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div aria-modal="true" className="fixed inset-0 z-50 md:hidden" role="dialog">
            <button
                aria-label={isEn ? "Close filters" : "Đóng bộ lọc"}
                className="absolute inset-0 h-full w-full cursor-default bg-black/40"
                onClick={onClose}
                type="button"
            />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-2xl">
                <div className="flex justify-center pb-1 pt-3">
                    <span className="h-1 w-10 rounded-full bg-gray-200" />
                </div>
                <div className="flex items-center justify-between px-5 pb-3">
                    <h2 className="font-display text-lg font-bold">{isEn ? "Filters" : "Bộ lọc"}</h2>
                    <div className="flex items-center gap-3">
                        {hasCustomFilters(draft, brandSlug) && (
                            <button
                                className="text-sm font-medium text-gray-500 underline underline-offset-2"
                                onClick={() => setDraft(resetFilters(brandSlug))}
                                type="button"
                            >
                                {isEn ? "Reset" : "Đặt lại"}
                            </button>
                        )}
                        <button
                            aria-label={isEn ? "Close filters" : "Đóng bộ lọc"}
                            className="-mr-2 rounded-full p-2 hover:bg-gray-100"
                            onClick={onClose}
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
                    <ShopFilterSidebar
                        brandHref={brandHref}
                        brandSlug={brandSlug}
                        filterOptions={filterOptions}
                        filters={draft}
                        hideHeader
                        onChange={setDraft}
                        products={products}
                    />
                </div>
                <div className="border-t border-gray-100 p-4">
                    <button
                        className="h-12 w-full rounded-[2px] bg-saigon-base font-display text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-saigon-surface disabled:opacity-40"
                        disabled={matched === 0}
                        onClick={() => onApply(draft)}
                        type="button"
                    >
                        {isEn ? `Show ${matched} products` : `Xem ${matched} sản phẩm`}
                    </button>
                </div>
            </div>
        </div>
    );
}
