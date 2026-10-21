import type { Locale } from "@/i18n/dictionaries";
import type { BrandEntry } from "@/services/brands";

import { Check } from "lucide-react";
import Link from "next/link";

import { dictionaries } from "@/i18n/dictionaries";
import { localizePath } from "@/i18n/locale-paths";
import { formatStrengthRange } from "@/utils/product-strength";

/**
 * Khối giới thiệu trên /snus-{slug} (dưới danh sách sản phẩm, trên SEO Article):
 * logo, tagline, giới thiệu, điểm nổi bật và dải
 * thông số (số sản phẩm tính từ dữ liệu sản phẩm; xuất xứ / hãng / định dạng /
 * thang độ mạnh từ brand-profiles). Brand chưa có profile vẫn hiện logo + số liệu.
 */
export default function BrandHero({
    brand,
    locale,
}: {
    brand: BrandEntry;
    locale: Locale;
}) {
    const dict = dictionaries[locale];
    const t = dict.brands;
    const { profile, stats } = brand;
    const strength = formatStrengthRange(stats.minMg, stats.maxMg);

    const facts: { label: string; value?: string | null }[] = [
        {
            label: t.products,
            value: [
                t.productCount.replace("{count}", String(stats.total)),
                t.inStockCount.replace("{count}", String(stats.inStock)),
                stats.notForSale > 0
                    ? t.notForSaleCount.replace("{count}", String(stats.notForSale))
                    : null,
            ]
                .filter(Boolean)
                .join(" · "),
        },
        { label: t.strength, value: strength },
        { label: t.origin, value: profile?.country ? t.countries[profile.country] : undefined },
        { label: t.manufacturer, value: profile?.manufacturer },
        { label: t.formats, value: profile?.formats },
        { label: t.strengthScale, value: profile?.strengthScale },
    ].filter((f) => Boolean(f.value));

    return (
        <section className="content-container pb-6 pt-2 md:pb-10" data-component="sg-brand-hero">
            <div className="rounded-[10px] border border-saigon-black/10 bg-saigon-bg-warm p-5 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                    {brand.logo && (
                        <span className="flex h-20 w-32 flex-shrink-0 items-center justify-center rounded-md bg-white p-3 md:h-24 md:w-40">
                            <img
                                alt={brand.name}
                                className="max-h-full max-w-full object-contain"
                                src={brand.logo}
                            />
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        {profile?.tagline && (
                            <p className="font-body text-[16px] font-medium text-saigon-base md:text-[18px]">
                                {profile.tagline}
                            </p>
                        )}
                        {profile?.intro && (
                            <p className="mt-3 max-w-3xl font-body text-[15px] leading-[1.65] text-saigon-grey">
                                {profile.intro}
                            </p>
                        )}
                        {profile && profile.highlights.length > 0 && (
                            <ul aria-label={t.highlights} className="mt-4 grid gap-2 sm:grid-cols-2">
                                {profile.highlights.map((h) => (
                                    <li className="flex gap-2 font-body text-[14px] text-saigon-base" key={h}>
                                        <Check aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-saigon-red" />
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {facts.length > 0 && (
                    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-saigon-black/10 pt-5 md:grid-cols-3 lg:grid-cols-6">
                        {facts.map((f) => (
                            <div key={f.label}>
                                <dt className="font-body text-[11px] uppercase tracking-[0.08em] text-saigon-grey">
                                    {f.label}
                                </dt>
                                <dd className="mt-1 font-body text-[14px] font-medium text-saigon-base">{f.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                {stats.inStock === 0 && (
                    <div className="mt-5 rounded-[4px] border border-saigon-black/10 bg-white p-4 font-body text-[14px] text-saigon-base">
                        <p>
                            <span className="font-semibold">{t.outOfStock}.</span>{" "}
                            {t.outOfStockDesc.replace("{brand}", brand.name)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4">
                            <Link
                                className="border-b border-saigon-base pb-[2px] text-[13px] font-medium uppercase tracking-[0.06em] hover:opacity-60"
                                href={localizePath("/brands", locale)}
                            >
                                {t.allBrands}
                            </Link>
                            <Link
                                className="border-b border-saigon-base pb-[2px] text-[13px] font-medium uppercase tracking-[0.06em] hover:opacity-60"
                                href={localizePath("/snus", locale)}
                            >
                                {t.viewSnus}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
