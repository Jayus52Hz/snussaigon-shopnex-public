/**
 * Client-safe locale path helpers. Split from `locale.ts` (which imports
 * `next/headers`) so Client Components can use these without dragging the
 * server-only `cookies()`/`headers()` API into the client bundle.
 */
import type { Locale } from "./dictionaries";

export const DEFAULT_LOCALE: Locale = "vi";

export function getLocaleFromPathname(pathname: string): Locale {
    if (/^\/en(?=\/|$)/.test(pathname)) return "en";
    return DEFAULT_LOCALE;
}

export function localizePath(pathname: string, locale: Locale): string {
    if (locale === "en") {
        // Remove any existing /en prefix, then prepend
        const clean = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
        return `/en${clean === "/" ? "" : clean}`;
    }
    // Vietnamese: strip /en prefix
    return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}
