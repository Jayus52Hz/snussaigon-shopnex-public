import { convertToLocale } from "@/utils/money";
import { clx, Text } from "@medusajs/ui";

export default function PreviewPrice({
    currency,
    originalPrice,
    price,
}: {
    currency?: string;
    originalPrice?: any;
    price: any;
}) {
    return (
        <>
            {originalPrice && (
                <Text
                    className="line-through text-ui-fg-muted"
                    data-testid="original-price"
                >
                    {convertToLocale({
                        amount: originalPrice,
                        currency_code: currency || "USD",
                    })}
                </Text>
            )}
            <Text
                className={clx("text-ui-fg-muted", {
                    "text-ui-fg-interactive": originalPrice,
                })}
                data-testid="price"
            >
                {convertToLocale({
                    amount: price,
                    currency_code: currency || "USD",
                })}
            </Text>
        </>
    );
}
