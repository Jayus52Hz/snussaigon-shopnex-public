"use client";

import { useLocale } from "@/i18n/locale-provider";
import { Package } from "lucide-react";

interface ShopEmptyStateProps {
    onClearFilters: () => void;
    onBrowseAll: () => void;
}

export default function ShopEmptyState({
    onClearFilters,
    onBrowseAll,
}: ShopEmptyStateProps) {
    const { dict } = useLocale();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
                {dict.store.emptyTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
                {dict.store.emptyDesc}
            </p>
            <div className="flex gap-3">
                <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    onClick={onClearFilters}
                    type="button"
                >
                    {dict.common.clearAll}
                </button>
                <button
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={onBrowseAll}
                    type="button"
                >
                    {dict.common.allProducts}
                </button>
            </div>
        </div>
    );
}
