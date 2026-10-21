"use client";

import { useLocale } from "@/i18n/locale-provider";
import { ArrowRightMini } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import Link from "next/link";

type SectionHeadingProps = {
    className?: string;
    href?: string;
    linkText?: string;
    subtitle?: string;
    title: string;
};

export default function SectionHeading({
    className,
    href,
    linkText,
    subtitle,
    title,
}: SectionHeadingProps) {
    const { dict } = useLocale();

    return (
        <div
            className={clx(
                "flex items-end justify-between mb-4",
                className
            )}
        >
            <div>
                <h2 className="text-2xl font-semibold text-ui-fg-base">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-ui-fg-muted mt-1 text-sm">
                        {subtitle}
                    </p>
                )}
            </div>
            {href && (
                <Link
                    className="flex items-center gap-1 text-sm text-ui-fg-interactive hover:text-ui-fg-base shrink-0"
                    href={href}
                >
                    {linkText || dict.common.seeAll}
                    <ArrowRightMini className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}
