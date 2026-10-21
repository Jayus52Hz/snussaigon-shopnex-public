"use client";

import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { useState } from "react";

interface SEOArticleProps {
    articles: any[];
}

export default function SEOArticleSection({ articles }: SEOArticleProps) {
    const { locale } = useLocale();
    const [expanded, setExpanded] = useState(false);

    if (!articles?.length) return null;

    // Pick newest article by publishedAt when multiple articles exist
    const article = [...articles].sort((a, b) => {
        const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return db - da;
    })[0];

    const isEn = locale === "en";
    const title = isEn && article.title_en ? article.title_en : article.title;
    const content = isEn && article.content_en ? article.content_en : article.content;

    if (!content && !title) return null;

    return (
        <div className="border-t border-gray-100 py-10">
            <div className="mx-auto w-full max-w-[680px] px-4">
                {title && (
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                )}

                {content && (
                    <div className="relative">
                        <div
                            className={cn(
                                "article-prose article-collapse",
                                expanded && "article-expanded"
                            )}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                        {/* Gradient fade when collapsed */}
                        {!expanded && (
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                    </div>
                )}

                {content && (
                    <div className="flex justify-center mt-4">
                        <button
                            className="inline-flex items-center gap-1.5 px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setExpanded(!expanded)}
                            type="button"
                        >
                            {expanded
                                ? (isEn ? "Show Less ▲" : "Thu gọn ▲")
                                : (isEn ? "Read More ▼" : "Xem thêm ▼")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
