import type { Metadata } from "next";

import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { getBlogBrands, getPaginatedBlogArticles } from "@/services/homepage";
// locale is passed to services — Payload handles field localization server-side
import BlogListTemplate from "@/templates/blog-list";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const dict = dictionaries[locale];
    return buildMetadata({
        path: "/blog",
        locale,
        fallbackTitle: `${dict.homepage.blogTitle} - SnusSaigon`,
        fallbackDescription: dict.homepage.blogSubtitle,
    });
}

export const dynamic = "force-dynamic";

export default async function BlogPage(props: {
    searchParams: Promise<{ brand?: string; page?: string; q?: string }>;
}) {
    const searchParams = await props.searchParams;
    const brand = searchParams.brand || undefined;
    const page = parseInt(searchParams.page || "1", 10) || 1;
    const search = searchParams.q || undefined;
    const locale = await getLocale();

    const [result, brands] = await Promise.all([
        getPaginatedBlogArticles({ brand, limit: 12, locale, page, search }),
        getBlogBrands(),
    ]);

    // Pick the latest article as featured (only when no filters active)
    const featuredArticle = !brand && !search && page === 1
        ? result.docs[0] || null
        : null;

    // Remove the featured article from the grid
    const gridArticles = featuredArticle ? result.docs.slice(1) : result.docs;

    return (
        <Suspense fallback={null}>
            <BlogListTemplate
                articles={gridArticles}
                brand={brand}
                brands={brands}
                featuredArticle={featuredArticle}
                page={page}
                search={search}
                totalPages={Math.max(1, Math.ceil(result.totalDocs / 12))}
            />
        </Suspense>
    );
}
