"use client";

import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import Topbar from "@/components/topbar";
import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { ShoppingCart } from "lucide-react";
import { useCart } from "react-use-cart";

type NavItem = {
    id: string;
    label: string;
    url: string;
    newTab?: boolean;
    subItems?: NavItem[];
};

export default function Nav({
    navigation,
    storeSettings,
}: {
    navigation: any;
    storeSettings: any;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const pathname = usePathname();
    const { dict, locale } = useLocale();
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const switchLocale = useCallback(() => {
        const isEn = locale === "en";
        const basePath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
        const targetPath = isEn ? basePath : `/en${basePath}`;
        window.location.href = targetPath;
    }, [locale, pathname]);

    const prefix = locale === "en" ? "/en" : "";

    const mainMenu: NavItem[] = navigation?.mainMenu?.length
        ? navigation.mainMenu
        : [
            { id: "1", label: dict.nav.shop, url: `${prefix}/snus`, subItems: [] },
            { id: "2", label: dict.common.brands, url: `${prefix}/snus`, subItems: [] },
            { id: "3", label: dict.nav.blog, url: `${prefix}/blog`, subItems: [] },
            { id: "4", label: dict.nav.contact, url: `${prefix}/contact`, subItems: [] },
        ];

    const mobileMenu: NavItem[] = navigation?.mobileMenu?.length
        ? navigation.mobileMenu
        : mainMenu;

    return (
        <div className="sticky top-0 z-50">
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
                        <div className="hidden md:flex items-center gap-1">
                            {mainMenu.map((item) => (
                                <div
                                    className="relative"
                                    key={item.id}
                                    onMouseEnter={() => item.subItems?.length && setOpenSubmenu(item.id)}
                                    onMouseLeave={() => setOpenSubmenu(null)}
                                >
                                    <Link
                                        className={cn(
                                            "px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-0.5",
                                            scrolled
                                                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                : "text-white/80 hover:text-white hover:bg-white/10"
                                        )}
                                        href={item.url || "#"}
                                        target={item.newTab ? "_blank" : undefined}
                                    >
                                        {item.label}
                                        {item.subItems?.length ? (
                                            <ChevronDown className="h-3 w-3 ml-0.5 opacity-60" />
                                        ) : null}
                                    </Link>
                                    {item.subItems?.length && openSubmenu === item.id ? (
                                        <div
                                            className={cn(
                                                "absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg border min-w-[180px] z-50",
                                                scrolled
                                                    ? "bg-white border-gray-200"
                                                    : "bg-[#1a1a2e] border-white/10"
                                            )}
                                        >
                                            {item.subItems.map((sub) => (
                                                <Link
                                                    className={cn(
                                                        "block px-4 py-2 text-sm transition-colors",
                                                        scrolled
                                                            ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                                    )}
                                                    href={sub.url}
                                                    key={sub.id}
                                                    target={sub.newTab ? "_blank" : undefined}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
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

                            <Link
                                className={cn(
                                    "relative p-2 transition-colors",
                                    scrolled
                                        ? "text-gray-600 hover:bg-gray-100 rounded-lg"
                                        : "text-white hover:bg-white/10 rounded-lg"
                                )}
                                href={`${prefix}/cart`}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                )}
                            </Link>

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
                                {(navigation?.mobileMenu?.length ? navigation.mobileMenu : mainMenu).map((item: NavItem) => (
                                    <div key={item.id}>
                                        <Link
                                            className={cn(
                                                "py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                                                scrolled
                                                    ? "text-gray-600 hover:bg-gray-100"
                                                    : "text-white/80 hover:bg-white/10"
                                            )}
                                            href={item.url || "#"}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            {item.label}
                                        </Link>
                                        {item.subItems?.map((sub) => (
                                            <Link
                                                className={cn(
                                                    "py-2 pl-8 pr-4 rounded-lg text-sm transition-colors",
                                                    scrolled
                                                        ? "text-gray-500 hover:bg-gray-50"
                                                        : "text-white/60 hover:bg-white/5"
                                                )}
                                                href={sub.url}
                                                key={sub.id}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>
            </header>
        </div>
    );
}
