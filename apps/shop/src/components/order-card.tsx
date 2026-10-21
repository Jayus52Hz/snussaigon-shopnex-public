import type { Order } from "@shopnex/types";

import { getVariantImage } from "@/utils/get-variant-image";
import { isExpandedDoc } from "@/utils/is-expanded-doc";
import { convertToLocale } from "@/utils/money";
import { Button } from "@medusajs/ui";
import Link from "next/link";
import { useMemo } from "react";

import Thumbnail from "./thumbnail";

type OrderCardProps = {
    order: Order;
};

const OrderCard = ({ order }: OrderCardProps) => {
    const numberOfLines = useMemo(() => {
        if (typeof order.cart !== "object") {
            return null;
        }
        return (
            order.cart?.cartItems?.reduce((acc: any, item: any) => {
                return acc + item.quantity;
            }, 0) ?? 0
        );
    }, [order]);

    const numberOfProducts = useMemo(() => {
        if (typeof order.cart !== "object") {
            return 0;
        }
        return order.cart?.cartItems?.length ?? 0;
    }, [order]);
    if (typeof order.cart !== "object") {
        return null;
    }

    return (
        <div className="bg-white flex flex-col" data-testid="order-card">
            <div className="uppercase text-large-semi mb-1">
                #<span data-testid="order-display-id">{order.orderId}</span>
            </div>
            <div className="flex items-center divide-x divide-gray-200 text-small-regular text-ui-fg-base">
                <span className="pr-2" data-testid="order-created-at">
                    {new Date(order.createdAt).toDateString()}
                </span>
                <span className="px-2" data-testid="order-amount">
                    {convertToLocale({
                        amount: order.totalAmount,
                        currency_code: order.currency,
                    })}
                </span>
                <span className="pl-2">{`${numberOfLines} ${
                    numberOfLines > 1 ? "items" : "item"
                }`}</span>
            </div>
            <div className="grid grid-cols-2 small:grid-cols-4 gap-4 my-4">
                {order.cart?.cartItems?.slice(0, 3).map((i: any) => {
                    return (
                        <div
                            className="flex flex-col gap-y-2"
                            data-testid="order-item"
                            key={i.id}
                        >
                            <Thumbnail
                                size="full"
                                thumbnail={getVariantImage(
                                    i.product?.variants[0]
                                )}
                            />
                            <div className="flex items-center text-small-regular text-ui-fg-base">
                                <span
                                    className="text-ui-fg-base font-semibold"
                                    data-testid="item-title"
                                >
                                    {i.title}
                                </span>
                                <span className="ml-2">x</span>
                                <span data-testid="item-quantity">
                                    {i.quantity}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {numberOfProducts > 4 && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-small-regular text-ui-fg-base">
                            + {numberOfLines - 4}
                        </span>
                        <span className="text-small-regular text-ui-fg-base">
                            more
                        </span>
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <Link href={`/account/orders/details/${order.id}`}>
                    <Button
                        data-testid="order-details-link"
                        variant="secondary"
                    >
                        See details
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderCard;
