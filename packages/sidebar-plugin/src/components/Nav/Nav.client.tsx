"use client";

import type { NavGroupType } from "@payloadcms/ui/shared";

import { getTranslation } from "@payloadcms/translations";
import { Link, useConfig, useTranslation } from "@payloadcms/ui";
import { EntityType, formatAdminURL } from "@payloadcms/ui/shared";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

import { getNavIcon } from "./get-nav-icon";
import {
    getActiveGroup,
    getFilteredEntities,
    getSortedGroups,
} from "./nav-utils";

type NavProps = {
    groups: NavGroupType[];
    groupsConfig?: Record<string, { icon: string; name: string }>;
};

const baseClass = "nav";

export const NavClient = ({ groups, groupsConfig }: NavProps) => {
    const pathname = usePathname();
    const {
        config: {
            routes: { admin: adminRoute },
        },
    } = useConfig();
    const { i18n } = useTranslation();

    const activeGroup = getActiveGroup(pathname, adminRoute);
    const sortedGroups = getSortedGroups(groups);

    return (
        <div className="menu">
            {/* Home link */}
            <li className="group">
                <Link
                    className={`${baseClass}__link group-toggle`}
                    href={adminRoute}
                >
                    <Home size={16} />
                    {"Home"}
                </Link>
            </li>

            {sortedGroups.map(({ entities, label: groupLabel }, key) => {
                const groupSlug = (groupLabel as string).toLowerCase();
                const Icon = getNavIcon(groupSlug, groupsConfig);

                return (
                    <li className="group" key={key}>
                        {/* Group label — section header only, no navigation */}
                        <span className={`${baseClass}__link group-toggle group-label`}>
                            {Icon && <Icon size={16} />}
                            {getTranslation(groupLabel, i18n)}
                        </span>

                        {/* All entities — always visible */}
                        {entities.map(({ slug, type, label }) => {
                            let href: null | string = null;
                            if (type === EntityType.collection) {
                                href = formatAdminURL({
                                    adminRoute,
                                    path: `/collections/${slug}`,
                                });
                            } else if (type === EntityType.global) {
                                href = formatAdminURL({
                                    adminRoute,
                                    path: `/globals/${slug}`,
                                });
                            }
                            const isActive = slug === activeGroup;
                            return (
                                <Link
                                    className={`${baseClass}__link sub-group-list${isActive ? " active" : ""}`}
                                    href={href || ""}
                                    key={slug}
                                >
                                    {getTranslation(label, i18n)}
                                </Link>
                            );
                        })}
                    </li>
                );
            })}
        </div>
    );
};
