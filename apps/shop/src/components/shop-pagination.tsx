"use client";

import { useLocale } from "@/i18n/locale-provider";
import { Loader2 } from "lucide-react";

interface ShopPaginationProps {
    shown: number;
    total: number;
    onLoadMore: () => void;
    isLoading?: boolean;
}

export default function ShopPagination({
    shown,
    total,
    onLoadMore,
    isLoading,
}: ShopPaginationProps) {
    const { dict, locale } = useLocale();

    if (shown >= total) return null;

    const progress = (shown / total) * 100;

    return (
        <div className="flex flex-col items-center gap-3 pt-8">
            <p className="text-sm text-gray-500">
                {dict.common.showing} {shown} / {total} {dict.common.products.toLowerCase()}
            </p>
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <button
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 min-w-[200px] justify-center"
                disabled={isLoading}
                onClick={onLoadMore}
                type="button"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {locale === "en" ? "Loading..." : "Đang tải..."}
                    </>
                ) : (
                    dict.common.loadMore
                )}
            </button>
        </div>
    );
}
