"use client";

import StickyAddToCart from "@/components/sticky-add-to-cart";
import { usePathname } from "next/navigation";

export default function StickyContactWrapper() {
    const pathname = usePathname();
    // Hide on cart page and checkout pages
    if (pathname === "/cart" || pathname === "/en/cart" || pathname.startsWith("/checkout") || pathname.startsWith("/en/checkout")) {
        return null;
    }
    return <StickyAddToCart />;
}
