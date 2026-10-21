import type { BlogArticle } from "@/types/homepage";

import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usableImageUrl } from "@/utils/image-url";
import { readingTime } from "./blog-card";

type BlogFeaturedCardProps = {
    article: { content?: string } & BlogArticle;
    locale: string;
};

export default function BlogFeaturedCard({ article, locale }: BlogFeaturedCardProps) {
    const isEn = locale === "en";
    const prefix = isEn ? "/en" : "";
    // EN dùng slugEn (fallback slug); vi dùng slug.
    const urlSlug = (isEn && (article as any).slugEn) || article.slug;
    const mins = readingTime(article.content, article.excerpt);
    // Ảnh tạm (placehold.co) / host lạ → coi như không có ảnh (hiện khung mặc định)
    const imageUrl = usableImageUrl(article.thumbnail?.url) || usableImageUrl(article.thumbnailUrl);

    return (
        <Link
            className="tap-press group relative block rounded-2xl overflow-hidden bg-gray-900"
            href={`${prefix}/blog/${urlSlug}`}
        >
            <div className="absolute inset-0">
                {imageUrl ? (
                    <img
                        alt={article.title || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={imageUrl}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
            </div>
            <div className="relative z-10 flex flex-col justify-end p-6 sm:p-8 lg:p-10 min-h-[320px] sm:min-h-[400px]">
                <div className="flex items-center gap-3 mb-3">
                    {article.brand && (
                        <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                            {article.brand}
                        </span>
                    )}
                    {article.publishedAt && (
                        <span className="text-white/70 text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.publishedAt).toLocaleDateString(
                                isEn ? "en-US" : "vi-VN",
                                { year: "numeric", month: "long", day: "numeric" }
                            )}
                        </span>
                    )}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:underline decoration-white/30">
                    {article.title}
                </h2>
                {article.excerpt && (
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-2xl mb-4">
                        {article.excerpt}
                    </p>
                )}
                <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium group-hover:gap-3 transition-all">
                    <Clock className="h-4 w-4" />
                    {isEn ? `${mins} min read` : `${mins} phút đọc`}
                    <ArrowRight className="h-4 w-4" />
                </span>
            </div>
        </Link>
    );
}
