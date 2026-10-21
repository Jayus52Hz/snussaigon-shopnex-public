import { cookies, headers } from "next/headers";
import type { Locale } from "./dictionaries";
import { DEFAULT_LOCALE } from "./locale-paths";

// Re-export client-safe helpers so existing imports `@/i18n/locale` keep
// working unchanged. New client-side code should import directly from
// `@/i18n/locale-paths` to avoid pulling in `next/headers`.
export {
    DEFAULT_LOCALE,
    getLocaleFromPathname,
    localizePath,
} from "./locale-paths";

export async function getLocale(): Promise<Locale> {
    try {
        const cookieStore = await cookies();
        const localeCookie = cookieStore.get("locale")?.value;
        if (localeCookie === "en") return "en";
        return DEFAULT_LOCALE;
    } catch {
        // During SSR, cookies() might not be available
        try {
            const headersList = await headers();
            const pathname = headersList.get("x-pathname") || "";
            if (/^\/en(?=\/|$)/.test(pathname)) return "en";
        } catch {
            // fall through
        }
        return DEFAULT_LOCALE;
    }
}
