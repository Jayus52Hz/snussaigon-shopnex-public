"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const sortOptions = [
    { label: "Mới nhất", value: "created_at" },
    { label: "Giá: Thấp đến Cao", value: "price_asc" },
    { label: "Giá: Cao đến Thấp", value: "price_desc" },
];

export default function SortSelect({ sortBy }: { sortBy: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set("sortBy", value);
            router.push(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams]
    );

    return (
        <div className="flex items-center gap-2">
            <label
                className="text-sm text-ui-fg-muted whitespace-nowrap"
                htmlFor="sort-select"
            >
                Sắp xếp:
            </label>
            <select
                className="border border-ui-border-base rounded-lg px-3 py-2 text-sm bg-ui-bg-base text-ui-fg-base focus:outline-none focus:border-ui-fg-interactive"
                id="sort-select"
                onChange={(e) => handleChange(e.target.value)}
                value={sortBy}
            >
                {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
