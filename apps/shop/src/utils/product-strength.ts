// Mapping nicotine_mg → strength bucket slug.
// Buckets (upper bound exclusive of the next bucket's lower .1 boundary):
//   Nhẹ 1–6 · Trung bình 6.1–9 · Mạnh 9.1–16 · Rất mạnh 16.1–30
//   Siêu mạnh 30.1–99.9 · Cực mạnh 100+
export const STRENGTH_RANGES: { slug: string; min: number; max: number }[] = [
    { slug: "light", min: 0, max: 6.1 },
    { slug: "regular", min: 6.1, max: 9.1 },
    { slug: "strong", min: 9.1, max: 16.1 },
    { slug: "extra-strong", min: 16.1, max: 30.1 },
    { slug: "extremely-strong", min: 30.1, max: 100 },
    { slug: "ultra-strong", min: 100, max: 99999 },
];

/** Trả về slug nhóm độ mạnh tương ứng với số mg nicotine. */
export function getStrengthSlug(mg: number): string {
    for (const r of STRENGTH_RANGES) {
        if (mg >= r.min && mg < r.max) return r.slug;
    }
    return "ultra-strong";
}

/** Dải mg của một nhóm sản phẩm, vd "6–14mg" hoặc "10mg". undefined nếu không có số liệu. */
export function formatStrengthRange(minMg?: number, maxMg?: number): string | undefined {
    if (minMg === undefined || maxMg === undefined) return undefined;
    const fmt = (n: number) => String(Math.round(n * 10) / 10);
    return minMg === maxMg ? `${fmt(minMg)}mg` : `${fmt(minMg)}–${fmt(maxMg)}mg`;
}
