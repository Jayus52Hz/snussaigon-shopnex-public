import type { Product } from "@shopnex/types";

export const getVariantImage = (variant: Product["variants"][0]) => {
    const imageUrl =
        typeof variant.gallery?.[0] === "object"
            ? variant.gallery?.[0]?.url
            : undefined;

    if (imageUrl === null) {return;}
    return imageUrl;
};
