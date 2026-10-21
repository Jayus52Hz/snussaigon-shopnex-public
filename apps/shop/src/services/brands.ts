import { unstable_cache } from "next/cache";

import { locationManyWhereClause } from "@/i18n/location-constants";
import { payloadSdk } from "@/utils/payload-sdk";
import { hasProductImage } from "@/utils/product-image";

/** Mã quốc gia lưu ở brand-profiles.country (nhãn hiển thị nằm trong dictionaries). */
export type BrandCountry =
    | "czechia"
    | "denmark"
    | "norway"
    | "other"
    | "poland"
    | "sweden"
    | "switzerland"
    | "usa";

export type BrandProfile = {
    country?: BrandCountry;
    coverImage?: string;
    formats?: string;
    highlights: string[];
    intro?: string;
    manufacturer?: string;
    strengthScale?: string;
    tagline?: string;
};

export type BrandStats = {
    /** Sản phẩm snus đang bán được (inStock, không bị cờ Chưa kinh doanh). */
    inStock: number;
    maxMg?: number;
    minMg?: number;
    /** Sản phẩm có cờ Chưa kinh doanh. */
    notForSale: number;
    /** Tổng sản phẩm snus visible của brand (còn + hết hàng + chưa kinh doanh). */
    total: number;
};

export type BrandEntry = {
    logo?: string;
    name: string;
    profile?: BrandProfile;
    slug: string;
    stats: BrandStats;
};

const REVALIDATE = 300;

function emptyStats(): BrandStats {
    return { inStock: 0, notForSale: 0, total: 0 };
}

function mediaUrl(value: unknown): string | undefined {
    return (typeof value === "object" && value && (value as { url?: string }).url) || undefined;
}

/**
 * Danh bạ thương hiệu cho trang /brands và hero của /snus-{slug}.
 * - Nguồn brand: TOÀN BỘ term của attribute "brand" (kể cả brand chưa có sản phẩm
 *   còn hàng), theo sortOrder — cùng thứ tự với pill trang chủ.
 * - Số liệu: chỉ đếm sản phẩm snus visible (khớp nội dung trang /snus-{slug}),
 *   lọc theo cửa hàng đang chọn như getProducts.
 * - Profile (brand-profiles) có thể chưa có → các trường để trống.
 */
export const getBrandDirectory = unstable_cache(
    async (locale: string, locationId: null | string = null): Promise<BrandEntry[]> => {
        const baseWhere = {
            visible: { equals: true },
            productType: { equals: "snus" },
        };
        const locWhere = locationManyWhereClause(locationId);

        const [attrRes, productRes, profileRes] = await Promise.all([
            payloadSdk.find({
                collection: "attributes" as any,
                depth: 1,
                limit: 1,
                where: { slug: { equals: "brand" } } as any,
            }),
            payloadSdk.find({
                collection: "products",
                // depth 1 + gallery/variants: bỏ SP chưa có ảnh khỏi số liệu (khớp trang /snus-{slug})
                depth: 1,
                limit: 1000,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                select: { brand: true, inStock: true, notForSale: true, nicotine_mg: true, gallery: true, variants: true } as any,
                where: (locWhere ? { and: [baseWhere, locWhere] } : baseWhere) as any,
            }),
            payloadSdk
                .find({
                    collection: "brand-profiles" as any,
                    depth: 1,
                    limit: 200,
                    locale: locale as any,
                    fallbackLocale: "vi" as any,
                })
                // Collection chưa có (CMS chưa deploy) → vẫn render danh sách brand
                .catch(() => null),
        ]);
        // SDK không throw khi API trả lỗi (vd 404 collection chưa tồn tại) → docs có thể thiếu.
        const docsOf = (res: unknown): any[] | null => {
            const docs = (res as { docs?: unknown } | null)?.docs;
            return Array.isArray(docs) ? docs : null;
        };
        // Brand/sản phẩm lỗi → throw để unstable_cache không lưu danh bạ rỗng/sai số liệu.
        // Profile lỗi (collection chưa có) → bỏ qua.
        const attrDocs = docsOf(attrRes);
        const productDocs = docsOf(productRes);
        if (!attrDocs || !productDocs) throw new Error("[brands] CMS trả lỗi khi lấy attribute brand / products");

        const stats = new Map<string, BrandStats>();
        for (const p of productDocs) {
            if (!hasProductImage(p)) continue;
            const slug = typeof p.brand === "string" ? p.brand.toLowerCase() : "";
            if (!slug) continue;
            const s = stats.get(slug) ?? emptyStats();
            s.total += 1;
            if (p.notForSale === true) s.notForSale += 1;
            else if (p.inStock !== false) s.inStock += 1;
            const mg = Number(p.nicotine_mg);
            if (Number.isFinite(mg) && mg > 0) {
                s.minMg = s.minMg === undefined ? mg : Math.min(s.minMg, mg);
                s.maxMg = s.maxMg === undefined ? mg : Math.max(s.maxMg, mg);
            }
            stats.set(slug, s);
        }

        const profiles = new Map<string, BrandProfile>();
        for (const d of docsOf(profileRes) ?? []) {
            if (!d?.brandSlug) continue;
            profiles.set(d.brandSlug, {
                country: d.country || undefined,
                coverImage: mediaUrl(d.coverImage),
                formats: d.formats || undefined,
                highlights: Array.isArray(d.highlights)
                    ? d.highlights.map((h: any) => h?.text).filter(Boolean)
                    : [],
                intro: d.intro || undefined,
                manufacturer: d.manufacturer || undefined,
                strengthScale: d.strengthScale || undefined,
                tagline: d.tagline || undefined,
            });
        }

        const attr = attrDocs[0];
        const terms: any[] = Array.isArray(attr?.terms) ? attr.terms : [];
        return terms
            .filter((t) => t?.slug)
            .slice()
            .sort((a, b) => (a?.sortOrder ?? 99) - (b?.sortOrder ?? 99))
            .map((t) => ({
                logo: mediaUrl(t.image),
                name: (locale === "en" ? t.name_en || t.name : t.name) || t.slug,
                profile: profiles.get(t.slug),
                slug: t.slug,
                stats: stats.get(t.slug) ?? emptyStats(),
            }));
    },
    ["brands:getBrandDirectory"],
    { revalidate: REVALIDATE, tags: ["attributes", "products", "brand-profiles"] }
);

/** Một brand trong danh bạ (null nếu slug không có trong attribute "brand"). */
export async function getBrandEntry(
    slug: string,
    locale: string,
    locationId: null | string = null,
): Promise<BrandEntry | null> {
    const list = await getBrandDirectory(locale, locationId);
    return list.find((b) => b.slug === slug) ?? null;
}
