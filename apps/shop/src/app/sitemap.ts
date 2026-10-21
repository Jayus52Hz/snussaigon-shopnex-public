import type { MetadataRoute } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { payloadSdk } from "@/utils/payload-sdk";
import { hasProductImage } from "@/utils/product-image";
import { getBrandTerms, publishedWhere } from "@/services/homepage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://snussaigon.com";

export const revalidate = 3600;

// Lỗi CMS lúc runtime → throw để ISR giữ bản sitemap tốt gần nhất, không cache
// bản thiếu URL trong 1 giờ. Lúc `next build` thì vẫn bỏ qua để build không gãy
// khi CMS chưa chạy. https://nextjs.org/docs/15/app/guides/incremental-static-regeneration#handling-uncaught-exceptions
function onCmsError(section: string, error: unknown): void {
    console.error(`[sitemap] ${section} failed`, error);
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
}

function languages(vi: string, en?: string) {
    return en ? { vi, en, "x-default": vi } : { vi, "x-default": vi };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1.0,
            alternates: { languages: languages(`${SITE_URL}`, `${SITE_URL}/en`) },
        },
        {
            url: `${SITE_URL}/snus`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
            alternates: { languages: languages(`${SITE_URL}/snus`, `${SITE_URL}/en/snus`) },
        },
        {
            url: `${SITE_URL}/brands`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
            alternates: { languages: languages(`${SITE_URL}/brands`, `${SITE_URL}/en/brands`) },
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
            alternates: { languages: languages(`${SITE_URL}/blog`, `${SITE_URL}/en/blog`) },
        },
        {
            url: `${SITE_URL}/tai-lieu-san-pham`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.5,
            alternates: { languages: languages(`${SITE_URL}/tai-lieu-san-pham`, `${SITE_URL}/en/tai-lieu-san-pham`) },
        },
    ];

    // Products
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const products = await payloadSdk.find({
            collection: "products" as any,
            limit: 500,
            // depth 1: populate gallery để biết SP có ảnh (SP chưa có ảnh → 404, không vào sitemap)
            depth: 1,
            where: { visible: { equals: true } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            select: { handle: true, updatedAt: true, gallery: true, variants: true } as any,
        });
        productPages = products.docs
            .filter((p: any) => p.handle && hasProductImage(p))
            .map((p: any) => ({
                url: `${SITE_URL}/${p.handle}`,
                lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
                changeFrequency: "weekly" as const,
                priority: 0.8,
                alternates: { languages: languages(`${SITE_URL}/${p.handle}`, `${SITE_URL}/en/${p.handle}`) },
            }));
    } catch (error) {
        onCmsError("products", error);
    }

    // Blog articles
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const articles = await payloadSdk.find({
            collection: "blog-articles" as any,
            limit: 500,
            depth: 0,
            where: publishedWhere(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            select: { slug: true, slugEn: true, updatedAt: true } as any,
        });
        blogPages = articles.docs
            .filter((a: any) => a.slug)
            .map((a: any) => {
                // Bài chưa có bản EN (không có slugEn) thì không khai alternate en:
                // /en/blog/{slug} 308 về bản vi.
                return {
                    url: `${SITE_URL}/blog/${a.slug}`,
                    lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
                    changeFrequency: "monthly" as const,
                    priority: 0.6,
                    alternates: { languages: languages(`${SITE_URL}/blog/${a.slug}`, a.slugEn ? `${SITE_URL}/en/blog/${a.slugEn}` : undefined) },
                };
            });
    } catch (error) {
        onCmsError("blog-articles", error);
    }

    // Brand pages — nguồn: attribute "Thương hiệu" (getBrandTerms), khớp slug
    // với sản phẩm (vd oden-s) nên link brand luôn resolve đúng.
    let brandPages: MetadataRoute.Sitemap = [];
    try {
        const brandTerms = await getBrandTerms();
        brandPages = brandTerms
            .filter((b) => b.slug)
            .map((b) => ({
                url: `${SITE_URL}/snus-${b.slug}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.75,
                alternates: { languages: languages(`${SITE_URL}/snus-${b.slug}`, `${SITE_URL}/en/snus-${b.slug}`) },
            }));
    } catch (error) {
        onCmsError("brands", error);
    }

    // Collection pages (Catalog → Collections trong CMS) — chỉ collection đang visible.
    let collectionPages: MetadataRoute.Sitemap = [];
    try {
        const collections = await payloadSdk.find({
            collection: "collections" as any,
            limit: 200,
            depth: 0,
            where: { visible: { equals: true } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            select: { handle: true, updatedAt: true } as any,
        });
        collectionPages = collections.docs
            .filter((c: any) => c.handle)
            .map((c: any) => ({
                url: `${SITE_URL}/bo-suu-tap/${c.handle}`,
                lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
                changeFrequency: "weekly" as const,
                priority: 0.7,
                alternates: { languages: languages(`${SITE_URL}/bo-suu-tap/${c.handle}`, `${SITE_URL}/en/bo-suu-tap/${c.handle}`) },
            }));
    } catch (error) {
        onCmsError("collections", error);
    }

    return [...staticPages, ...productPages, ...blogPages, ...brandPages, ...collectionPages];
}
