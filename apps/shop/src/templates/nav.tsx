"use client";

import { Menu, X, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import CartDropdown from "@/components/cart-dropdown";
import Topbar from "@/components/topbar";
import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";

export default function Nav({ storeSettings, navigation: cmsNav }: { storeSettings: any; navigation?: any }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { dict, locale } = useLocale();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const switchLocale = useCallback(() => {
        const isEn = locale === "en";
        // Remove /en prefix if present to get base path
        const basePath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
        const targetPath = isEn ? basePath : `/en${basePath}`;
        window.location.href = targetPath;
    }, [locale, pathname]);

    const prefix = locale === "en" ? "/en" : "";

    // Base pathname without /en prefix — for active state comparison
    const basePath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

    // Use CMS navigation when available, fall back to hardcoded
    // Apply locale prefix to all internal URLs
    const applyPrefix = (url: string) =>
        url && url.startsWith("/") ? `${prefix}${url}` : (url || "#");

    const cmsMenuItems = cmsNav?.mainMenu?.length > 0
        ? cmsNav.mainMenu.map((item: any) => ({
            name: locale === "en" && item.label_en ? item.label_en : (item.label || ""),
            href: applyPrefix(item.url || ""),
            baseHref: item.url || "#", // for active state comparison
        }))
        : null;

    const navigation: { name: string; href: string; baseHref?: string }[] = cmsMenuItems || [
        { name: dict.nav.shop, href: `${prefix}/snus`, baseHref: "/snus" },
        { name: dict.common.brands, href: `${prefix}/snus`, baseHref: "/snus" },
        { name: dict.nav.blog, href: `${prefix}/blog`, baseHref: "/blog" },
        { name: dict.nav.contact, href: `${prefix}/contact`, baseHref: "/contact" },
    ];

    return (
        <div className="sticky top-0 z-50">
            {/* Announcement Bar */}
            <Topbar />

            <header
                className={cn(
                    "transition-all duration-300 border-b",
                    scrolled
                        ? "bg-white border-gray-200 shadow-sm"
                        : "bg-[#0a0a1a] border-transparent"
                )}
            >
                <nav className="content-container">
                    <div className="flex items-center justify-between h-14 md:h-16">
                        {/* Left: Logo */}
                        <div className="flex items-center">
                            <Link
                                className={cn(
                                    "text-lg sm:text-xl font-bold tracking-tight transition-colors",
                                    scrolled
                                        ? "text-gray-900"
                                        : "text-white"
                                )}
                                href={locale === "en" ? "/en" : "/"}
                            >
                                {storeSettings?.logoUrl ? (
                                    <img
                                        alt={storeSettings.name || "Snus Sai Gon"}
                                        className="h-8 w-auto"
                                        src={storeSettings.logoUrl}
                                    />
                                ) : (
                                    storeSettings?.name || "Snus Sai Gon"
                                )}
                            </Link>
                        </div>

                        {/* Center: Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {navigation.map((item) => (
                                <Link
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        scrolled
                                            ? "text-gray-600 hover:text-gray-900"
                                            : "text-white/80 hover:text-white",
                                        basePath === (item.baseHref || item.href) &&
                                            (scrolled
                                                ? "text-gray-900"
                                                : "text-white")
                                    )}
                                    href={item.href}
                                    key={item.name}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                aria-label="Tìm kiếm"
                                className={cn(
                                    "p-2 transition-colors",
                                    scrolled
                                        ? "text-gray-600 hover:bg-gray-100 rounded-lg"
                                        : "text-white hover:bg-white/10 rounded-lg"
                                )}
                                onClick={() => setSearchOpen(!searchOpen)}
                                type="button"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Language Toggle */}
                            <button
                                aria-label={locale === "en" ? "Switch to Vietnamese" : "Đổi ngôn ngữ"}
                                className={cn(
                                    "p-2 transition-colors text-sm font-medium min-w-[36px]",
                                    scrolled
                                        ? "text-gray-600 hover:bg-gray-100 rounded-lg"
                                        : "text-white hover:bg-white/10 rounded-lg"
                                )}
                                onClick={switchLocale}
                                type="button"
                            >
                                {locale === "en" ? "VI" : "EN"}
                            </button>

                            <CartDropdown />

                            <Link href={`${prefix}/account`}>
                                <button
                                    aria-label="Tài khoản"
                                    className={cn(
                                        "p-2 transition-colors",
                                        scrolled
                                            ? "text-gray-600 hover:bg-gray-100 rounded-lg hidden sm:block"
                                            : "text-white hover:bg-white/10 rounded-lg hidden sm:block"
                                    )}
                                    type="button"
                                >
                                    <User className="h-5 w-5" />
                                </button>
                            </Link>

                            <button
                                aria-label="Toggle menu"
                                className={cn(
                                    "md:hidden p-2 transition-colors",
                                    scrolled
                                        ? "text-gray-600 hover:bg-gray-100 rounded-lg"
                                        : "text-white hover:bg-white/10 rounded-lg"
                                )}
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                type="button"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Dropdown */}
                    {searchOpen && (
                        <div className="py-3 border-t border-gray-200 animate-slide-down">
                            <form action={`${prefix}/search`} method="GET">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-200"
                                        name="q"
                                        placeholder="Tìm sản phẩm, thương hiệu..."
                                        type="search"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
                            <div className="flex flex-col gap-1">
                                {navigation.map((item) => (
                                    <Link
                                        className={cn(
                                            "py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                                            scrolled
                                                ? "text-gray-600 hover:bg-gray-100"
                                                : "text-white/80 hover:bg-white/10"
                                        )}
                                        href={item.href}
                                        key={item.name}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>
            </header>
        </div>
    );
}
