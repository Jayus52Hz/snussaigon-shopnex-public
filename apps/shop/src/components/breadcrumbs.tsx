"use client";

import { useLocale } from "@/i18n/locale-provider";
import { localizePath } from "@/i18n/locale-paths";
import { generateBreadcrumbSchema } from "@/utils/structured-data";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    const { dict, locale } = useLocale();

    // Giữ nguyên locale đang xem cho mọi link điều hướng (Home + các mục).
    const homeHref = localizePath("/", locale);

    const schemaItems = [
        { name: dict.common.home, url: homeHref },
        ...items.map((item) => ({
            name: item.label,
            url: localizePath(item.href || "/", locale),
        })),
    ];

    const breadcrumbSchema = generateBreadcrumbSchema(schemaItems);

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
                type="application/ld+json"
            />
            <nav
                aria-label="Breadcrumb"
                className="content-container pb-2 pt-5 sm:py-4"
            >
                <ol
                    className="flex items-center gap-2 flex-wrap text-sm text-ui-fg-muted"
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                >
                    <li
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                    >
                        <Link
                            className="flex items-center hover:text-ui-fg-base transition-colors"
                            href={homeHref}
                            itemProp="item"
                        >
                            <Home className="h-4 w-4" />
                            <span className="sr-only" itemProp="name">
                                {dict.common.home}
                            </span>
                        </Link>
                        <meta content="1" itemProp="position" />
                    </li>

                    {items.map((item, i) => (
                        <li
                            className="flex items-center gap-2"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                            key={i}
                        >
                            <ChevronRight
                                aria-hidden="true"
                                className="w-3.5 h-3.5"
                            />
                            {item.href ? (
                                <Link
                                    className="hover:text-ui-fg-base transition-colors"
                                    href={localizePath(item.href, locale)}
                                    itemProp="item"
                                >
                                    <span itemProp="name">{item.label}</span>
                                </Link>
                            ) : (
                                <span
                                    className="text-ui-fg-base font-medium"
                                    itemProp="name"
                                >
                                    {item.label}
                                </span>
                            )}
                            <meta
                                content={(i + 2).toString()}
                                itemProp="position"
                            />
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
