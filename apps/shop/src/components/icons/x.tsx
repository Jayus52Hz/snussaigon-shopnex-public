import type { IconProps } from "@/types/icon";

import React from "react";

const X: React.FC<IconProps> = ({
    color = "currentColor",
    size = "20",
    ...attributes
}) => {
    return (
        <svg
            fill="none"
            height={size}
            viewBox="0 0 20 20"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
            {...attributes}
        >
            <path
                d="M15 5L5 15"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            />
            <path
                d="M5 5L15 15"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            />
        </svg>
    );
};

export default X;
