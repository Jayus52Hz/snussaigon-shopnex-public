import type React from "react";

import { clx, Container } from "@medusajs/ui";
import Image from "next/image";

import PlaceholderImage from "./placeholder-image";

type ThumbnailProps = {
    className?: string;
    "data-testid"?: string;
    // TODO: Fix image typings
    isFeatured?: boolean;
    size?: "full" | "large" | "medium" | "small" | "square";
    thumbnail?: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
    className,
    "data-testid": dataTestid,
    isFeatured,
    size = "small",
    thumbnail,
}) => {
    return (
        <Container
            className={clx(
                "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
                className,
                {
                    "aspect-[1/1]": size === "square",
                    "aspect-[9/16]": !isFeatured && size !== "square",
                    "aspect-[11/14]": isFeatured,
                    "w-[180px]": size === "small",
                    "w-[290px]": size === "medium",
                    "w-[440px]": size === "large",
                    "w-full": size === "full",
                }
            )}
            data-testid={dataTestid}
        >
            <ImageOrPlaceholder image={thumbnail} size={size} />
        </Container>
    );
};

const ImageOrPlaceholder = ({
    image,
    size,
}: { image?: string } & Pick<ThumbnailProps, "size">) => {
    return image ? (
        <img
            alt="Product image"
            className="absolute inset-0 rounded-rounded object-cover h-full"
            decoding="async"
            loading="lazy"
            src={image}
        />
    ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
            <PlaceholderImage size={size === "small" ? 16 : 24} />
        </div>
    );
};

export default Thumbnail;
