"use client";

import type { SelectHTMLAttributes } from "react";

import { ChevronDown } from "@medusajs/icons";
import { clx, IconBadge } from "@medusajs/ui";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

type NativeSelectProps = {
    errors?: Record<string, unknown>;
    placeholder?: string;
    touched?: Record<string, unknown>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">;

const CartItemSelect = ({
    children,
    className,
    placeholder = "Select...",
    ref,
    ...props
}: { ref?: React.RefObject<HTMLSelectElement | null> } & NativeSelectProps) => {
    const innerRef = useRef<HTMLSelectElement>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
        ref,
        () => innerRef.current
    );

    useEffect(() => {
        if (innerRef.current && innerRef.current.value === "") {
            setIsPlaceholder(true);
        } else {
            setIsPlaceholder(false);
        }
    }, [innerRef.current?.value]);

    return (
        <div>
            <IconBadge
                className={clx(
                    "relative flex items-center txt-compact-small border text-ui-fg-base group",
                    className,
                    {
                        "text-ui-fg-subtle": isPlaceholder,
                    }
                )}
                onBlur={() => innerRef.current?.blur()}
                onFocus={() => innerRef.current?.focus()}
            >
                <select
                    ref={innerRef}
                    {...props}
                    className="appearance-none bg-transparent border-none px-4 transition-colors duration-150 focus:border-gray-700 outline-none w-16 h-16 items-center justify-center"
                >
                    <option disabled value="">
                        {placeholder}
                    </option>
                    {children}
                </select>
                <span className="absolute flex pointer-events-none justify-end w-8 group-hover:animate-pulse">
                    <ChevronDown />
                </span>
            </IconBadge>
        </div>
    );
};

CartItemSelect.displayName = "CartItemSelect";

export default CartItemSelect;
