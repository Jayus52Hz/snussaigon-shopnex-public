"use client";

import { usePathname } from "next/navigation";

export default function SaigonMainWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isHome = pathname === "/" || pathname === "/en";
    return <div className={isHome ? "" : "pt-14"}>{children}</div>;
}
