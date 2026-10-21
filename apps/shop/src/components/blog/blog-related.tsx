"use client";

import type { BlogArticle } from "@/types/homepage";

import { getRelatedBlogArticles } from "@/services/homepage";
import BlogCard from "@/components/blog/blog-card";
import { useEffect, useState } from "react";

type BlogRelatedProps = {
    brand?: string;
    excludeSlug: string;
    locale: string;
};

export default function BlogRelated({ brand, excludeSlug, locale }: BlogRelatedProps) {
    const [articles, setArticles] = useState<({ content?: string } & BlogArticle)[]>([]);

    useEffect(() => {
        getRelatedBlogArticles({ brand, excludeSlug, limit: 4, locale })
            .then(setArticles)
            .catch(() => setArticles([]));
    }, [brand, excludeSlug, locale]);

    if (articles.length === 0) return null;

    const isEn = locale === "en";

    return (
        <div className="mt-10 pt-10 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                {isEn ? "Related Articles" : "Bài viết liên quan"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {articles.map((article) => (
                    <BlogCard
                        article={article}
                        key={article.id}
                        locale={locale}
                        variant="compact"
                    />
                ))}
            </div>
        </div>
    );
}
