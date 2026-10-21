"use client";

import type { Order } from "@shopnex/types";
import type React from "react";

import Help from "@/components/help";
import Items from "@/components/order/items/items";
import OrderDetails from "@/components/order/order-details/order-details";
import OrderSummary from "@/components/order/order-summary/order-summary";
import ShippingDetails from "@/components/order/shipping-details/shipping-details";
import { XMark } from "@medusajs/icons";
import Link from "next/link";

type OrderDetailsTemplateProps = {
    order: Order;
};

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
    order,
}) => {
    return (
        <div className="flex flex-col justify-center gap-y-4">
            <div className="flex gap-2 justify-between items-center">
                <h1 className="text-2xl-semi">Order details</h1>
                <Link
                    className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
                    data-testid="back-to-overview-button"
                    href="/account/orders"
                >
                    <XMark /> Back to overview
                </Link>
            </div>
            <div
                className="flex flex-col gap-4 h-full bg-white w-full"
                data-testid="order-details-container"
            >
                <OrderDetails order={order} showStatus />
                <Items order={order} />
                <ShippingDetails order={order} />
                <OrderSummary order={order} />
                <Help />
            </div>
        </div>
    );
};

export default OrderDetailsTemplate;
