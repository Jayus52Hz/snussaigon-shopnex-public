"use client";

import { Button } from "@medusajs/ui";
import React from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
    children,
    className,
    "data-testid": dataTestId,
    variant = "primary",
}: {
    children: React.ReactNode;
    className?: string;
    "data-testid"?: string;
    variant?: "danger" | "primary" | "secondary" | "transparent" | null;
}) {
    const { pending } = useFormStatus();

    return (
        <Button
            className={className}
            data-testid={dataTestId}
            isLoading={pending}
            size="large"
            type="submit"
            variant={variant || "primary"}
        >
            {children}
        </Button>
    );
}
