import type { Metadata } from "next";

import Divider from "@/components/divider";
import OrderOverview from "@/components/order-overview";
import { getOrders } from "@/services/orders";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    description: "Overview of your previous orders.",
    title: "Orders",
};

export default async function Orders() {
    const orders = await getOrders();

    if (!orders.length) {
        notFound();
    }

    return (
        <div className="w-full" data-testid="orders-page-wrapper">
            <div className="mb-8 flex flex-col gap-y-4">
                <h1 className="text-2xl-semi">Orders</h1>
                <p className="text-base-regular">
                    View your previous orders and their status. You can also
                    create returns or exchanges for your orders if needed.
                </p>
            </div>
            <div>
                <OrderOverview orders={orders} />
                <Divider className="my-16" />
            </div>
        </div>
    );
}
