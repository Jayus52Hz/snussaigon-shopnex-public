import { convertToLocale } from "@/utils/money";
import { clx } from "@medusajs/ui";

type LineItemUnitPriceProps = {
    currencyCode: string;
    item: any;
    style?: "default" | "tight";
};

const LineItemUnitPrice = ({ currencyCode, item }: LineItemUnitPriceProps) => {
    return (
        <div className="flex flex-col text-ui-fg-muted justify-center h-full">
            <span
                className={clx("text-base-regular")}
                data-testid="product-unit-price"
            >
                {convertToLocale({
                    amount: item.price,
                    currency_code: currencyCode,
                })}
            </span>
        </div>
    );
};

export default LineItemUnitPrice;
