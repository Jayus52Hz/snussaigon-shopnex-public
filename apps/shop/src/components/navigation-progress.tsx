"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thanh loading mảnh ở đỉnh trang (kiểu YouTube/GitHub).
 *
 * Bắt sự kiện click vào link nội bộ → chạy thanh ngay lập tức để user thấy
 * phản hồi tức thì, rồi hoàn tất khi route thật sự đổi (pathname/search thay
 * đổi). Không phụ thuộc thư viện ngoài.
 *
 * `useSearchParams` cần Suspense boundary khi static render → default export
 * bọc sẵn Suspense để tránh bailout toàn trang.
 */
function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    const activeRef = useRef(false);
    const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Bỏ qua lần chạy đầu (mount) để không hoàn tất một nav không tồn tại.
    const routeKeyRef = useRef<string | null>(null);

    const clearTimers = () => {
        if (trickleRef.current) clearInterval(trickleRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        trickleRef.current = null;
        timeoutRef.current = null;
    };

    const start = () => {
        if (activeRef.current) return;
        activeRef.current = true;
        if (doneRef.current) clearTimeout(doneRef.current);
        setVisible(true);
        setProgress(8);
        // Trickle tiến dần tới ~90% trong lúc chờ route mới.
        trickleRef.current = setInterval(() => {
            setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
        }, 200);
        // An toàn: tự hoàn tất nếu điều hướng treo quá lâu.
        timeoutRef.current = setTimeout(() => complete(), 10000);
    };

    const complete = () => {
        if (!activeRef.current) return;
        activeRef.current = false;
        clearTimers();
        setProgress(100);
        doneRef.current = setTimeout(() => {
            setVisible(false);
            setProgress(0);
        }, 250);
    };

    // Bắt click vào link nội bộ (capture để chạy trước điều hướng).
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            ) {
                return;
            }
            const anchor = (e.target as Element | null)?.closest("a");
            if (!anchor) return;
            const href = anchor.getAttribute("href");
            if (!href) return;
            if (anchor.target && anchor.target !== "_self") return;
            if (anchor.hasAttribute("download")) return;

            let dest: URL;
            try {
                dest = new URL(href, window.location.href);
            } catch {
                return;
            }
            if (dest.origin !== window.location.origin) return;
            // Cùng trang (chỉ khác hash / y hệt) → không chạy.
            if (
                dest.pathname === window.location.pathname &&
                dest.search === window.location.search
            ) {
                return;
            }
            start();
        };
        document.addEventListener("click", onClick, { capture: true });
        return () =>
            document.removeEventListener("click", onClick, { capture: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Route đổi thật sự → hoàn tất thanh.
    useEffect(() => {
        const key = `${pathname}?${searchParams?.toString() ?? ""}`;
        if (routeKeyRef.current === null) {
            routeKeyRef.current = key; // mount đầu tiên
            return;
        }
        if (routeKeyRef.current !== key) {
            routeKeyRef.current = key;
            complete();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    useEffect(() => () => clearTimers(), []);

    if (!visible) return null;

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
        >
            <div
                className="h-full bg-saigon-red shadow-[0_0_10px_rgba(214,61,30,0.7)] transition-[width,opacity] duration-200 ease-out"
                style={{
                    width: `${progress}%`,
                    opacity: progress >= 100 ? 0 : 1,
                }}
            />
        </div>
    );
}

export default function NavigationProgress() {
    return (
        <Suspense fallback={null}>
            <ProgressBar />
        </Suspense>
    );
}
