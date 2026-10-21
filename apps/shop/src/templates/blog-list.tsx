"use client";

import type { BlogArticle } from "@/types/homepage";

import BlogCard from "@/components/blog/blog-card";
import BlogFeaturedCard from "@/components/blog/blog-featured-card";
import Breadcrumbs from "@/components/breadcrumbs";
import { useLocale } from "@/i18n/locale-provider";
import { Search, Sparkles } from "lucide-react";

type BlogListTemplateProps = {
    articles: ({ content?: string } & BlogArticle)[];
    brand?: string;
    brands: string[];
    featuredArticle?: { content?: string } & BlogArticle | null;
    page: number;
    search?: string;
    totalPages: number;
};

function Pagination({
    baseUrl,
    currentPage,
    isEn,
    totalPages,
}: {
    baseUrl: string;
    currentPage: number;
    isEn: boolean;
    totalPages: number;
}) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) pages.push(i);
    if (pages[0] > 1) {
        pages.unshift(1);
        if (pages[1] > 2) pages.splice(1, 0, -1);
    }
    if (pages[pages.length - 1] < totalPages) {
        if (pages[pages.length - 1] < totalPages - 1) pages.push(-1);
        pages.push(totalPages);
    }

    const buildUrl = (p: number) => `${baseUrl}?page=${p}`;

    return (
        <div className="flex flex-wrap justify-center items-center gap-1.5 mt-12">
            {currentPage > 1 && (
                <a
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    href={buildUrl(currentPage - 1)}
                >
                    {isEn ? "Previous" : "Trước"}
                </a>
            )}
            {pages.map((p, i) =>
                p === -1 ? (
                    <span className="px-1 text-gray-400" key={`dots-${i}`}>...</span>
                ) : (
                    <a
                        className={`min-w-[36px] py-2 text-sm font-medium rounded-lg transition-colors text-center ${
                            p === currentPage
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        href={buildUrl(p)}
                        key={p}
                    >
                        {p}
                    </a>
                )
            )}
            {currentPage < totalPages && (
                <a
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    href={buildUrl(currentPage + 1)}
                >
                    {isEn ? "Next" : "Sau"}
                </a>
            )}
        </div>
    );
}

export default function BlogListTemplate({
    articles,
    brand,
    brands,
    featuredArticle,
    page,
    search = "",
    totalPages,
}: BlogListTemplateProps) {
    const { dict, locale } = useLocale();
    const isEn = locale === "en";
    const prefix = isEn ? "/en" : "";
    const baseUrl = brand ? `${prefix}/blog?brand=${brand}` : `${prefix}/blog`;
    const searchUrl = brand ? `${prefix}/blog?brand=${brand}` : `${prefix}/blog`;

    return (
        <>
            <Breadcrumbs
                items={[
                    { href: "/", label: dict.common.home },
                    { label: dict.nav.blog },
                ]}
            />

            {/* Hero area */}
            <section className="content-container py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
                            {dict.homepage.blogTitle}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            {dict.homepage.blogSubtitle}
                        </p>
                    </div>

                    {/* Search + filter bar */}
                    <div className="flex items-center gap-2">
                        {/* Brand filter */}
                        {brands.length > 0 && (
                            <select
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue={brand || ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    window.location.href = v
                                        ? `${prefix}/blog?brand=${v}`
                                        : `${prefix}/blog`;
                                }}
                            >
                                <option value="">{isEn ? "All brands" : "Tất cả thương hiệu"}</option>
                                {brands.map((b) => (
                                    <option key={b} value={b}>
                                        {b.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Search */}
                        <form action={`${prefix}/blog`} method="GET">
                            <input name="brand" type="hidden" value={brand || ""} />
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    className="w-48 sm:w-56 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue={search}
                                    name="q"
                                    placeholder={isEn ? "Search..." : "Tìm kiếm..."}
                                    type="search"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Active brand badge */}
                {brand && (
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-lg">
                            {brand.toUpperCase()}
                            <a className="ml-1 hover:text-blue-900" href={`${prefix}/blog`}>
                                ×
                            </a>
                        </span>
                    </div>
                )}

                {/* Featured article (page 1, no filters) */}
                {featuredArticle && page === 1 && !search && (
                    <div className="mb-10">
                        <BlogFeaturedCard
                            article={featuredArticle}
                            locale={locale}
                        />
                    </div>
                )}

                {/* Articles grid */}
                {articles.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">
                            {isEn ? "No articles found." : "Không tìm thấy bài viết nào."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {articles.map((article) => (
                            <BlogCard
                                article={article}
                                key={article.id}
                                locale={locale}
                            />
                        ))}
                    </div>
                )}

                <Pagination
                    baseUrl={baseUrl}
                    currentPage={page}
                    isEn={isEn}
                    totalPages={totalPages}
                />
            </section>
        </>
    );
}
