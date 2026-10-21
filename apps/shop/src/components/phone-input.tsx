"use client";

import type { CountryCode } from "libphonenumber-js";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type CountryOption, getCountryOptions } from "@/utils/phone";

const PINNED: CountryCode[] = ["VN", "US", "GB", "AU"];

type Props = {
    iso: CountryCode;
    rawValue: string;
    onChange: (next: { iso: CountryCode; raw: string }) => void;
    locale?: string;
    placeholder?: string;
    invalid?: boolean;
    id?: string;
};

export default function PhoneInput({
    iso,
    rawValue,
    onChange,
    locale = "vi",
    placeholder,
    invalid = false,
    id,
}: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const all = useMemo(() => getCountryOptions(locale), [locale]);
    const selected = useMemo(
        () => all.find((c) => c.iso === iso) || all.find((c) => c.iso === "VN"),
        [all, iso],
    );
    const ordered = useMemo(() => {
        const pinned = PINNED.map((p) => all.find((c) => c.iso === p)).filter(
            Boolean,
        ) as CountryOption[];
        const rest = all.filter((c) => !PINNED.includes(c.iso));
        return [...pinned, ...rest];
    }, [all]);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return ordered;
        const digits = q.replace(/[^\d]/g, "");
        return all.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.iso.toLowerCase().includes(q) ||
                c.callingCode.toLowerCase().includes(q) ||
                (!!digits &&
                    c.callingCode.replace(/[^\d]/g, "").startsWith(digits)),
        );
    }, [all, ordered, query]);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
                setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        setTimeout(() => searchRef.current?.focus(), 0);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const pickCountry = (c: CountryOption) => {
        onChange({ iso: c.iso, raw: rawValue });
        setOpen(false);
        setQuery("");
    };

    const base =
        "border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const borderColor = invalid ? "border-red-400" : "border-gray-200";

    return (
        <div className="relative flex gap-2" ref={wrapRef}>
            <button
                aria-expanded={open}
                aria-haspopup="listbox"
                className={`flex shrink-0 items-center gap-1.5 px-3 py-2 ${base} ${borderColor} bg-white`}
                onClick={() => setOpen((v) => !v)}
                type="button"
            >
                <span className="text-base leading-none">{selected?.flag}</span>
                <span className="text-sm font-medium">
                    {selected?.callingCode}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            <input
                className={`w-full px-3 py-2 ${base} ${borderColor}`}
                id={id}
                inputMode="tel"
                onChange={(e) => onChange({ iso, raw: e.target.value })}
                placeholder={placeholder || "09xx xxx xxx"}
                type="tel"
                value={rawValue}
            />

            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full max-w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                            className="w-full bg-transparent text-base focus:outline-none"
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={
                                locale === "en"
                                    ? "Search country or code…"
                                    : "Tìm quốc gia hoặc mã…"
                            }
                            ref={searchRef}
                            type="text"
                            value={query}
                        />
                    </div>
                    <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
                        {filtered.map((c) => (
                            <li key={c.iso}>
                                <button
                                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-gray-50 ${c.iso === iso ? "bg-gray-50" : ""}`}
                                    onClick={() => pickCountry(c)}
                                    type="button"
                                >
                                    <span className="text-base leading-none">
                                        {c.flag}
                                    </span>
                                    <span className="flex-1 truncate">
                                        {c.name}
                                    </span>
                                    <span className="text-gray-500">
                                        {c.callingCode}
                                    </span>
                                    {c.iso === iso && (
                                        <Check className="h-4 w-4 text-blue-600" />
                                    )}
                                </button>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="px-3 py-3 text-center text-sm text-gray-400">
                                {locale === "en" ? "No match" : "Không tìm thấy"}
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
