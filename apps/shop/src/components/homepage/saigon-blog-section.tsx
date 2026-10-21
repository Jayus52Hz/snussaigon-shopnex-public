import Image from "next/image";
import Link from "next/link";

import SaigonSectionLabel from "./saigon-section-label";

export type SaigonBlogItem = {
    title: string;
    slug: string;
    excerpt?: string;
    thumbnailUrl?: string;
    publishedAt?: string;
};

function formatDate(iso?: string, locale?: string): string {
    if (!iso) return "";
    try {
        return new Date(iso).toLocaleDateString(
            locale === "en" ? "en-US" : "vi-VN",
            { year: "numeric", month: "short", day: "numeric" }
        );
    } catch {
        return "";
    }
}

/**
 * "Bài viết" — latest blog articles by publish date. Placed right under the
 * "Visit us" (map) section on the homepage.
 */
export default function SaigonBlogSection({
    items,
    locale,
}: {
    items: SaigonBlogItem[];
    locale: string;
}) {
    if (!items?.length) return null;
    const isEn = locale === "en";
    const prefix = isEn ? "/en" : "";
    const t = {
        title: isEn ? "Articles" : "Bài viết",
        link: isEn ? "View all" : "Xem tất cả",
    };

    return (
        <section className="bg-saigon-bg-warm py-14 md:py-20">
            <div className="content-container">
                <SaigonSectionLabel
                    href={`${prefix}/blog`}
                    linkText={t.link}
                    title={t.title}
                />

                <div className="mt-6 grid grid-cols-1 gap-5 md:mt-8 md:grid-cols-3 md:gap-6">
                    {items.map((a) => (
                        <Link
                            key={a.slug}
                            href={`${prefix}/blog/${a.slug}`}
                            className="tap-press group flex flex-col overflow-hidden rounded-xl border border-saigon-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] md:rounded-2xl"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-saigon-black/5">
                                {a.thumbnailUrl ? (
                                    <Image
                                        alt={a.title}
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        src={a.thumbnailUrl}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <span className="font-display text-2xl font-bold uppercase tracking-tight text-saigon-black/15">
                                            SnusSaigon
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                {a.publishedAt ? (
                                    <p className="font-display text-[11px] uppercase tracking-[0.12em] text-saigon-grey">
                                        {formatDate(a.publishedAt, locale)}
                                    </p>
                                ) : null}
                                <h3 className="font-display mt-2 text-[18px] font-bold uppercase leading-snug tracking-tight text-saigon-base md:text-[20px]">
                                    {a.title}
                                </h3>
                                {a.excerpt ? (
                                    <p className="font-body mt-2 line-clamp-3 text-[14px] leading-relaxed text-saigon-grey">
                                        {a.excerpt}
                                    </p>
                                ) : null}
                                <span
                                    aria-hidden
                                    className="font-display mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.05em] text-saigon-base transition-transform group-hover:translate-x-1"
                                >
                                    {isEn ? "Read more" : "Đọc tiếp"} →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
