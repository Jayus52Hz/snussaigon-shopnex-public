import type { Metadata } from "next";

import { getSeoMeta, seoImageUrl } from "@/services/seo";
import { getStoreSettings } from "@/services/store-settings";
import { buildAlternates } from "@/utils/alternates";
import { OG_SIZE, isGeneratedOgImage } from "@/utils/og-url";

type BuildMetadataArgs = {
    /** Vi path (no /en prefix), e.g. "/", "/snus", "/snus-velo". */
    path: string;
    locale: string;
    /** Defaults used when CMS has no override for this path. */
    fallbackTitle: string;
    fallbackDescription: string;
    fallbackImage?: string;
    /** EN path đầy đủ (đã kèm /en) khi khác quy tắc /en+path — vd blog slugEn.
     *  `null` = trang không có bản EN (bỏ hreflang en). */
    enPath?: string | null;
};

/**
 * Merge CMS-managed SEO (collection `seo-meta`, keyed by path) with per-page
 * fallbacks. Priority: CMS value → fallback. Always attaches hreflang/canonical
 * via buildAlternates and honours the `noindex` flag.
 * OG image: seo-meta theo path → fallbackImage của trang (trang SP / hãng: ảnh tự sinh
 * `/og/...`) → ảnh OG mặc định (site-settings.seo.ogImage).
 */
export async function buildMetadata({
    path,
    locale,
    fallbackTitle,
    fallbackDescription,
    fallbackImage,
    enPath,
}: BuildMetadataArgs): Promise<Metadata> {
    const cms = await getSeoMeta(path, locale);

    const title = cms?.meta?.title || fallbackTitle;
    const description = cms?.meta?.description || fallbackDescription;
    const keywords = cms?.keywords
        ? cms.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : undefined;
    let image = seoImageUrl(cms) || fallbackImage;
    if (!image) {
        const settings = await getStoreSettings();
        image = settings.ogImageUrl || undefined;
    }

    const meta: Metadata = {
        title,
        description,
        alternates: buildAlternates(path, locale, enPath),
        openGraph: {
            title,
            description,
            url: locale === "en" && enPath !== null ? (enPath || (path === "/" ? "/en" : `/en${path}`)) : path,
            type: "website",
            locale: locale === "en" ? "en_US" : "vi_VN",
            // Ảnh tự sinh biết trước kích thước → khai báo để Facebook/Zalo hiện ảnh ngay lần chia sẻ đầu.
            ...(image
                ? { images: [isGeneratedOgImage(image) ? { url: image, ...OG_SIZE } : { url: image }] }
                : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };

    if (keywords?.length) meta.keywords = keywords;
    if (cms?.noindex) meta.robots = { index: false, follow: false };

    return meta;
}
