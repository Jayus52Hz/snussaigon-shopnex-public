"use client";

import { cn } from "@/utils";
import { useMemo } from "react";

import type { ActiveFilters, Availability, FacetKey, FilterOption, FilterOptions } from "@/hooks/use-shop-filters";
import { EMPTY_FILTERS, getFacetCounts } from "@/hooks/use-shop-filters";
import { useLocale } from "@/i18n/locale-provider";

interface ShopFilterSidebarProps {
    filterOptions: FilterOptions;
    /** Bộ lọc đang hiển thị: desktop = theo URL, mobile = bản nháp trong bottom sheet. */
    filters: ActiveFilters;
    /** Toàn bộ sản phẩm của trang (chưa lọc) — dùng đếm faceted. */
    products: any[];
    onChange: (next: ActiveFilters) => void;
    /** Trang /snus-{brand}: "Đặt lại" giữ lại brand này. */
    brandSlug?: string;
    /** Có trên trang shop snus / trang brand: dòng thương hiệu có link thật tới /snus-{brand} (tốt cho SEO). */
    brandHref?: (slug: string) => string;
    /** Ẩn header "Bộ lọc / Đặt lại" (bottom sheet mobile tự có header). */
    hideHeader?: boolean;
    className?: string;
}

/** Bộ lọc về mặc định; trang brand giữ brand của trang. */
export function resetFilters(brandSlug?: string): ActiveFilters {
    return { ...EMPTY_FILTERS, brands: brandSlug ? [brandSlug] : [] };
}

export function hasCustomFilters(filters: ActiveFilters, brandSlug?: string): boolean {
    const base = resetFilters(brandSlug);
    return JSON.stringify(filters) !== JSON.stringify(base);
}

export default function ShopFilterSidebar({
    filterOptions,
    filters,
    products,
    onChange,
    brandSlug,
    brandHref,
    hideHeader = false,
    className,
}: ShopFilterSidebarProps) {
    const { locale } = useLocale();
    const isEn = locale === "en";

    const t = {
        filters:        isEn ? "Filters"         : "Bộ lọc",
        reset:          isEn ? "Reset"           : "Đặt lại",
        availability:   isEn ? "Availability"    : "Tình trạng",
        all:            isEn ? "All products"    : "Tất cả",
        inStock:        isEn ? "In stock"        : "Còn hàng",
        brand:          isEn ? "Brand"           : "Thương hiệu",
        flavor:         isEn ? "Flavor"          : "Hương vị",
        flavorCategory: isEn ? "Flavor category" : "Nhóm hương vị",
        strength:       isEn ? "Strength"        : "Độ mạnh",
        format:         isEn ? "Format"          : "Định dạng",
        priceRange:     isEn ? "Price range"     : "Khoảng giá",
    };

    const counts = useMemo(() => getFacetCounts(products, filters), [products, filters]);

    const toggle = (facet: FacetKey, value: string) => {
        const current = filters[facet];
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        onChange({ ...filters, [facet]: next });
    };

    const setAvailability = (value: Availability) => onChange({ ...filters, availability: value });

    const showReset = hasCustomFilters(filters, brandSlug);

    const renderFacet = (facet: FacetKey, label: string, options: FilterOption[], scroll = false) => {
        if (options.length === 0) return null;
        return (
            <FilterGroup key={facet} label={label}>
                <div className={cn("flex flex-col", scroll && "max-h-56 overflow-y-auto overscroll-contain pr-1")}>
                    {options.map((opt) => {
                        const checked = filters[facet].includes(opt.slug);
                        const count = counts.values[facet].get(opt.slug) || 0;
                        // Strength: "Nhẹ (1–6 mg)" → tên + khoảng mg chữ nhỏ
                        const match = facet === "strengths" ? /^(.*?)\s*\((.+)\)$/.exec(opt.name) : null;
                        return (
                            <FilterRow
                                checked={checked}
                                count={count}
                                disabled={!checked && count === 0}
                                href={facet === "brands" ? brandHref?.(opt.slug) : undefined}
                                key={opt.slug}
                                label={match ? match[1] : opt.name}
                                name={`filter-${facet}`}
                                onChange={() => toggle(facet, opt.slug)}
                                sub={match ? match[2] : undefined}
                                type="checkbox"
                            />
                        );
                    })}
                </div>
            </FilterGroup>
        );
    };

    const priceMin = filters.priceMin ?? filterOptions.priceRange.min;
    const priceMax = filters.priceMax ?? filterOptions.priceRange.max;

    return (
        <aside className={cn("flex flex-col gap-5", className)} data-component="shop-filter">
            {!hideHeader && (
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold">{t.filters}</h2>
                    {showReset && (
                        <button
                            className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-saigon-red hover:underline"
                            onClick={() => onChange(resetFilters(brandSlug))}
                            type="button"
                        >
                            {t.reset}
                        </button>
                    )}
                </div>
            )}

            <FilterGroup label={t.availability}>
                {(["all", "in-stock"] as Availability[]).map((value) => {
                    const count = counts.availability[value];
                    const checked = filters.availability === value;
                    return (
                        <FilterRow
                            checked={checked}
                            count={count}
                            disabled={!checked && count === 0}
                            key={value}
                            label={value === "all" ? t.all : t.inStock}
                            name="filter-availability"
                            onChange={() => setAvailability(value)}
                            type="radio"
                        />
                    );
                })}
            </FilterGroup>

            {/* Các nhóm: attribute có tick "Hiển thị trong bộ lọc", theo filterOrder */}
            {filterOptions.sections.map((section) => {
                switch (section) {
                    case "brand":
                        return renderFacet("brands", t.brand, filterOptions.brands, true);
                    case "flavorCategory":
                        return renderFacet("flavorCategories", t.flavorCategory, filterOptions.flavorCategories);
                    case "flavor":
                        return renderFacet("flavors", t.flavor, filterOptions.flavors, true);
                    case "strength":
                        return renderFacet("strengths", t.strength, filterOptions.strengths);
                    case "format":
                        return renderFacet("formats", t.format, filterOptions.formats);
                    default:
                        return null;
                }
            })}

            {filterOptions.priceRange.max > filterOptions.priceRange.min && (
                <FilterGroup label={t.priceRange}>
                    <div className="space-y-2 pt-1">
                        <input
                            aria-label={t.priceRange}
                            className="w-full accent-saigon-base"
                            max={filterOptions.priceRange.max}
                            min={filterOptions.priceRange.min}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                onChange({
                                    ...filters,
                                    priceMin: val <= filterOptions.priceRange.min ? null : val,
                                    priceMax: val <= filterOptions.priceRange.min ? null : filterOptions.priceRange.max,
                                });
                            }}
                            type="range"
                            value={priceMin}
                        />
                        <div className="flex items-center justify-between text-xs tabular-nums text-gray-500">
                            <span>{priceMin.toLocaleString("vi-VN")}đ</span>
                            <span>{priceMax.toLocaleString("vi-VN")}đ</span>
                        </div>
                    </div>
                </FilterGroup>
            )}
        </aside>
    );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div aria-label={label} className="min-w-0 border-t border-gray-100 pt-5 first:border-t-0 first:pt-0" role="group">
            <h3 className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                {label}
            </h3>
            {children}
        </div>
    );
}

function FilterRow({
    type,
    name,
    label,
    sub,
    count,
    href,
    image,
    checked,
    disabled,
    onChange,
}: {
    type: "checkbox" | "radio";
    name: string;
    label: string;
    sub?: string;
    count: number;
    /** Link thật cho crawler; bấm vẫn chỉ đổi lựa chọn như checkbox. */
    href?: string;
    image?: string;
    checked: boolean;
    disabled: boolean;
    onChange: () => void;
}) {
    return (
        <label
            className={cn(
                "group/row flex items-center gap-2.5 py-1.5 text-sm",
                disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            )}
        >
            <input
                aria-label={sub ? `${label} ${sub}` : label}
                checked={checked}
                className={cn(
                    "size-4 shrink-0 accent-saigon-base",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                )}
                disabled={disabled}
                name={name}
                onChange={onChange}
                type={type}
            />
            {image && (
                <span className="flex h-6 w-9 shrink-0 items-center justify-center rounded-[2px] border border-gray-100 bg-white p-0.5">
                    <img alt="" className="max-h-full max-w-full object-contain" loading="lazy" src={image} />
                </span>
            )}
            <span
                className={cn(
                    "min-w-0 flex-1 truncate text-gray-900 transition-colors",
                    checked && "font-semibold",
                    !disabled && "group-hover/row:text-saigon-red",
                )}
            >
                {href ? (
                    <a
                        href={href}
                        onClick={(e) => {
                            e.preventDefault();
                            if (!disabled) onChange();
                        }}
                    >
                        {label}
                    </a>
                ) : (
                    label
                )}
                {sub && <span className="ml-1 text-xs font-normal text-gray-400">{sub}</span>}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-gray-400">{count}</span>
        </label>
    );
}
