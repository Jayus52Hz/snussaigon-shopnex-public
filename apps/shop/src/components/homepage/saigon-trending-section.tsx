import Link from "next/link";
import { TrendingUp } from "lucide-react";

export type SaigonTrendingTerm = {
    term: string;
    href?: string;
};

/**
 * "Tìm kiếm nhiều" — Trending Searches from CMS, rendered as a chip cloud
 * right above the footer.
 */
export default function SaigonTrendingSection({
    terms,
    locale,
}: {
    terms: SaigonTrendingTerm[];
    locale: string;
}) {
    if (!terms?.length) return null;
    const isEn = locale === "en";
    const prefix = isEn ? "/en" : "";
    const title = isEn ? "Trending searches" : "Tìm kiếm nhiều";

    const hrefFor = (t: SaigonTrendingTerm) => {
        if (t.href && /^https?:\/\//.test(t.href)) return t.href;
        if (t.href) return `${prefix}${t.href.startsWith("/") ? "" : "/"}${t.href}`;
        return `${prefix}/search?q=${encodeURIComponent(t.term)}`;
    };

    return (
        <section className="bg-saigon-bg py-12 md:py-16">
            <div className="content-container">
                <div className="mb-5 flex items-center gap-2 md:mb-6">
                    <TrendingUp className="h-4 w-4 text-saigon-red" />
                    <h2 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-saigon-base">
                        {title}
                    </h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {terms.map((t) => (
                        <Link
                            key={t.term}
                            href={hrefFor(t)}
                            className="font-body inline-flex items-center rounded-full border border-saigon-black/15 bg-white px-4 py-2 text-[14px] text-saigon-black/80 transition-all hover:border-saigon-base hover:bg-saigon-base hover:text-white"
                        >
                            {t.term}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
