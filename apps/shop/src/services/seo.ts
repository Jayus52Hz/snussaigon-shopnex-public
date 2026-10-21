import { payloadSdk } from "@/utils/payload-sdk";

export type SeoMetaDoc = {
    path: string;
    label?: string;
    keywords?: string;
    noindex?: boolean;
    meta?: {
        title?: string;
        description?: string;
        image?: { url?: string } | string | null;
    };
};

/**
 * Fetch CMS-managed SEO for a given storefront path (vi path, no /en prefix).
 * Returns null when no override exists — caller falls back to its own defaults.
 */
export async function getSeoMeta(
    path: string,
    locale: string
): Promise<SeoMetaDoc | null> {
    try {
        const result = await payloadSdk.find({
            collection: "seo-meta" as any,
            where: { path: { equals: path } },
            locale: locale as any,
            depth: 1,
            limit: 1,
        });
        return (result.docs?.[0] as SeoMetaDoc) || null;
    } catch {
        return null;
    }
}

/** Resolve the OG image URL from a SeoMeta doc's meta.image field. */
export function seoImageUrl(doc: SeoMetaDoc | null): string | undefined {
    const img = doc?.meta?.image;
    if (!img) return undefined;
    if (typeof img === "string") return undefined; // unresolved id
    return img?.url || undefined;
}
