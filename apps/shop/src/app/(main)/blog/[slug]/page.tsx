import type { Metadata } from "next";

import { getBlogArticleBySlug } from "@/services/homepage";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import BlogArticleTemplate from "@/templates/blog-article";
import { notFound, permanentRedirect } from "next/navigation";
import blogRedirects from "@/data/blog-redirects.json";

type BlogArticlePageProps = {
    params: Promise<{ slug: string }>;
};

// Slug bài blog cũ → path đích đầy đủ theo locale (308 permanent, giữ SEO).
function blogRedirectTarget(slug: string, locale: string): null | string {
    const map = (blogRedirects as Record<string, Record<string, string>>)[locale];
    return map?.[slug] ?? null;
}

// Bài chưa có bản EN (không có slugEn) → /en/blog/{slug} 308 về bản tiếng Việt,
// tránh trang EN chứa nguyên nội dung tiếng Việt.
function untranslatedRedirect(article: any, locale: string): void {
    if (locale === "en" && !article.slugEn && article.slug) {
        permanentRedirect(`/blog/${article.slug}`);
    }
}

export async function generateMetadata(
    props: BlogArticlePageProps
): Promise<Metadata> {
    const { slug } = await props.params;
    const locale = await getLocale();
    const blogRedirect = blogRedirectTarget(slug, locale);
    if (blogRedirect) permanentRedirect(blogRedirect);
    const article = await getBlogArticleBySlug(slug, locale);
    if (!article) return { title: "Not Found" };
    untranslatedRedirect(article, locale);
    // Chuẩn hoá canonical/hreflang theo slug bài (vi=slug, en=slugEn) —
    // bất kể URL vào bằng slug hay slugEn. Bài chưa dịch: không có hreflang en.
    const viSlug = (article as any).slug || slug;
    const enSlug = (article as any).slugEn as string | null | undefined;
    return buildMetadata({
        path: `/blog/${viSlug}`,
        enPath: enSlug ? `/en/blog/${enSlug}` : null,
        locale,
        fallbackTitle: `${article.title} | SnusSaigon Blog`,
        fallbackDescription: article.excerpt || article.title,
    });
}

export const dynamic = "force-dynamic";

export default async function BlogArticlePage(props: BlogArticlePageProps) {
    const { slug } = await props.params;
    const locale = await getLocale();
    const blogRedirect = blogRedirectTarget(slug, locale);
    if (blogRedirect) permanentRedirect(blogRedirect);
    const article = await getBlogArticleBySlug(slug, locale);
    if (!article) notFound();
    untranslatedRedirect(article, locale);

    return <BlogArticleTemplate article={article} />;
}
