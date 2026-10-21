import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getLocale } from "@/i18n/locale";
import SaigonBrandPillsScroller from "./saigon-brand-pills-scroller";
import SaigonSectionLabel from "./saigon-section-label";
import { SAIGON_BRANDS } from "./saigon-mock-data";

/** image = URL logo thương hiệu (upload ở CMS → Attributes → Thương hiệu). */
export type BrandPill = { name: string; slug: string; image?: string };

/**
 * "Mua theo thương hiệu" — pill thương hiệu xếp 2 hàng, cuộn ngang (mobile vuốt,
 * desktop có nút ← →, xem SaigonBrandPillsScroller).
 * Mỗi pill là 1 link sang trang brand (/snus-{slug}), style pill đen theo
 * mockup; pill cuối (viền) dẫn tới /brands. Server Component: đọc locale để prefix /en cho tiếng Anh.
 *
 * Nhận FULL danh sách brand từ CMS qua prop `brands` (page.tsx). Khi rỗng
 * (CMS down / local dev) → fallback về SAIGON_BRANDS để vẫn hiện pill.
 */
export default async function SaigonBrandPills({
    brands,
}: {
    brands?: BrandPill[];
}) {
    const locale = await getLocale();
    const isEn = locale === "en";
    const title = isEn ? "Shop by brand" : "Mua theo thương hiệu";
    const allBrandsLabel = isEn ? "All brands" : "Tất cả thương hiệu";

    const list: BrandPill[] =
        brands && brands.length > 0
            ? brands
            : SAIGON_BRANDS.map((b) => ({ name: b.name, slug: b.slug }));

    return (
        <section className="bg-saigon-bg pb-0 pt-10 md:pt-14" /* pb-0: section bên dưới đã có padding trên */>
            <div className="content-container">
                <SaigonSectionLabel href="/brands" title={title} />

                <SaigonBrandPillsScroller
                    labels={{ prev: isEn ? "Previous brands" : "Thương hiệu trước", next: isEn ? "More brands" : "Xem thêm thương hiệu" }}
                >
                    {list.map((brand, i) => (
                        <Link
                            key={brand.slug}
                            data-component="sg-brand-pill"
                            href={isEn ? `/en/snus-${brand.slug}` : `/snus-${brand.slug}`}
                            className="tap-press group flex-shrink-0 rounded-full bg-saigon-base px-7 py-3.5 opacity-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_12px_30px_rgba(13,13,13,0.35)] md:px-8 md:py-4"
                            style={{
                                animation: `fade-up 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s both`,
                            }}
                        >
                            <span className="flex items-center gap-3">
                                {brand.image && (
                                    <span className="flex h-8 w-12 flex-shrink-0 items-center justify-center rounded-md bg-white p-1 md:h-9 md:w-14">
                                        <img
                                            alt=""
                                            className="max-h-full max-w-full object-contain"
                                            loading="lazy"
                                            src={brand.image}
                                        />
                                    </span>
                                )}
                                <span className="font-display text-[18px] font-bold uppercase tracking-[0.06em] text-white md:text-[22px]">
                                    {brand.name}
                                </span>
                            </span>
                        </Link>
                    ))}
                    <Link
                        data-component="sg-brand-pill-all"
                        href={isEn ? "/en/brands" : "/brands"}
                        className="tap-press flex flex-shrink-0 items-center gap-2 rounded-full border-2 border-saigon-base bg-white px-7 py-3.5 font-display text-[18px] font-bold uppercase tracking-[0.06em] text-saigon-base transition-colors hover:bg-saigon-base hover:text-white md:px-8 md:py-4 md:text-[22px]"
                    >
                        {allBrandsLabel}
                        <ArrowRight aria-hidden className="h-5 w-5" />
                    </Link>
                </SaigonBrandPillsScroller>
            </div>
        </section>
    );
}
