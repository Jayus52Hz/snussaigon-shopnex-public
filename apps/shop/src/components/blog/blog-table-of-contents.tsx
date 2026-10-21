"use client";

import { cn } from "@/utils";
import { List } from "lucide-react";
import { useEffect, useState } from "react";

type TOCItem = {
    id: string;
    level: number;
    text: string;
};

export default function BlogTableOfContents() {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const els = document.querySelectorAll(".article-prose h2, .article-prose h3");
        const items: TOCItem[] = [];
        els.forEach((el, i) => {
            const id = el.id || `heading-${i}`;
            if (!el.id) el.id = id;
            items.push({
                id,
                level: el.tagName === "H2" ? 2 : 3,
                text: el.textContent || "",
            });
        });
        setHeadings(items);

        if (items.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: "-80px 0px -60% 0px" }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (headings.length < 2) return null;

    return (
        <div className="lg:sticky lg:top-24">
            {/* Mobile toggle */}
            <button
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3 lg:hidden"
                onClick={() => setOpen(!open)}
                type="button"
            >
                <List className="h-4 w-4" />
                Mục lục
                <span className={cn("transition-transform", open && "rotate-180")}>▾</span>
            </button>

            <div className={cn("lg:block", !open && "hidden")}>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 hidden lg:block">
                    Mục lục
                </h4>
                <nav className="space-y-1">
                    {headings.map((h) => (
                        <a
                            className={cn(
                                "block text-sm py-1.5 border-l-2 transition-colors",
                                h.level === 3 ? "pl-5 pr-2" : "pl-3 pr-2 font-medium",
                                activeId === h.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                            )}
                            href={`#${h.id}`}
                            key={h.id}
                            onClick={() => setOpen(false)}
                        >
                            {h.text}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
