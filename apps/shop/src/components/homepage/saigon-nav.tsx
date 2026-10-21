"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    AnimatePresence,
    motion,
    useScroll,
    useMotionValueEvent,
} from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

import CartDropdown from "@/components/cart-dropdown";
import { localizePath, getLocaleFromPathname } from "@/i18n/locale-paths";
import SaigonLocationSwitcher, {
    type SaigonLocation,
} from "./saigon-location-switcher";

type NavLink = { label: string; href: string };

const FALLBACK_NAV_LINKS_VI: NavLink[] = [
    { label: "Snus", href: "/snus" },
    { label: "Caffeine", href: "/caffeine" },
    { label: "Blog", href: "/blog" },
    { label: "Về chúng tôi", href: "/about" },
];

const FALLBACK_NAV_LINKS_EN: NavLink[] = [
    { label: "Snus", href: "/snus" },
    { label: "Caffeine", href: "/caffeine" },
    { label: "Blog", href: "/blog" },
    { label: "About us", href: "/about" },
];

/** Prefix every internal path with /en when locale==="en". External and
 * already-prefixed links pass through untouched. */
function localizeHref(href: string, locale: string): string {
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    if (locale !== "en") return href;
    if (href === "/" || href === "") return "/en";
    if (href.startsWith("/en/") || href === "/en") return href;
    return `/en${href.startsWith("/") ? "" : "/"}${href}`;
}

function LangSwitch({ pathname }: { pathname: string }) {
    const current = getLocaleFromPathname(pathname);

    const setLocale = (lang: "vi" | "en") => {
        if (lang === current) return;
        // Persist via cookie so SSR locale picker reads it next visit
        document.cookie = `locale=${lang}; path=/; max-age=31536000; samesite=lax`;
        // Full reload (window.location) instead of router.push — soft nav
        // sometimes keeps the previous locale's RSC cache. Hard navigation
        // guarantees a fresh server render with the new cookie.
        window.location.href = localizePath(pathname, lang);
    };

    return (
        <div
            aria-label="Chuyển ngôn ngữ"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 p-[3px] font-body text-[12px] font-semibold tracking-wide md:p-1 md:text-[13px]"
            role="group"
        >
            <button
                aria-current={current === "vi"}
                className={`min-w-[32px] rounded-full px-[11px] py-[5px] transition-colors md:px-[14px] md:py-[6px] ${
                    current === "vi"
                        ? "bg-white text-saigon-base"
                        : "text-white/60 hover:text-white"
                }`}
                onClick={() => setLocale("vi")}
                type="button"
            >
                VI
            </button>
            <button
                aria-current={current === "en"}
                className={`min-w-[32px] rounded-full px-[11px] py-[5px] transition-colors md:px-[14px] md:py-[6px] ${
                    current === "en"
                        ? "bg-white text-saigon-base"
                        : "text-white/60 hover:text-white"
                }`}
                onClick={() => setLocale("en")}
                type="button"
            >
                EN
            </button>
        </div>
    );
}

export default function SaigonNav({
    locations = [],
    selectedLocationId = null,
    locale = "vi",
    logoUrl,
    storeName = "Snus Sai Gon",
    navigationData,
}: {
    locations?: SaigonLocation[];
    selectedLocationId?: null | string;
    locale?: string;
    logoUrl?: null | string;
    storeName?: string;
    navigationData?: any;
} = {}) {
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/" || pathname === "/en";
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const homeHref = locale === "en" ? "/en" : "/";

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        setSearchOpen(false);
        setOpen(false);
        router.push(localizeHref(`/search?q=${encodeURIComponent(q)}`, locale || "vi"));
    };

    // Resolve nav links: prefer CMS Navigation global → fallback hardcoded.
    const cmsMenu = (navigationData?.mainMenu as any[]) || [];
    const navLinks: NavLink[] =
        cmsMenu.length > 0
            ? cmsMenu
                  .map((m) => ({
                      label:
                          locale === "en"
                              ? m.label_en || m.label || ""
                              : m.label || m.label_en || "",
                      href: m.href || m.link || m.url || "/",
                  }))
                  .filter((l) => l.label && l.href)
            : locale === "en"
              ? FALLBACK_NAV_LINKS_EN
              : FALLBACK_NAV_LINKS_VI;

    useMotionValueEvent(scrollY, "change", (v) => {
        setScrolled(v > 80);
    });

    const solid = !isHome || scrolled;

    return (
        <motion.header
            animate={{
                backgroundColor: solid ? "#0D0D0D" : "rgba(13,13,13,0)",
                borderBottomColor: solid
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0)",
                boxShadow: solid ? "0 2px 12px rgba(0,0,0,.18)" : "none",
            }}
            className="fixed inset-x-0 top-0 z-50 border-b"
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="mx-auto flex h-[60px] max-w-[1600px] items-center justify-between px-4 md:px-8 lg:px-10">
                {/* Logo — image from CMS site-settings if present, falls back
                    to text. Click goes to locale-aware home. */}
                <Link
                    aria-label={storeName}
                    className="flex items-center gap-2 text-white"
                    href={homeHref}
                >
                    {logoUrl ? (
                        <Image
                            alt={storeName}
                            className="h-8 w-auto md:h-9"
                            height={36}
                            src={logoUrl}
                            width={140}
                        />
                    ) : (
                        <span className="font-display text-lg font-bold uppercase tracking-[0.05em] md:text-xl">
                            {storeName}
                        </span>
                    )}
                </Link>

                {/* Desktop nav — locale-aware paths */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            className="font-display text-[15px] font-medium uppercase tracking-[0.05em] text-white/85 transition-colors hover:text-white"
                            href={localizeHref(link.href, locale)}
                            key={link.label}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right icons + lang/location switcher
                    Icons bumped to 24px + gap 16px between siblings for safer
                    touch targets (no mis-taps between Cart / Menu / Search). */}
                <div className="flex items-center gap-3 md:gap-4">
                    {locations.length > 0 && (
                        <SaigonLocationSwitcher
                            initialId={selectedLocationId}
                            locations={locations}
                            variant="dark"
                        />
                    )}
                    <LangSwitch pathname={pathname} />
                    <button
                        aria-label="Search"
                        className="text-white/85 transition-colors hover:text-white"
                        onClick={() => setSearchOpen((v) => !v)}
                        type="button"
                    >
                        <Search className="h-6 w-6" />
                    </button>
                    <CartDropdown variant="dark" />
                    <button
                        aria-label="Menu"
                        className="text-white/85 transition-colors hover:text-white md:hidden"
                        onClick={() => setOpen(true)}
                        type="button"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Search panel — toggled by the search icon (mobile + desktop) */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden border-t border-white/10 bg-saigon-base"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <form
                            className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 md:px-8 lg:px-10"
                            onSubmit={submitSearch}
                        >
                            <Search className="h-5 w-5 shrink-0 text-white/50" />
                            <input
                                autoFocus
                                aria-label="Search"
                                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={
                                    locale === "en"
                                        ? "Search products..."
                                        : "Tìm sản phẩm..."
                                }
                                type="search"
                                value={query}
                            />
                            <button
                                aria-label="Close search"
                                className="text-white/60 transition-colors hover:text-white"
                                onClick={() => setSearchOpen(false)}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile fullscreen menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex flex-col bg-saigon-base md:hidden"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex h-[60px] items-center justify-between px-4">
                            <Link
                                aria-label={storeName}
                                className="flex items-center gap-2 text-white"
                                href={homeHref}
                                onClick={() => setOpen(false)}
                            >
                                {logoUrl ? (
                                    <Image
                                        alt={storeName}
                                        className="h-8 w-auto"
                                        height={32}
                                        src={logoUrl}
                                        width={120}
                                    />
                                ) : (
                                    <span className="font-display text-lg font-bold uppercase tracking-[0.05em]">
                                        {storeName}
                                    </span>
                                )}
                            </Link>
                            <div className="flex items-center gap-4">
                                <LangSwitch pathname={pathname} />
                                <button
                                    aria-label="Close menu"
                                    onClick={() => setOpen(false)}
                                    type="button"
                                >
                                    <X className="h-6 w-6 text-white" />
                                </button>
                            </div>
                        </div>
                        <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    animate={{ opacity: 1, x: 0 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    key={link.label}
                                    transition={{ duration: 0.3, delay: 0.05 * i }}
                                >
                                    <Link
                                        className="font-display text-4xl font-bold uppercase tracking-tight text-white transition-colors hover:text-white/70"
                                        href={localizeHref(link.href, locale)}
                                        onClick={() => setOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                        {locations.length > 0 && (
                            <div className="px-8 pb-4">
                                <SaigonLocationSwitcher
                                    initialId={selectedLocationId}
                                    locations={locations}
                                    variant="dark"
                                />
                            </div>
                        )}
                        <div className="px-8 pb-12 font-body text-sm text-white/60">
                            Smokeless vibe. Saigon spirit.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
