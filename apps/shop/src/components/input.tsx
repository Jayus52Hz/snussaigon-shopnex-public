import { Label } from "@medusajs/ui";
import React, { useEffect, useImperativeHandle, useState } from "react";

import Eye from "./icons/eye";
import EyeOff from "./icons/eye-off";

type InputProps = {
    errors?: Record<string, unknown>;
    label: string;
    name: string;
    topLabel?: string;
    touched?: Record<string, unknown>;
} & Omit<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    "placeholder"
>;

const Input = ({
    name,
    type,
    label,
    ref,
    required,
    topLabel,
    touched,
    ...props
}: { ref?: React.RefObject<HTMLInputElement | null> } & InputProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    useEffect(() => {
        if (type === "password" && showPassword) {
            setInputType("text");
        }

        if (type === "password" && !showPassword) {
            setInputType("password");
        }
    }, [type, showPassword]);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
        <div className="flex flex-col w-full">
            {topLabel && (
                <Label className="mb-2 txt-compact-medium-plus">
                    {topLabel}
                </Label>
            )}
            <div className="flex relative z-0 w-full txt-compact-medium">
                <input
                    className="pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
                    id={name}
                    name={name}
                    placeholder=" "
                    required={required}
                    type={inputType}
                    {...props}
                    ref={inputRef}
                />

                <label
                    className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 z-1 origin-0 text-ui-fg-subtle"
                    htmlFor={name}
                >
                    {label}
                    {required && <span className="text-rose-500">*</span>}
                </label>
                {type === "password" && (
                    <button
                        className="text-ui-fg-subtle px-4 focus:outline-none transition-all duration-150 outline-none focus:text-ui-fg-base absolute right-0 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                    >
                        {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                )}
            </div>
        </div>
    );
};

Input.displayName = "Input";

export default Input;
