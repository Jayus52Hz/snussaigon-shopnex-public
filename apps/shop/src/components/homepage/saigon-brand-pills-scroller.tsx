"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

/**
 * Khung cuộn ngang 2 hàng cho pill thương hiệu.
 * Mobile: vuốt ngang. Desktop (md+): thêm nút ← → cuộn theo bề rộng khung,
 * nút tự mờ khi đã tới đầu / cuối.
 */
export default function SaigonBrandPillsScroller({
    children,
    labels,
}: {
    children: ReactNode;
    labels: { prev: string; next: string };
}) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        update();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            el.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [update]);

    const scrollBy = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
    };

    const btn =
        "hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-saigon-base bg-white text-saigon-base transition-opacity hover:bg-saigon-base hover:text-white disabled:pointer-events-none disabled:opacity-30 md:flex";

    return (
        <div className="flex items-center gap-3">
            <button aria-label={labels.prev} className={btn} disabled={!canPrev} onClick={() => scrollBy(-1)} type="button">
                <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <div
                className="no-scrollbar -mx-1 grid min-w-0 flex-1 auto-cols-max grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-smooth px-1 pb-1"
                ref={trackRef}
            >
                {children}
            </div>
            <button aria-label={labels.next} className={btn} disabled={!canNext} onClick={() => scrollBy(1)} type="button">
                <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
        </div>
    );
}
