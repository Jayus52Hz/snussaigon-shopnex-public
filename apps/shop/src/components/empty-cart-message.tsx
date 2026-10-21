"use client";

import { Heading, Text } from "@medusajs/ui";
import { useLocale } from "@/i18n/locale-provider";

import InteractiveLink from "./interactive-link";

const EmptyCartMessage = () => {
    const { locale } = useLocale();
    const shopPath = locale === "en" ? "/en/snus" : "/snus";

    return (
        <div
            className="py-48 px-2 flex flex-col justify-center items-start"
            data-testid="empty-cart-message"
        >
            <Heading
                className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
                level="h1"
            >
                Giỏ Hàng
            </Heading>
            <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
                Giỏ hàng của bạn đang trống. Sử dụng liên kết bên dưới để khám
                phá sản phẩm của chúng tôi.
            </Text>
            <div>
                <InteractiveLink href={shopPath}>
                    Khám phá sản phẩm
                </InteractiveLink>
            </div>
        </div>
    );
};

export default EmptyCartMessage;
