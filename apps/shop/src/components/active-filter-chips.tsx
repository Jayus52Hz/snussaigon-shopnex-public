"use client";

import { X } from "lucide-react";

import type { ActiveFilters, FacetKey, FilterOptions } from "@/hooks/use-shop-filters";
import { EMPTY_FILTERS } from "@/hooks/use-shop-filters";
import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";

interface ActiveFilterChipsProps {
    filters: ActiveFilters;
    filterOptions: FilterOptions;
    onChange: (next: ActiveFilters) => void;
    className?: string;
}

export default function ActiveFilterChips({
    filters,
    filterOptions,
    onChange,
    className,
}: ActiveFilterChipsProps) {
    const { locale } = useLocale();
    const isEn = locale === "en";

    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    // Mặc định chỉ hiện SP còn hàng → chỉ có chip khi khách chọn xem tất cả.
    if (filters.availability === "all") {
        chips.push({
            key: "availability",
            label: isEn ? "All products" : "Tất cả sản phẩm",
            onRemove: () => onChange({ ...filters, availability: "in-stock" }),
        });
    }

    const pushFacet = (facet: FacetKey, options: { slug: string; name: string }[], prefix: { vi: string; en: string }) => {
        filters[facet].forEach((slug) => {
            const name = options.find((o) => o.slug === slug)?.name || slug;
            chips.push({
                key: `${facet}-${slug}`,
                label: `${isEn ? prefix.en : prefix.vi}: ${name}`,
                onRemove: () => onChange({ ...filters, [facet]: filters[facet].filter((v) => v !== slug) }),
            });
        });
    };

    pushFacet("brands", filterOptions.brands, { vi: "Thương hiệu", en: "Brand" });
    pushFacet("flavorCategories", filterOptions.flavorCategories, { vi: "Nhóm hương vị", en: "Flavor category" });
    pushFacet("flavors", filterOptions.flavors, { vi: "Hương vị", en: "Flavor" });
    pushFacet("strengths", filterOptions.strengths, { vi: "Độ mạnh", en: "Strength" });
    pushFacet("formats", filterOptions.formats, { vi: "Định dạng", en: "Format" });

    if (filters.mgMin !== null || filters.mgMax !== null) {
        const min = filters.mgMin ?? 0;
        const max = filters.mgMax ?? 100;
        const bucket = filterOptions.mgBuckets.find((b) => b.min === min && b.max === max);
        chips.push({
            key: "mg",
            label: bucket?.label || `${min}-${max}mg`,
            onRemove: () => onChange({ ...filters, mgMin: null, mgMax: null }),
        });
    }

    if (filters.priceMin !== null || filters.priceMax !== null) {
        const min = filters.priceMin ?? 0;
        const max = filters.priceMax;
        chips.push({
            key: "price",
            label: `${min.toLocaleString("vi-VN")}đ – ${max === null ? "∞" : `${max.toLocaleString("vi-VN")}đ`}`,
            onRemove: () => onChange({ ...filters, priceMin: null, priceMax: null }),
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)} data-component="active-filter-chips">
            {chips.map((chip) => (
                <button
                    aria-label={isEn ? `Remove filter ${chip.label}` : `Bỏ lọc ${chip.label}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pl-3 pr-2 text-xs font-medium text-gray-800 transition-colors hover:border-saigon-base"
                    key={chip.key}
                    onClick={chip.onRemove}
                    type="button"
                >
                    {chip.label}
                    <X className="h-3 w-3 text-gray-400" />
                </button>
            ))}
            <button
                className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-saigon-red"
                onClick={() => onChange(EMPTY_FILTERS)}
                type="button"
            >
                {isEn ? "Clear all" : "Xoá tất cả"}
            </button>
        </div>
    );
}
