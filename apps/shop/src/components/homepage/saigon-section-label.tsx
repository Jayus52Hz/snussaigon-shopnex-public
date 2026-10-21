"use client";

import Link from "next/link";

import { useLocale } from "@/i18n/locale-provider";
import { localizePath } from "@/i18n/locale-paths";

export default function SaigonSectionLabel({
    title,
    href,
    linkText,
}: {
    title: string;
    href?: string;
    linkText?: string;
}) {
    const { locale } = useLocale();
    // Default "see all" link auto-translates if caller omits linkText
    const resolvedLinkText =
        linkText || (locale === "en" ? "See all" : "Xem tất cả");

    // External URLs open in a new tab automatically.
    const isExternal = !!href && /^https?:\/\//.test(href);
    const linkCls =
        "tap-press font-body inline-flex items-center gap-1.5 border-b border-saigon-base pb-[2px] text-[13px] font-medium uppercase tracking-[0.06em] text-saigon-base transition-opacity hover:opacity-60 md:text-[14px]";

    return (
        <div
            data-component="sg-section-label"
            className="mb-6 flex flex-wrap items-center justify-between gap-2 md:mb-8"
        >
            <span className="inline-block rounded-[2px] bg-saigon-base px-3.5 py-1.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-white md:px-4 md:text-[14px]">
                {title}
            </span>
            {href &&
                (isExternal ? (
                    <a
                        className={linkCls}
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {resolvedLinkText}
                        <span aria-hidden>↗</span>
                    </a>
                ) : (
                    <Link className={linkCls} href={localizePath(href, locale)}>
                        {resolvedLinkText}
                        <span aria-hidden>↗</span>
                    </Link>
                ))}
        </div>
    );
}
