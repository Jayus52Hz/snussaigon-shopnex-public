"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Instagram, Facebook, MessageCircle, Music2 } from "lucide-react";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type FooterSocial = { icon: any; label: string; href: string };

/* ─────────────────────────────────────────────────────────────────────────────
 * Fallback content per locale — used when Payload "footer" global is empty.
 * Class anchors (data-component) follow the "sg-footer-*" convention so
 * future tweaks can be made surgically.
 * ──────────────────────────────────────────────────────────────────────── */

const FALLBACK = {
    vi: {
        shopTitle: "Shop",
        infoTitle: "Thông tin",
        tagline: "Smokeless vibe. Saigon spirit.",
        bottomLeft: "©2026 Snus Sai Gon. All rights reserved.",
        bottomRight: "Smokeless Vibe. HCMC.",
        addressLabel: "Địa chỉ",
        phoneLabel: "Hotline",
        shopLinks: [
            { label: "Tất cả sản phẩm", href: "/snus" },
            { label: "Tất cả thương hiệu", href: "/brands" },
            { label: "VELO", href: "/snus-velo" },
            { label: "ZYN", href: "/snus-zyn" },
            { label: "KILLA", href: "/snus-killa" },
        ] as FooterLink[],
        infoLinks: [
            { label: "Về chúng tôi", href: "/about" },
            { label: "Chính sách", href: "/policy" },
            { label: "Liên hệ", href: "/contact" },
            { label: "Blog", href: "/blog" },
        ] as FooterLink[],
    },
    en: {
        shopTitle: "Shop",
        infoTitle: "Information",
        tagline: "Smokeless vibe. Saigon spirit.",
        bottomLeft: "©2026 Snus Sai Gon. All rights reserved.",
        bottomRight: "Smokeless Vibe. HCMC.",
        addressLabel: "Address",
        phoneLabel: "Hotline",
        shopLinks: [
            { label: "All products", href: "/snus" },
            { label: "All brands", href: "/brands" },
            { label: "VELO", href: "/snus-velo" },
            { label: "ZYN", href: "/snus-zyn" },
            { label: "KILLA", href: "/snus-killa" },
        ] as FooterLink[],
        infoLinks: [
            { label: "About us", href: "/about" },
            { label: "Policies", href: "/policy" },
            { label: "Contact", href: "/contact" },
            { label: "Blog", href: "/blog" },
        ] as FooterLink[],
    },
};

const STORE_ADDRESS = "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây, TP.HCM";
const STORE_HOTLINE = "0896 561 023";
const STORE_HOTLINE_TEL = "+84896561023";

/** Prefix internal hrefs with /en when locale === "en". */
function localizeHref(href: string, locale: string): string {
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    if (locale !== "en") return href;
    if (href === "/" || href === "") return "/en";
    if (href.startsWith("/en/") || href === "/en") return href;
    return `/en${href.startsWith("/") ? "" : "/"}${href}`;
}

/** Map CMS footer columns to our render shape. Each column may have
 * { title, links: [{ label, href }] }. Falls back to undefined when blank. */
function resolveColumns(footerData: any, locale: string): FooterColumn[] | undefined {
    const cols = footerData?.columns as any[] | undefined;
    if (!cols || cols.length === 0) return undefined;
    return cols
        .map((c) => ({
            title: c.title || c.label || "",
            links: ((c.links as any[]) || [])
                .map((l) => ({
                    label: l.label || l.label_en || "",
                    href: l.href || l.url || "/",
                }))
                .filter((l) => l.label && l.href),
        }))
        .filter((c) => c.title || c.links.length > 0);
}

export default function SaigonFooter({
    footerData,
    locale = "vi",
}: {
    footerData?: any;
    locale?: string;
} = {}) {
    const t = FALLBACK[locale === "en" ? "en" : "vi"];

    // Columns: prefer CMS → fallback to local 2-column layout
    const cmsColumns = resolveColumns(footerData, locale);
    const columns: FooterColumn[] = cmsColumns || [
        { title: t.shopTitle, links: t.shopLinks },
        { title: t.infoTitle, links: t.infoLinks },
    ];

    const tagline = footerData?.description || t.tagline;
    const phone = footerData?.phone || STORE_HOTLINE;
    const phoneTel = phone.replace(/[^\d+]/g, "").startsWith("+")
        ? phone.replace(/[^\d+]/g, "")
        : `+84${phone.replace(/^0/, "").replace(/[^\d]/g, "")}`;
    const address = footerData?.address || STORE_ADDRESS;
    // Zalo chỉ hiện khi CMS có khai báo; nhận cả URL lẫn số Zalo
    const zalo: string | undefined = footerData?.zalo?.trim();
    const zaloHref = zalo
        ? zalo.startsWith("http")
            ? zalo
            : `https://zalo.me/${zalo}`
        : undefined;

    // Socials: chỉ hiện icon có link khai báo trong global Footer (trường phẳng
    // facebook/instagram/tiktok/zalo). Trống hết → không render icon nào.
    const socials = [
        { icon: Instagram, label: "Instagram", href: footerData?.instagram?.trim() },
        { icon: Facebook, label: "Facebook", href: footerData?.facebook?.trim() },
        { icon: MessageCircle, label: "Zalo OA", href: zaloHref },
        { icon: Music2, label: "TikTok", href: footerData?.tiktok?.trim() },
    ].filter((s): s is FooterSocial => !!s.href);

    return (
        <footer
            data-component="sg-footer"
            className="border-t border-white/10 bg-saigon-base pb-7 pt-16 md:pt-20"
        >
            <div className="content-container">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
                    {/* Brand block */}
                    <motion.div
                        data-component="sg-footer-brand"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="font-display text-[40px] font-bold uppercase leading-[0.95] tracking-tight text-white md:text-5xl lg:text-[64px]">
                            Snus Sai Gon
                        </h2>
                        <p className="font-body mt-5 max-w-[32ch] text-[15px] text-white/60">
                            {tagline}
                        </p>
                        <div
                            data-component="sg-footer-socials"
                            className="mt-8 flex items-center gap-4"
                        >
                            {socials.map(({ icon: Icon, label, href }) => (
                                <a
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
                                    href={href}
                                    key={label}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                            <a
                                aria-label="Tripadvisor"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/95 transition-colors hover:border-white"
                                href="https://www.tripadvisor.com.vn/Attraction_Review-g293925-d34413985-Reviews-Snus_Sai_Gon_Engu_Pouches-Ho_Chi_Minh_City.html"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    alt="Tripadvisor"
                                    className="h-4 w-4"
                                    height={16}
                                    loading="lazy"
                                    src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logomark.svg"
                                    width={16}
                                />
                            </a>
                        </div>
                    </motion.div>

                    {/* Link columns */}
                    <motion.div
                        data-component="sg-footer-columns"
                        className="grid grid-cols-2 gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        {columns.slice(0, 2).map((col, idx) => (
                            <div key={col.title || idx}>
                                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                                    {col.title}
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <Link
                                                className="font-body text-sm text-white/70 transition-colors hover:text-white"
                                                href={localizeHref(
                                                    l.href,
                                                    locale
                                                )}
                                            >
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                {/* Address + phone block lives next to the
                                    second column (info side) */}
                                {idx === 1 && (
                                    <div
                                        data-component="sg-footer-contact"
                                        className="mt-6 space-y-2 font-body text-sm text-white/60"
                                    >
                                        <p>
                                            <span
                                                aria-label={t.addressLabel}
                                                role="img"
                                            >
                                                📍
                                            </span>{" "}
                                            {address}
                                        </p>
                                        <p>
                                            <span
                                                aria-label={t.phoneLabel}
                                                role="img"
                                            >
                                                📞
                                            </span>{" "}
                                            <a
                                                className="font-semibold text-white/90 transition-opacity hover:opacity-80"
                                                href={`tel:${phoneTel}`}
                                            >
                                                {phone}
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div
                    data-component="sg-footer-bottom"
                    className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-5 md:mt-16 md:flex-row md:items-center md:gap-3 md:pt-6"
                >
                    <p className="font-display text-xs uppercase tracking-[0.15em] text-white/40">
                        {t.bottomLeft}
                    </p>
                    <p className="font-display text-xs uppercase tracking-[0.15em] text-white/40">
                        {t.bottomRight}
                    </p>
                </div>
            </div>
        </footer>
    );
}
