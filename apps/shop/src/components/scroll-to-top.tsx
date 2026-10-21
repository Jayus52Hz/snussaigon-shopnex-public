"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            aria-label="Lên đầu trang"
            className="fixed bottom-20 md:bottom-6 right-4 z-40 p-2 bg-ui-fg-base text-white rounded-full shadow-lg hover:bg-ui-fg-subtle transition-colors"
            onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
            type="button"
        >
            <ChevronUp className="w-5 h-5" />
        </button>
    );
}
