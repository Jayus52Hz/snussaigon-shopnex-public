"use client";

import { useLocale } from "@/i18n/locale-provider";
import { getProductArticles } from "@/services/homepage";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

type ProductRelatedArticlesProps = {
    brand?: string;
};

export default function ProductRelatedArticles({ brand }: ProductRelatedArticlesProps) {
    const { dict, locale } = useLocale();
    const [articles, setArticles] = useState<any[]>([]);
    const isEn = locale === "en";

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        getProductArticles(brand)
            .then((data) => setArticles(data))
            .catch(() => setArticles([]));
    }, [brand]);

    const updateScrollButtons = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons, { passive: true });
        window.addEventListener("resize", updateScrollButtons);
        return () => {
            el.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, [articles, updateScrollButtons]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = el.querySelector("a")?.offsetWidth ?? 280;
        const gap = 16;
        const scrollAmount = (cardWidth + gap) * (direction === "left" ? -2 : 2);
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    if (articles.length === 0) return null;

    return (
        <section className="content-container py-6 sm:py-10">
            {/* Header with arrows */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    {isEn ? "Related Articles" : "Bài viết liên quan"}
                </h2>
                {/* Desktop arrows */}
                <div className="hidden lg:flex items-center gap-2">
                    <button
                        aria-label="Scroll left"
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={!canScrollLeft}
                        onClick={() => scroll("left")}
                        type="button"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        aria-label="Scroll right"
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={!canScrollRight}
                        onClick={() => scroll("right")}
                        type="button"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable track */}
            <div
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4 lg:mx-0 lg:px-0"
                ref={scrollRef}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {articles.map((article: any) => (
                    <Link
                        className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow snap-start shrink-0 w-[85vw] sm:w-[42vw] lg:w-[calc((100%-3rem)/4)]"
                        href={`/${locale === "en" ? "en/" : ""}blog/${article.slug}`}
                        key={article.id || article.slug}
                    >
                        {article.thumbnailUrl || article.image?.url ? (
                            <div className="aspect-[16/9] overflow-hidden">
                                <img
                                    alt={article.title || ""}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    src={article.thumbnailUrl || article.image?.url}
                                />
                            </div>
                        ) : (
                            <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No image</span>
                            </div>
                        )}
                        <div className="p-4">
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                                {article.title}
                            </h3>
                            {article.excerpt && (
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                    {article.excerpt}
                                </p>
                            )}
                            <div className="flex items-center justify-between">
                                {article.publishedAt && (
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(article.publishedAt).toLocaleDateString(
                                            locale === "en" ? "en-US" : "vi-VN",
                                            { year: "numeric", month: "short", day: "numeric" }
                                        )}
                                    </span>
                                )}
                                <span className="text-xs font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    {isEn ? "Read More" : "Đọc thêm"}
                                    <ArrowRight className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile scroll hint */}
            {articles.length > 1 && (
                <div className="flex justify-center mt-4 lg:hidden">
                    <div className="flex gap-1.5">
                        {articles.map((_, i) => (
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-gray-300"
                                key={i}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
