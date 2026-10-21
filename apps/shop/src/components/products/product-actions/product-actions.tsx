"use client";

import type { Product } from "@shopnex/types";

import { useLocale } from "@/i18n/locale-provider";
import { syncCartWithBackend } from "@/services/cart";
import { gtmAddToCart } from "@/components/gtm";
import { Button } from "@medusajs/ui";
import Cookies from "js-cookie";
import { useMemo, useState } from "react";
import { useCart } from "react-use-cart";

import Divider from "../../divider";
import ProductPrice from "../product-price/product-price";
import OptionSelect from "./option-select";

type ProductActionsProps = {
    product: Product;
    selectedOptions: Record<string, string>;
    setSelectedOptions: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;
};

export default function ProductActions({
    product,
    selectedOptions,
    setSelectedOptions,
}: ProductActionsProps) {
    const { dict, locale } = useLocale();
    const [isAdding, setIsAdding] = useState(false);
    const { addItem, removeItem } = useCart();

    const options = useMemo(() => {
        const optionsMap = new Map();

        for (const { options } of product.variants || []) {
            for (const { option, value } of options || []) {
                if (!optionsMap.has(option)) {
                    optionsMap.set(option, new Set());
                }
                optionsMap.get(option).add(value);
            }
        }

        return Array.from(optionsMap.entries()).map(([option, values]) => ({
            name: option,
            values: Array.from(values),
        }));
    }, [product.variants]) as Array<{
        name: string;
        values: string[];
    }>;

    const allOptionsSelected = useMemo(() => {
        return options.every(({ name }) => selectedOptions[name]);
    }, [options, selectedOptions]);

    const handleAddToCart = async () => {
        setIsAdding(true);

        const selectedVariant = findSelectedVariant();

        if (!selectedVariant?.id) {
            setIsAdding(false);
            return;
        }

        const newItem = buildCartItem(selectedVariant);

        // Optimistic UI update

        try {
            addItem(newItem, 1);
            // GA4 add_to_cart event
            gtmAddToCart({
                id: newItem.productId,
                name: newItem.productName,
                price: newItem.price,
                quantity: 1,
                currency: newItem.currency || "VND",
            });
            const sessionId = getSessionId();
            await syncCartWithBackend(
                {
                    id: newItem.id,
                    product: newItem.productId,
                    quantity: 1,
                    variantId: newItem.id,
                },
                sessionId
            );
        } catch (error) {
            removeItem(newItem.id);
            console.error("Failed to sync cart:", error);
        } finally {
            setIsAdding(false);
        }
    };

    const findSelectedVariant = () => {
        return product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        );
    };

    const buildCartItem = (variant: Product["variants"][0]) => {
        const p = product as any;
        const v = variant as any;

        // Gallery: variant gallery → product gallery → first variant gallery
        const gallery =
            v.gallery?.length ? v.gallery :
            p.gallery?.length ? p.gallery :
            p.variants?.[0]?.gallery || [];

        // Extract thumbnail URL — try every possible source
        const extractUrl = (arr: any[]) => {
            if (!Array.isArray(arr) || !arr.length) return null;
            const item = arr[0];
            return typeof item === 'object' ? (item?.url || item?.thumbnailURL || null) : null;
        };

        const thumbnail =
            p.thumbnail ||                      // set by localizeProduct
            extractUrl(gallery) ||              // gallery[0].url
            extractUrl(p.gallery) ||            // product top-level gallery
            extractUrl(v.gallery) ||            // variant gallery
            null;

        return {
            ...variant,
            id: `${variant.id}`,
            currency: p.currency,
            gallery,
            thumbnail,
            handle: p.handle,
            productId: p.id,
            productName: p.title,
        };
    };

    const getSessionId = () => {
        return Cookies.get("cart-session") || "";
    };

    const selectedVariant =
        product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        ) || product.variants[0];

    const isNotForSale = (product as any).notForSale === true;
    // Hết hàng: cờ inStock của sản phẩm tắt HOẶC tồn kho variant đang chọn = 0
    const isOutOfStock =
        (product as any).inStock === false || selectedVariant?.stockCount === 0;

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-4">
                {options.map(({ name, values }) => (
                    <OptionSelect
                        data-testid="product-options"
                        key={name}
                        optionName={name}
                        options={selectedOptions[name]}
                        optionValue={values}
                        title={name}
                        updateOption={(option, value) => {
                            setSelectedOptions((prev) => ({
                                ...prev,
                                [option]: value,
                            }));
                        }}
                    />
                ))}
                <Divider />
            </div>

            <Button
                className="w-full h-10"
                data-testid="add-product-button"
                disabled={isAdding || !allOptionsSelected || isOutOfStock || isNotForSale}
                id="product-add-to-cart-btn"
                isLoading={isAdding}
                onClick={handleAddToCart}
                variant="primary"
            >
                {isNotForSale
                    ? dict.common.notForSale
                    : !allOptionsSelected
                    ? (locale === "en" ? "Select option" : "Chọn phiên bản")
                    : isOutOfStock
                      ? dict.common.soldOut
                      : dict.product.addToCart}
            </Button>
        </div>
    );
}
