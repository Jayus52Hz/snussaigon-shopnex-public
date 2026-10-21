"use client";

import { useLocale } from "@/i18n/locale-provider";
import { getTopbar } from "@/services/homepage";
import type { TopbarItem } from "@/types/homepage";
import { cn } from "@/utils";
import { BadgeCheck, Package, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
    "badge-check": <BadgeCheck className="h-3.5 w-3.5" />,
    package: <Package className="h-3.5 w-3.5" />,
    "shield-check": <ShieldCheck className="h-3.5 w-3.5" />,
    truck: <Truck className="h-3.5 w-3.5" />,
};

export default function Topbar() {
    const { locale } = useLocale();
    const [items, setItems] = useState<TopbarItem[]>([]);

    useEffect(() => {
        getTopbar()
            .then((data) => setItems(data))
            .catch(() => {});
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="bg-[#0a0a1a] text-white h-9 flex items-center overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(2)].map((_, i) => (
                    <span className="text-xs mx-8 inline-flex gap-6" key={i}>
                        {items.map((item, idx) => (
                            <span className="inline-flex items-center gap-1.5" key={`${i}-${idx}`}>
                                <span
                                    aria-label={item.icon}
                                    className="text-amber-400"
                                    role="img"
                                >
                                    {iconMap[item.icon] || null}
                                </span>
                                {locale === "en" ? item.text_en : item.text}
                                {idx < items.length - 1 && (
                                    <span className="text-amber-400 ml-4">·</span>
                                )}
                            </span>
                        ))}
                    </span>
                ))}
            </div>
        </div>
    );
}
