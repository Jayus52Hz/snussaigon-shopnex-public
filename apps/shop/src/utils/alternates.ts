/**
 * Build Next.js alternates metadata (canonical + hreflang) for a given path pair.
 * `enPathOverride` cho phép EN dùng path riêng (vd blog: slugEn thay vì slug).
 * Truyền `null` khi trang không có bản EN → bỏ hreflang en.
 */
export function buildAlternates(viPath: string, locale: string, enPathOverride?: string | null) {
    if (enPathOverride === null) {
        return {
            canonical: viPath,
            languages: { "vi": viPath, "x-default": viPath },
        };
    }
    const enPath = enPathOverride || (viPath === "/" ? "/en" : `/en${viPath}`);
    return {
        canonical: locale === "en" ? enPath : viPath,
        languages: {
            "vi": viPath,
            "en": enPath,
            "x-default": viPath,
        },
    };
}
