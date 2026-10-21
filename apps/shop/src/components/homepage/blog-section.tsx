"use client";

import type { BlogArticle } from "@/types/homepage";

import { useLocale } from "@/i18n/locale-provider";
import SectionHeading from "@/components/section-heading";
import Link from "next/link";
import { usableImageUrl } from "@/utils/image-url";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DESKTOP_PER_PAGE = 4;

export default function BlogSection({
    articles,
}: {
    articles: BlogArticle[];
}) {
    const { dict, locale } = useLocale();
    const [page, setPage] = useState(0);

    if (!articles?.length) return null;

    const totalPages = Math.ceil(articles.length / DESKTOP_PER_PAGE);
    const visibleDesktop = articles.slice(
        page * DESKTOP_PER_PAGE,
        page * DESKTOP_PER_PAGE + DESKTOP_PER_PAGE
    );

    const prev = () => setPage((p) => Math.max(0, p - 1));
    const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    const blogBase = locale === "en" ? "/en/blog" : "/blog";

    return (
        <section className="content-container py-6 md:py-10 border-t border-ui-border-base">
            {/* Header row — arrows desktop only */}
            <div className="flex items-end justify-between mb-6">
                <SectionHeading
                    subtitle={dict.homepage.blogSubtitle}
                    title={dict.homepage.blogTitle}
                />
                {/* Pagination arrows — desktop only */}
                {totalPages > 1 && (
                    <div className="hidden lg:flex items-center gap-2 shrink-0">
                        <button
                            aria-label="Previous articles"
                            className="p-2 rounded-full border border-ui-border-base hover:border-ui-fg-interactive hover:text-ui-fg-interactive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={page === 0}
                            onClick={prev}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-ui-fg-muted w-12 text-center">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            aria-label="Next articles"
                            className="p-2 rounded-full border border-ui-border-base hover:border-ui-fg-interactive hover:text-ui-fg-interactive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={page === totalPages - 1}
                            onClick={next}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop ≥1024px: 4-per-row grid, paginated with arrows */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
                {visibleDesktop.map((article) => (
                    <ArticleCard
                        article={article}
                        blogBase={blogBase}
                        dict={dict}
                        key={article.id}
                    />
                ))}
            </div>

            {/* Mobile <1024px: horizontal swipe carousel — no arrows, swipe gesture */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:hidden scrollbar-hide -mx-4 px-4">
                {articles.map((article) => (
                    <div className="flex-shrink-0 w-[80vw] max-w-[320px] snap-start" key={article.id}>
                        <ArticleCard
                            article={article}
                            blogBase={blogBase}
                            dict={dict}
                        />
                    </div>
                ))}
            </div>

            {/* View all button — bottom of section */}
            <div className="flex justify-center mt-6">
                <Link
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    href={blogBase}
                >
                    {locale === "en" ? "View All Articles" : "Xem tất cả bài viết"} →
                </Link>
            </div>
        </section>
    );
}

function ArticleCard({
    article,
    blogBase,
    dict,
}: {
    article: BlogArticle;
    blogBase: string;
    dict: any;
}) {
    // Ưu tiên ảnh UPLOAD (thumbnail) → fallback link ảnh thay thế (thumbnailUrl)
    // Ảnh tạm (placehold.co) / host lạ → coi như không có ảnh (hiện khung mặc định)
    const imageUrl = usableImageUrl(article.thumbnail?.url) || usableImageUrl(article.thumbnailUrl);

    return (
        <Link
            className="flex flex-col border border-ui-border-base rounded-xl overflow-hidden hover:border-ui-fg-interactive transition-colors group"
            href={`${blogBase}/${article.slug}`}
        >
            <div className="h-40 w-full overflow-hidden bg-ui-bg-subtle">
                {imageUrl ? (
                    <img
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        src={imageUrl}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-ui-fg-muted text-xs">No image</span>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-ui-fg-muted mb-1">{article.publishedAt}</span>
                <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-ui-fg-interactive transition-colors">
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className="text-xs text-ui-fg-muted line-clamp-2 mb-3 flex-1">
                        {article.excerpt}
                    </p>
                )}
                <span className="text-xs text-ui-fg-interactive font-medium mt-auto">
                    {dict.common.readMore} →
                </span>
            </div>
        </Link>
    );
}
