"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LOCATION_COOKIE } from "@/i18n/location-constants";

export type SaigonLocation = {
    id: number | string;
    name: string;
    address?: string;
};

/**
 * Compact dropdown that lets the customer pick which physical store they're
 * shopping for. Persists choice via the `selected-location` cookie (same
 * pattern as `locale`). Homepage / brand pages then filter content by the
 * cookie value server-side.
 */
export default function SaigonLocationSwitcher({
    locations,
    initialId,
    variant = "dark",
}: {
    locations: SaigonLocation[];
    initialId?: null | string;
    variant?: "dark" | "light";
}) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<null | string>(
        initialId ? String(initialId) : null
    );
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    if (!locations || locations.length === 0) return null;

    const currentLoc = current
        ? locations.find((l) => String(l.id) === current)
        : null;
    const label = currentLoc?.name || "Tất cả cửa hàng";

    const pickLocation = (id: null | string) => {
        setCurrent(id);
        setOpen(false);
        if (id) {
            document.cookie = `${LOCATION_COOKIE}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        } else {
            document.cookie = `${LOCATION_COOKIE}=; path=/; max-age=0; samesite=lax`;
        }
        // Hard reload so every server-fetched section re-renders with the
        // new location filter (RSC cache invalidation is unreliable).
        window.location.reload();
    };

    const isDark = variant === "dark";
    const triggerCls = isDark
        ? "border-white/20 bg-white/5 text-white/85 hover:text-white"
        : "border-saigon-black/15 bg-white text-saigon-base hover:border-saigon-base";

    return (
        <div className="relative" ref={ref}>
            <button
                aria-expanded={open}
                aria-haspopup="listbox"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-[6px] font-body text-[12px] font-medium transition-colors md:text-[13px] ${triggerCls}`}
                onClick={() => setOpen((v) => !v)}
                type="button"
            >
                <MapPin className="h-[14px] w-[14px]" />
                <span className="max-w-[110px] truncate md:max-w-[160px]">
                    {label}
                </span>
                <ChevronDown
                    className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-saigon-black/10 bg-white text-saigon-base shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: -4 }}
                        role="listbox"
                        transition={{ duration: 0.15 }}
                    >
                        <button
                            className={`flex w-full items-start gap-2 px-3.5 py-2.5 text-left text-[13px] transition-colors hover:bg-saigon-bg-warm ${current === null ? "bg-saigon-bg-soft font-semibold" : ""}`}
                            onClick={() => pickLocation(null)}
                            role="option"
                            aria-selected={current === null}
                            type="button"
                        >
                            <span className="font-body">Tất cả cửa hàng</span>
                        </button>
                        <div className="h-px bg-saigon-black/10" />
                        {locations.map((loc) => {
                            const isActive = String(loc.id) === current;
                            return (
                                <button
                                    className={`flex w-full flex-col items-start gap-0.5 px-3.5 py-2.5 text-left transition-colors hover:bg-saigon-bg-warm ${isActive ? "bg-saigon-bg-soft font-semibold" : ""}`}
                                    key={loc.id}
                                    onClick={() => pickLocation(String(loc.id))}
                                    role="option"
                                    aria-selected={isActive}
                                    type="button"
                                >
                                    <span className="font-body text-[13px]">
                                        {loc.name}
                                    </span>
                                    {loc.address && (
                                        <span className="line-clamp-1 font-body text-[11px] text-saigon-grey">
                                            {loc.address}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
