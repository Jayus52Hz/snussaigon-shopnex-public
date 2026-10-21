"use client";

import type { GiftCard } from "@shopnex/types";
import type React from "react";

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui";
import { useState } from "react";

import ErrorMessage from "./error-message";
import Trash from "./icons/trash";
import { SubmitButton } from "./submit-button";

type DiscountCodeProps = {
    applyPromotion: (code: string) => Promise<void>;
    cart: any;
    promotions: GiftCard[];
    setPromotions: (promotions: GiftCard[]) => void;
};

export const DiscountCode: React.FC<DiscountCodeProps> = ({
    applyPromotion,
    cart,
    promotions,
    setPromotions,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>(null);

    const removePromotionCode = (code: string) => {
        try {
            const updatedPromotions = promotions.filter(
                (promo) => promo.code !== code
            );
            setPromotions(updatedPromotions);
        } catch (error) {
            setErrorMessage("Failed to remove promotion code.");
            console.error("Error:", error);
        }
    };

    const addPromotionCode = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const code = formData.get("code") as string;

        if (!code.trim()) {
            return;
        }

        try {
            await applyPromotion(code);
            setErrorMessage(null);
        } catch (err) {
            setErrorMessage("Failed to add promotion code.");
        }
    };

    return (
        <div className="w-full bg-white flex flex-col">
            <div className="txt-medium">
                <form className="w-full mb-5" onSubmit={addPromotionCode}>
                    <Label className="flex gap-x-1 my-2 items-center">
                        <button
                            className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                            data-testid="add-discount-button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            type="button"
                        >
                            Add Promotion Code(s)
                        </button>
                    </Label>

                    {isOpen && (
                        <div className="flex w-full gap-x-2">
                            <Input
                                className="size-full"
                                data-testid="discount-input"
                                id="promotion-input"
                                name="code"
                                type="text"
                            />
                            <SubmitButton
                                data-testid="discount-apply-button"
                                variant="secondary"
                            >
                                Apply
                            </SubmitButton>
                        </div>
                    )}

                    {errorMessage && (
                        <ErrorMessage
                            data-testid="discount-error-message"
                            error={errorMessage}
                        />
                    )}
                </form>

                {promotions?.length > 0 && (
                    <div className="w-full flex flex-col">
                        <Heading className="txt-medium mb-2">
                            Promotion(s) applied:
                        </Heading>

                        {promotions.map((promo) => (
                            <div
                                className="flex items-center justify-between w-full max-w-full mb-2"
                                data-testid="discount-row"
                                key={promo.id}
                            >
                                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                                    <Badge color={"grey"} size="small">
                                        {promo.code}
                                    </Badge>
                                    ({promo.value})
                                </Text>

                                <button
                                    className="flex items-center"
                                    data-testid="remove-discount-button"
                                    onClick={() =>
                                        removePromotionCode(promo.code)
                                    }
                                    type="button"
                                >
                                    <Trash size={14} />
                                    <span className="sr-only">
                                        Remove discount code
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
