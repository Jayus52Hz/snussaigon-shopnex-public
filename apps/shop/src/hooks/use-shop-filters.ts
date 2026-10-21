"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/i18n/locale-provider";
import { STRENGTH_RANGES, getStrengthSlug } from "@/utils/product-strength";
import { getStockGroup, isPurchasable } from "@/utils/product-availability";

export interface FilterOption {
    id: string;
    name: string;
    slug: string;
    count: number;
    /** URL ảnh của term (vd logo thương hiệu) — chỉ có khi CMS đã upload. */
    image?: string;
}

export interface MgBucket {
    label: string;
    min: number;
    max: number;
    count: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

/** Các mục bộ lọc storefront đang có UI. Mỗi mục gắn với 1 attribute trên CMS. */
export type FilterSectionKey = "brand" | "flavorCategory" | "flavor" | "strength" | "format";

// attribute slug (CMS) → mục bộ lọc. Attribute không có ở đây (origin, nicotine, category…)
// chưa có UI nên bỏ qua dù có tick "Hiển thị trong bộ lọc".
const SECTION_BY_ATTRIBUTE: Record<string, FilterSectionKey> = {
    "brand": "brand",
    "flavor-category": "flavorCategory",
    "flavor": "flavor",
    "strength": "strength",
    "format": "format",
};

// Dùng khi chưa tải được attributes từ CMS (render đầu / CMS lỗi).
const DEFAULT_SECTIONS: FilterSectionKey[] = ["brand", "flavorCategory", "strength", "format"];

export interface FilterOptions {
    /** Thứ tự các mục: attribute có showOnFilter, sắp theo filterOrder. Khoảng giá luôn ở cuối, ngoài danh sách này. */
    sections: FilterSectionKey[];
    brands: FilterOption[];
    flavorCategories: FilterOption[];
    flavors: FilterOption[];
    strengths: FilterOption[];
    formats: FilterOption[];
    mgBuckets: MgBucket[];
    priceRange: PriceRange;
}

/** "in-stock" = chỉ SP mua được (còn hàng, không "Chưa kinh doanh") — mặc định; "all" = mọi SP (URL ?availability=all). */
export type Availability = "all" | "in-stock";

export interface ActiveFilters {
    availability: Availability;
    brands: string[];
    flavorCategories: string[];
    flavors: string[];
    strengths: string[];
    formats: string[];
    mgMin: number | null;
    mgMax: number | null;
    priceMin: number | null;
    priceMax: number | null;
}

/** Các nhóm chọn nhiều: trong nhóm là OR, giữa các nhóm là AND. */
export type FacetKey = "brands" | "flavorCategories" | "flavors" | "strengths" | "formats";
export const FACET_KEYS: FacetKey[] = ["brands", "flavorCategories", "flavors", "strengths", "formats"];

/** Tên tham số URL. Mọi tham số chỉ là query → canonical vẫn là path (xem utils/alternates.ts). */
export const URL_PARAM: Record<FacetKey | "availability", string> = {
    availability: "availability",
    brands: "brands",
    flavorCategories: "flavor_category",
    flavors: "flavors",
    strengths: "strengths",
    formats: "formats",
};

export const EMPTY_FILTERS: ActiveFilters = {
    availability: "in-stock",
    brands: [],
    flavorCategories: [],
    flavors: [],
    strengths: [],
    formats: [],
    mgMin: null,
    mgMax: null,
    priceMin: null,
    priceMax: null,
};

// Canonical bilingual labels — keep filter deterministic regardless of CMS terms.
const STRENGTH_NAMES: Record<string, { vi: string; en: string }> = {
    "light":            { vi: "Nhẹ (1–6 mg)",            en: "Light (1–6 mg)" },
    "regular":          { vi: "Trung bình (6.1–9 mg)",   en: "Regular (6.1–9 mg)" },
    "strong":           { vi: "Mạnh (9.1–16 mg)",        en: "Strong (9.1–16 mg)" },
    "extra-strong":     { vi: "Rất mạnh (16.1–30 mg)",   en: "Extra Strong (16.1–30 mg)" },
    "extremely-strong": { vi: "Siêu mạnh (30.1–99.9 mg)", en: "Extremely Strong (30.1–99.9 mg)" },
    "ultra-strong":     { vi: "Cực mạnh (100 mg+)",      en: "Ultra Strong (100 mg+)" },
};

// Fetch + cache CMS attributes globally (singleton per session)
let _attributesCache: any[] | null = null;
let _attributesLoaded = false;
let _attributesFetching = false;
const _attributesCallbacks: Array<(data: any[]) => void> = [];

function fetchCmsAttributes(base: string): Promise<any[]> {
    if (_attributesCache) return Promise.resolve(_attributesCache);
    return new Promise((resolve) => {
        _attributesCallbacks.push(resolve);
        if (_attributesFetching) return;
        _attributesFetching = true;
        fetch(`${base}/api/attributes?limit=20&depth=1`)
            .then((r) => r.json())
            .then((d) => {
                _attributesCache = d.docs || [];
                _attributesLoaded = true;
                _attributesFetching = false;
                _attributesCallbacks.forEach((cb) => cb(_attributesCache!));
                _attributesCallbacks.length = 0;
            })
            .catch(() => {
                // Không đánh dấu loaded → dùng DEFAULT_SECTIONS
                _attributesCache = [];
                _attributesFetching = false;
                _attributesCallbacks.forEach((cb) => cb([]));
                _attributesCallbacks.length = 0;
            });
    });
}

export function useShopFilters(
    products: any[],
    serverBrandTerms?: { name: string; slug: string; image?: string }[],
    /** Attributes lấy sẵn phía server (services/homepage getFilterAttributes). Có thì không fetch client. */
    serverAttributes?: any[]
) {
    const { locale } = useLocale();
    const hasServerAttrs = !!serverAttributes && serverAttributes.length > 0;
    const [fetchedAttrs, setCmsAttrs] = useState<any[]>(_attributesCache || []);
    const [fetchedLoaded, setAttrsLoaded] = useState(_attributesLoaded);
    const cmsAttrs = hasServerAttrs ? serverAttributes! : fetchedAttrs;
    const attrsLoaded = hasServerAttrs || fetchedLoaded;
    const isEn = locale === "en";

    useEffect(() => {
        if (hasServerAttrs) return;
        const done = (data: any[]) => { setCmsAttrs(data); setAttrsLoaded(_attributesLoaded); };
        if (_attributesCache) { done(_attributesCache); return; }
        const base = process.env.NEXT_PUBLIC_STOREFRONT_URL || "";
        fetchCmsAttributes(base).then(done);
    }, [hasServerAttrs]);

    return useMemo(() => {
        // ── SECTIONS: attribute có tick showOnFilter, sắp theo filterOrder ────
        const sections: FilterSectionKey[] = attrsLoaded && cmsAttrs.length > 0
            ? cmsAttrs
                .filter((a: any) => a.showOnFilter && SECTION_BY_ATTRIBUTE[a.slug])
                .sort((a: any, b: any) => (a.filterOrder ?? 0) - (b.filterOrder ?? 0))
                .map((a: any) => SECTION_BY_ATTRIBUTE[a.slug])
            : DEFAULT_SECTIONS;

        // Helper: get CMS attribute terms by slug, sorted by sortOrder
        const getTerms = (attrSlug: string) => {
            const attr = cmsAttrs.find((a: any) => a.slug === attrSlug);
            if (!attr?.terms?.length) return [];
            return [...attr.terms].sort((a: any, b: any) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
        };

        // Helper: get display name from term (locale-aware)
        const termName = (t: any) =>
            isEn ? (t.name_en || t.name) : t.name;

        // ── BRANDS ────────────────────────────────────────────────────────────
        const brandTerms = getTerms("brand");
        const brandCountMap = new Map<string, number>();
        products.forEach((p: any) => {
            const slug = (p.brand || "").toLowerCase().replace(/\s+/g, "-");
            if (slug) brandCountMap.set(slug, (brandCountMap.get(slug) || 0) + 1);
        });

        // Nguồn term brand: ưu tiên SERVER (attribute "Thương hiệu", đáng tin ngay
        // render đầu) → fallback term fetch client → cuối cùng suy từ sản phẩm.
        const sourceTerms: { name: string; slug: string; image?: string }[] =
            serverBrandTerms && serverBrandTerms.length > 0
                ? serverBrandTerms
                : brandTerms.map((t: any) => ({ name: termName(t), slug: t.slug, image: t.image?.url || undefined }));

        const brands: FilterOption[] = sourceTerms.length
            ? sourceTerms
                .map((t) => ({ id: t.slug, name: t.name, slug: t.slug, image: t.image, count: brandCountMap.get(t.slug) || 0 }))
                .filter((b) => b.count > 0)
            : Array.from(brandCountMap.entries()).map(([slug, count]) => ({ id: slug, name: slug.toUpperCase(), slug, count }));

        // ── FLAVORS ───────────────────────────────────────────────────────────
        const flavorTerms = getTerms("flavor");
        const flavorCountMap = new Map<string, number>();
        products.forEach((p: any) => {
            const fl = p.flavor || p.flavour;
            if (fl) {
                const slug = fl.toLowerCase().replace(/\s+/g, "-");
                flavorCountMap.set(slug, (flavorCountMap.get(slug) || 0) + 1);
            }
        });

        const flavors: FilterOption[] = flavorTerms.length
            ? flavorTerms
                .map((t: any) => ({ id: t.slug, name: termName(t), slug: t.slug, count: flavorCountMap.get(t.slug) || 0 }))
                .filter((f) => f.count > 0)
            : Array.from(flavorCountMap.entries()).map(([slug, count]) => ({
                id: slug, name: slug.replace(/-/g, " "), slug, count
              })).sort((a, b) => a.name.localeCompare(b.name));

        // ── FLAVOR CATEGORIES (product.flavorCategory: mảng slug) ─────────────
        const flavorCategoryCountMap = new Map<string, number>();
        products.forEach((p: any) => {
            getFlavorCategories(p).forEach((slug) => {
                flavorCategoryCountMap.set(slug, (flavorCategoryCountMap.get(slug) || 0) + 1);
            });
        });
        const flavorCategoryTerms = getTerms("flavor-category");
        // Chưa có terms (render đầu, trước khi tải attributes) → tạm lấy tên từ slug
        const flavorCategories: FilterOption[] = flavorCategoryTerms.length
            ? flavorCategoryTerms
                .map((t: any) => ({ id: t.slug, name: termName(t), slug: t.slug, count: flavorCategoryCountMap.get(t.slug) || 0 }))
                .filter((f) => f.count > 0)
            : Array.from(flavorCategoryCountMap.entries()).map(([slug, count]) => ({
                id: slug, name: slug.replace(/-/g, " "), slug, count
              })).sort((a, b) => a.name.localeCompare(b.name));

        // ── FORMATS ───────────────────────────────────────────────────────────
        const formatTerms = getTerms("format");
        const formatCountMap = new Map<string, number>();
        products.forEach((p: any) => {
            const f = p.format;
            if (f) {
                const slug = f.toLowerCase().replace(/\s+/g, "-");
                formatCountMap.set(slug, (formatCountMap.get(slug) || 0) + 1);
            }
        });

        const formats: FilterOption[] = formatTerms.length
            ? formatTerms
                .map((t: any) => ({ id: t.slug, name: termName(t), slug: t.slug, count: formatCountMap.get(t.slug) || 0 }))
                .filter((f) => f.count > 0)
            : Array.from(formatCountMap.entries()).map(([slug, count]) => ({ id: slug, name: slug, slug, count }));

        // ── STRENGTHS (from nicotine_mg ranges) ───────────────────────────────
        const strengthCountMap = new Map<string, number>();
        products.forEach((p: any) => {
            const mg = parseFloat(p.nicotine_mg);
            if (!isNaN(mg)) {
                const slug = getStrengthSlug(mg);
                strengthCountMap.set(slug, (strengthCountMap.get(slug) || 0) + 1);
            }
        });

        // Always build from the canonical bilingual buckets in fixed order so
        // the filter labels/ranges match the agreed spec regardless of CMS terms.
        const strengths: FilterOption[] = STRENGTH_RANGES.map((r) => ({
            id: r.slug,
            slug: r.slug,
            name: (STRENGTH_NAMES[r.slug]?.[isEn ? "en" : "vi"]) || r.slug,
            count: strengthCountMap.get(r.slug) || 0,
        })).filter((s) => s.count > 0);

        // ── MG BUCKETS ────────────────────────────────────────────────────────
        const MG_BUCKETS_DEF = [
            { min: 1,  max: 4,   labelVi: "1-4mg (Nhẹ)",        labelEn: "1-4mg (Light)"        },
            { min: 5,  max: 8,   labelVi: "5-8mg (Trung Bình)",  labelEn: "5-8mg (Medium)"       },
            { min: 9,  max: 12,  labelVi: "9-12mg (Mạnh)",       labelEn: "9-12mg (Strong)"      },
            { min: 13, max: 9999,labelVi: "13mg+ (Cực Mạnh)",    labelEn: "13mg+ (Extra Strong)" },
        ];
        const mgBuckets: MgBucket[] = MG_BUCKETS_DEF.map((b) => ({
            label: isEn ? b.labelEn : b.labelVi,
            min: b.min,
            max: b.max,
            count: products.filter((p: any) => {
                const mg = parseFloat(p.nicotine_mg);
                return !isNaN(mg) && mg >= b.min && mg <= b.max;
            }).length,
        })).filter((b) => b.count > 0);

        // ── PRICE RANGE ───────────────────────────────────────────────────────
        const prices = products
            .map((p: any) => p.variants?.[0]?.price || 0)
            .filter((p) => p > 0);
        const priceRange: PriceRange = {
            min: prices.length > 0 ? Math.min(...prices) : 0,
            max: prices.length > 0 ? Math.max(...prices) : 0,
        };

        return { sections, brands, flavorCategories, flavors, strengths, formats, mgBuckets, priceRange };
    }, [products, cmsAttrs, attrsLoaded, serverBrandTerms, isEn]);
}


// ── Giá trị của sản phẩm theo từng nhóm ─────────────────────────────────────

const toSlug = (v: unknown): string => String(v || "").toLowerCase().replace(/\s+/g, "-");

function getFlavorCategories(p: any): string[] {
    return Array.isArray(p.flavorCategory) ? p.flavorCategory.filter(Boolean) : [];
}

function getFacetValues(p: any, facet: FacetKey): string[] {
    switch (facet) {
        case "brands":
            return p.brand ? [toSlug(p.brand)] : [];
        case "flavorCategories":
            return getFlavorCategories(p);
        case "flavors": {
            const fl = p.flavor || p.flavour;
            return fl ? [toSlug(fl)] : [];
        }
        case "strengths": {
            const mg = parseFloat(p.nicotine_mg);
            return isNaN(mg) ? [] : [getStrengthSlug(mg)];
        }
        case "formats":
            return p.format ? [toSlug(p.format)] : [];
    }
}

export { getStockGroup, isPurchasable };

// ── URL ⇄ bộ lọc ────────────────────────────────────────────────────────────

const parseList = (v: string | null): string[] => (v ? v.split(",").filter(Boolean) : []);
const parseNum = (v: string | null): number | null => {
    if (!v) return null;
    const n = parseInt(v);
    return isNaN(n) ? null : n;
};

/** `brandSlug` (trang /snus-{brand}) luôn nằm trong danh sách thương hiệu đang chọn. */
export function parseFiltersFromSearchParams(searchParams: URLSearchParams, brandSlug?: string): ActiveFilters {
    const brands = parseList(searchParams.get(URL_PARAM.brands));
    if (brandSlug && !brands.includes(brandSlug)) brands.unshift(brandSlug);
    return {
        availability: searchParams.get(URL_PARAM.availability) === "all" ? "all" : "in-stock",
        brands,
        flavorCategories: parseList(searchParams.get(URL_PARAM.flavorCategories)),
        flavors:   parseList(searchParams.get(URL_PARAM.flavors)),
        strengths: parseList(searchParams.get(URL_PARAM.strengths)),
        formats:   parseList(searchParams.get(URL_PARAM.formats)),
        mgMin:     parseNum(searchParams.get("mg_min")),
        mgMax:     parseNum(searchParams.get("mg_max")),
        priceMin:  parseNum(searchParams.get("price_min")),
        priceMax:  parseNum(searchParams.get("price_max")),
    };
}

/** Trang thương hiệu: "/snus" → "/snus-velo", "/en/snus" → "/en/snus-velo". */
export const brandPagePath = (shopPath: string, slug: string): string => `${shopPath}-${slug}`;

/**
 * URL cho bộ lọc mới. Trên trang shop snus và trang /snus-{brand}:
 * chọn đúng 1 thương hiệu → trang /snus-{brand}; từ 2 thương hiệu → /snus?brands=a,b;
 * bỏ hết thương hiệu → /snus. Trang khác (caffeine, danh mục…) giữ path, dùng ?brands=.
 * Các tham số lạ trong URL hiện tại được giữ nguyên.
 */
export function buildFilteredUrl(
    pathname: string,
    currentParams: URLSearchParams,
    filters: ActiveFilters,
    opts: { brandSlug?: string; shopPath: string },
): string {
    const params = new URLSearchParams(currentParams.toString());
    let path = pathname;
    let brands = filters.brands;
    if (opts.brandSlug || pathname === opts.shopPath) {
        if (brands.length === 1) {
            path = brandPagePath(opts.shopPath, brands[0]);
            brands = [];
        } else {
            path = opts.shopPath;
        }
    }
    const setList = (key: string, values: string[]) => {
        if (values.length > 0) params.set(key, values.join(",")); else params.delete(key);
    };
    const setNum = (key: string, value: number | null) => {
        if (value !== null) params.set(key, String(value)); else params.delete(key);
    };
    // Mặc định là in-stock → không ghi lên URL; chọn "Tất cả" → ?availability=all
    if (filters.availability === "all") params.set(URL_PARAM.availability, "all");
    else params.delete(URL_PARAM.availability);
    setList(URL_PARAM.brands, brands);
    setList(URL_PARAM.flavorCategories, filters.flavorCategories);
    setList(URL_PARAM.flavors, filters.flavors);
    setList(URL_PARAM.strengths, filters.strengths);
    setList(URL_PARAM.formats, filters.formats);
    setNum("mg_min", filters.mgMin);
    setNum("mg_max", filters.mgMax);
    setNum("price_min", filters.priceMin);
    setNum("price_max", filters.priceMax);
    // Giữ dấu phẩy dễ đọc: ?brands=velo,zyn thay vì velo%2Czyn
    const qs = params.toString().replace(/%2C/gi, ",");
    return qs ? `${path}?${qs}` : path;
}

/** Số nhóm đang lọc (badge nút "Bộ lọc" trên mobile). Brand cố định của trang brand không tính. */
export function getActiveFilterCount(filters: ActiveFilters, brandSlug?: string): number {
    let count = 0;
    if (filters.availability !== EMPTY_FILTERS.availability) count++;
    if (filters.brands.some((b) => b !== brandSlug)) count++;
    if (filters.flavorCategories.length > 0) count++;
    if (filters.flavors.length > 0)  count++;
    if (filters.strengths.length > 0) count++;
    if (filters.formats.length > 0)  count++;
    if (filters.mgMin !== null || filters.mgMax !== null) count++;
    if (filters.priceMin !== null || filters.priceMax !== null) count++;
    return count;
}

// ── Lọc + đếm faceted ───────────────────────────────────────────────────────

/**
 * Lọc sản phẩm theo mọi nhóm. `except` bỏ qua 1 nhóm — dùng để đếm số SP của từng
 * giá trị trong nhóm đó khi kết hợp với lựa chọn hiện tại ở các nhóm KHÁC.
 */
export function applyFilters(
    products: any[],
    filters: ActiveFilters,
    except?: FacetKey | "availability",
): any[] {
    return products.filter((p: any) => {
        if (except !== "availability" && filters.availability === "in-stock" && !isPurchasable(p)) return false;
        for (const facet of FACET_KEYS) {
            if (facet === except) continue;
            const selected = filters[facet];
            if (selected.length === 0) continue;
            if (!getFacetValues(p, facet).some((v) => selected.includes(v))) return false;
        }
        const mg = parseFloat(p.nicotine_mg);
        if (filters.mgMin !== null && !isNaN(mg) && mg < filters.mgMin) return false;
        if (filters.mgMax !== null && !isNaN(mg) && mg > filters.mgMax) return false;
        if (filters.priceMin !== null || filters.priceMax !== null) {
            const price = p.variants?.[0]?.price || 0;
            if (filters.priceMin !== null && price < filters.priceMin) return false;
            if (filters.priceMax !== null && price > filters.priceMax) return false;
        }
        return true;
    });
}

export interface FacetCounts {
    availability: Record<Availability, number>;
    values: Record<FacetKey, Map<string, number>>;
}

/** Số SP cho từng giá trị nếu chọn thêm giá trị đó (0 → disable trên UI). */
export function getFacetCounts(products: any[], filters: ActiveFilters): FacetCounts {
    const values = {} as Record<FacetKey, Map<string, number>>;
    for (const facet of FACET_KEYS) {
        const map = new Map<string, number>();
        for (const p of applyFilters(products, filters, facet)) {
            for (const v of getFacetValues(p, facet)) map.set(v, (map.get(v) || 0) + 1);
        }
        values[facet] = map;
    }
    const availabilityPool = applyFilters(products, filters, "availability");
    return {
        availability: {
            "all": availabilityPool.length,
            "in-stock": availabilityPool.filter(isPurchasable).length,
        },
        values,
    };
}
