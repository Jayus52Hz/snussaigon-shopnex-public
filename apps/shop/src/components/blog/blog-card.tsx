import type { BlogArticle } from "@/types/homepage";

import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usableImageUrl } from "@/utils/image-url";

function readingTime(content?: string, excerpt?: string): number {
    const text = (content || "") + (excerpt || "");
    const words = text.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

type BlogCardProps = {
    article: { content?: string } & BlogArticle;
    locale: string;
    variant?: "default" | "compact";
};

export default function BlogCard({ article, locale, variant = "default" }: BlogCardProps) {
    const isEn = locale === "en";
    const prefix = isEn ? "/en" : "";
    // EN dùng slugEn (fallback slug); vi dùng slug.
    const urlSlug = (isEn && (article as any).slugEn) || article.slug;
    const mins = readingTime(article.content, article.excerpt);
    // Ảnh tạm (placehold.co) / host lạ → coi như không có ảnh (hiện khung mặc định)
    const imageUrl = usableImageUrl(article.thumbnail?.url) || usableImageUrl(article.thumbnailUrl);

    return (
        <Link
            className="tap-press group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            href={`${prefix}/blog/${urlSlug}`}
        >
            {imageUrl ? (
                <div className={variant === "default" ? "aspect-[16/9]" : "aspect-[4/3]"}>
                    <img
                        alt={article.title || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={imageUrl}
                    />
                </div>
            ) : (
                <div className={`${variant === "default" ? "aspect-[16/9]" : "aspect-[4/3]"} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
                    <span className="text-2xl font-bold text-gray-300">SnusSaigon</span>
                </div>
            )}
            <div className="p-4 sm:p-5">
                {article.brand && (
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2">
                        {article.brand}
                    </span>
                )}
                <h3 className="font-semibold text-sm lg:text-base text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                    {article.title}
                </h3>
                {variant === "default" && article.excerpt && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {article.excerpt}
                    </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        {article.publishedAt && (
                            <>
                                <Calendar className="h-3 w-3" />
                                {new Date(article.publishedAt).toLocaleDateString(
                                    isEn ? "en-US" : "vi-VN",
                                    { year: "numeric", month: "short", day: "numeric" }
                                )}
                            </>
                        )}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isEn ? `${mins} min read` : `${mins} phút đọc`}
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export { readingTime };
