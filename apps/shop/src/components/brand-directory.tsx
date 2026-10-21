"use client";

import type { BrandCountry, BrandEntry } from "@/services/brands";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { localizePath } from "@/i18n/locale-paths";
import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { formatStrengthRange } from "@/utils/product-strength";

type Filter = "all" | "in-stock" | BrandCountry;

/**
 * Lưới thương hiệu trang /brands + chip lọc (quốc gia, đang có hàng).
 * Lọc phía client, không đổi URL → không sinh thêm trang cho SEO; HTML server
 * render đủ toàn bộ brand.
 */
export default function BrandDirectory({ brands }: { brands: BrandEntry[] }) {
    const { dict, locale } = useLocale();
    const t = dict.brands;
    const [filter, setFilter] = useState<Filter>("all");

    const chips = useMemo(() => {
        const countryCounts = new Map<BrandCountry, number>();
        for (const b of brands) {
            const c = b.profile?.country;
            if (c) countryCounts.set(c, (countryCounts.get(c) ?? 0) + 1);
        }
        const list: { count: number; label: string; value: Filter }[] = [
            { count: brands.length, label: t.filterAll, value: "all" },
            ...[...countryCounts.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([value, count]) => ({ count, label: t.countries[value], value })),
            {
                count: brands.filter((b) => b.stats.inStock > 0).length,
                label: t.filterInStock,
                value: "in-stock" as const,
            },
        ];
        return list;
    }, [brands, t]);

    const visible = brands.filter((b) => {
        if (filter === "all") return true;
        if (filter === "in-stock") return b.stats.inStock > 0;
        return b.profile?.country === filter;
    });

    return (
        <div data-component="sg-brand-directory">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap">
                {chips.map((chip) => (
                    <button
                        aria-pressed={filter === chip.value}
                        className={cn(
                            "tap-press inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-body text-[13px] font-medium transition-colors md:text-[14px]",
                            filter === chip.value
                                ? "border-saigon-base bg-saigon-base text-white"
                                : "border-saigon-black/15 bg-white text-saigon-base hover:border-saigon-base",
                        )}
                        key={chip.value}
                        onClick={() => setFilter(chip.value)}
                        type="button"
                    >
                        {chip.label}
                        <span
                            className={cn(
                                "text-[12px]",
                                filter === chip.value ? "text-white/70" : "text-saigon-grey",
                            )}
                        >
                            {chip.count}
                        </span>
                    </button>
                ))}
            </div>

            <p className="mt-4 font-body text-[13px] text-saigon-grey" aria-live="polite">
                {t.showing
                    .replace("{shown}", String(visible.length))
                    .replace("{total}", String(brands.length))}
            </p>

            {visible.length === 0 ? (
                <p className="mt-8 font-body text-[15px] text-saigon-grey">{t.noMatch}</p>
            ) : (
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((brand) => (
                        <li key={brand.slug}>
                            <BrandCard brand={brand} href={localizePath(`/snus-${brand.slug}`, locale)} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function BrandCard({ brand, href }: { brand: BrandEntry; href: string }) {
    const { dict } = useLocale();
    const t = dict.brands;
    const { stats, profile } = brand;
    const strength = formatStrengthRange(stats.minMg, stats.maxMg);
    const soldOut = stats.inStock === 0;

    const counts = [
        t.productCount.replace("{count}", String(stats.total)),
        stats.total > 0 ? t.inStockCount.replace("{count}", String(stats.inStock)) : null,
        stats.notForSale > 0 ? t.notForSaleCount.replace("{count}", String(stats.notForSale)) : null,
    ].filter(Boolean);

    return (
        <Link
            className="group flex h-full flex-col rounded-[10px] border border-saigon-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-saigon-base hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
            data-component="sg-brand-card"
            href={href}
        >
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-14 w-24 flex-shrink-0 items-center justify-center rounded-md bg-saigon-bg-soft p-2">
                    {brand.logo ? (
                        <img
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                            src={brand.logo}
                        />
                    ) : (
                        // Chưa có logo: chữ viết tắt (tên đầy đủ đã có ở tiêu đề bên dưới)
                        <span
                            aria-hidden
                            className="font-display text-[22px] font-bold uppercase tracking-[0.04em] text-saigon-base"
                        >
                            {brand.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2)}
                        </span>
                    )}
                </span>
                {profile?.country && (
                    <span className="font-body text-[12px] font-medium uppercase tracking-[0.08em] text-saigon-grey">
                        {t.countries[profile.country]}
                    </span>
                )}
            </div>

            <h2 className="mt-4 font-display text-[20px] font-bold uppercase tracking-[0.04em] text-saigon-base">
                {brand.name}
            </h2>
            {profile?.tagline && (
                <p className="mt-1.5 line-clamp-2 font-body text-[14px] leading-[1.45] text-saigon-grey">
                    {profile.tagline}
                </p>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-saigon-black/10 pt-4 font-body">
                <div>
                    <dt className="text-[11px] uppercase tracking-[0.08em] text-saigon-grey">{t.products}</dt>
                    <dd className="mt-1 text-[14px] font-medium text-saigon-base">
                        {counts[0]}
                        {counts.length > 1 && (
                            <span className="block text-[12px] font-normal text-saigon-grey">
                                {counts.slice(1).join(" · ")}
                            </span>
                        )}
                    </dd>
                </div>
                <div>
                    <dt className="text-[11px] uppercase tracking-[0.08em] text-saigon-grey">{t.strength}</dt>
                    <dd className="mt-1 text-[14px] font-medium text-saigon-base">{strength ?? "–"}</dd>
                </div>
            </dl>

            <span className="mt-auto flex items-center justify-between pt-5">
                <span className="inline-flex items-center gap-1.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-saigon-base">
                    {t.viewBrand.replace("{brand}", brand.name)}
                    <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                {soldOut && (
                    <span className="rounded-[2px] bg-saigon-bg-soft px-2 py-1 font-body text-[11px] font-medium uppercase tracking-[0.06em] text-saigon-grey">
                        {stats.notForSale > 0 && stats.notForSale === stats.total
                            ? dict.common.notForSale
                            : t.outOfStock}
                    </span>
                )}
            </span>
        </Link>
    );
}
