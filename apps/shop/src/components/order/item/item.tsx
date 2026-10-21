import { Table, Text } from "@medusajs/ui";

import LineItemOptions from "../../line-item-options";
import LineItemPrice from "../../line-item-price";
import LineItemUnitPrice from "../../line-item-unit-price";
import Thumbnail from "../../thumbnail";

type ItemProps = {
    currencyCode: string;
    item: {
        gallery: { url: string }[];
        id?: null | string;
        options?: { option: string; value: string }[];
        price: number;
        productName: string;
        quantity: number;
    };
};

const Item = ({ currencyCode, item }: ItemProps) => {
    return (
        <Table.Row className="w-full" data-testid="product-row">
            <Table.Cell className="!pl-0 p-4 w-24">
                <div className="flex w-16">
                    <Thumbnail
                        size="square"
                        thumbnail={item?.gallery?.[0]?.url}
                    />
                </div>
            </Table.Cell>

            <Table.Cell className="text-left">
                <Text
                    className="txt-medium-plus text-ui-fg-base"
                    data-testid="product-name"
                >
                    {item.productName}
                </Text>
                <LineItemOptions
                    data-testid="product-variant"
                    variant={{
                        options: item.options,
                        title: item.productName,
                    }}
                />
            </Table.Cell>

            <Table.Cell className="!pr-0">
                <span className="!pr-0 flex flex-col items-end h-full justify-center">
                    <span className="flex gap-x-1 items-center">
                        <Text className="text-ui-fg-muted">
                            <span data-testid="product-quantity">
                                {item.quantity}
                            </span>
                            x{" "}
                        </Text>
                        <LineItemUnitPrice
                            currencyCode={currencyCode}
                            item={item}
                            style="tight"
                        />
                    </span>

                    <LineItemPrice
                        cartTotal={item.price * item.quantity}
                        currencyCode={currencyCode}
                        style="tight"
                    />
                </span>
            </Table.Cell>
        </Table.Row>
    );
};

export default Item;
