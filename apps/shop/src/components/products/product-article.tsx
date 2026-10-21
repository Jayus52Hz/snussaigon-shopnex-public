"use client";

import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { useState } from "react";

type ProductArticleProps = {
    articleBody?: string;
};

export default function ProductArticle({ articleBody }: ProductArticleProps) {
    const { locale } = useLocale();
    const [expanded, setExpanded] = useState(false);

    if (!articleBody) return null;

    const isEn = locale === "en";

    return (
        <div className="w-full">
            {/* Article body — CSS-only collapse with gradient fade */}
            <div className="relative">
                <div
                    className={cn(
                        "article-prose article-collapse",
                        expanded && "article-expanded"
                    )}
                    dangerouslySetInnerHTML={{ __html: articleBody }}
                />
                {/* Gradient fade overlay — hidden when expanded */}
                {!expanded && (
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
            </div>

            {/* Toggle button — centered */}
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
        </div>
    );
}
