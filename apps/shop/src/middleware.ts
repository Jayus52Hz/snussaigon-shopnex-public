import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that should NOT be localized (API, static files, Next.js internals)
const SKIP_PATHS = /^\/(?:api|_next|favicon\.ico|images|fonts|\.well-known)/;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip non-page requests
    if (SKIP_PATHS.test(pathname)) {
        return NextResponse.next();
    }

    // Chỉ "/en" hoặc "/en/..." — không bắt slug bắt đầu bằng "en" (vd /engu-iceberg-…)
    const isEnglishPath = /^\/en(?=\/|$)/.test(pathname);

    if (isEnglishPath) {
        // /en/snus → rewrite to /snus internally, set locale=en cookie
        const newPathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

        // Don't rewrite if it would be the same (prevents loops)
        if (newPathname === pathname) {
            return NextResponse.next();
        }

        const url = request.nextUrl.clone();
        url.pathname = newPathname;

        const response = NextResponse.rewrite(url);
        response.cookies.set("locale", "en", {
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
            sameSite: "lax",
        });
        response.headers.set("x-locale", "en");
        response.headers.set("x-pathname", pathname); // original /en/... path
        return response;
    }

    // Vietnamese is default — set cookie for consistency
    const response = NextResponse.next();
    response.cookies.set("locale", "vi", {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
    });
    response.headers.set("x-locale", "vi");
    response.headers.set("x-pathname", pathname);
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
