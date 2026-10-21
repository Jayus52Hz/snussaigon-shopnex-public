"use client";

import type { BlogArticle } from "@/types/homepage";

import BlogRelated from "@/components/blog/blog-related";
import BlogShare from "@/components/blog/blog-share";
import BlogTableOfContents from "@/components/blog/blog-table-of-contents";
import Breadcrumbs from "@/components/breadcrumbs";
import { useLocale } from "@/i18n/locale-provider";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usableImageUrl } from "@/utils/image-url";

function readingTime(content?: string, excerpt?: string): number {
    const text = (content || "") + (excerpt || "");
    const words = text.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

type BlogArticleTemplateProps = {
    article: { brand?: string; content?: string; publishedAt?: string; thumbnailUrl?: string } & BlogArticle;
};

export default function BlogArticleTemplate({ article }: BlogArticleTemplateProps) {
    const { dict, locale } = useLocale();
    const isEn = locale === "en";
    const prefix = isEn ? "/en" : "";
    const mins = readingTime(article.content, article.excerpt);
    // Ảnh tạm (placehold.co) / host lạ → coi như không có ảnh (hiện khung mặc định)
    const imageUrl = usableImageUrl(article.thumbnail?.url) || usableImageUrl(article.thumbnailUrl);
    const articleUrl = `https://snussaigon.com${prefix}/blog/${article.slug}`;

    return (
        <>
            <Breadcrumbs
                items={[
                    { href: "/", label: dict.common.home },
                    { href: `${prefix}/blog`, label: dict.nav.blog },
                    { label: article.title || "" },
                ]}
            />

            <article className="content-container py-6 sm:py-10">
                <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
                    href={`${prefix}/blog`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    {isEn ? "Back to Blog" : "Quay lại Blog"}
                </Link>

                {/* Two column: content + sidebar */}
                <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
                    {/* Main content */}
                    <div className="min-w-0">
                        <header className="mb-8">
                            {article.brand && (
                                <span className="inline-block bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider mb-3">
                                    {article.brand}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {article.publishedAt && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(article.publishedAt).toLocaleDateString(
                                            locale === "en" ? "en-US" : "vi-VN",
                                            { year: "numeric", month: "long", day: "numeric" }
                                        )}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {isEn ? `${mins} min read` : `${mins} phút đọc`}
                                </span>
                                <BlogShare title={article.title} url={articleUrl} />
                            </div>
                        </header>

                        {imageUrl && (
                            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-gray-100">
                                <img
                                    alt={article.title || ""}
                                    className="w-full h-full object-cover"
                                    src={imageUrl}
                                />
                            </div>
                        )}

                        {article.excerpt && (
                            <blockquote className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-blue-500 pl-5 italic bg-blue-50/50 py-3 pr-4 rounded-r-lg">
                                {article.excerpt}
                            </blockquote>
                        )}

                        {article.content && (
                            <div
                                className="article-prose prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md prose-li:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        )}

                        {!article.content && (
                            <div className="py-16 text-center bg-gray-50 rounded-xl">
                                <p className="text-gray-400">
                                    {isEn ? "Content coming soon." : "Nội dung đang được cập nhật."}
                                </p>
                            </div>
                        )}

                        {/* Bottom share + related */}
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <BlogShare title={article.title} url={articleUrl} />
                        </div>

                        <BlogRelated
                            brand={article.brand}
                            excludeSlug={article.slug}
                            locale={locale}
                        />
                    </div>

                    {/* Sidebar - TOC on desktop */}
                    <aside className="hidden lg:block">
                        <BlogTableOfContents />
                    </aside>
                </div>

                {/* Mobile TOC */}
                <div className="mt-8 lg:hidden">
                    <BlogTableOfContents />
                </div>
            </article>
        </>
    );
}
