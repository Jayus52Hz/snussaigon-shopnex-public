import type React from "react";

import { clx } from "@medusajs/ui";

type BadgeProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "hot" | "new" | "sale";
};

const variantLabels: Record<string, string> = {
    default: "",
    hot: "Bán Chạy",
    new: "Mới",
    sale: "Giảm Giá",
};

const variantStyles: Record<string, string> = {
    default: "bg-ui-bg-subtle text-ui-fg-subtle",
    hot: "bg-red-500 text-white",
    new: "bg-green-500 text-white",
    sale: "bg-amber-500 text-white",
};

export default function Badge({ children, className, variant = "default" }: BadgeProps) {
    return (
        <span
            className={clx(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                variantStyles[variant],
                className
            )}
        >
            {children || variantLabels[variant]}
        </span>
    );
}
