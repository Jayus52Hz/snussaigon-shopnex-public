import type { Metadata } from "next";

import { getOrder } from "@/services/orders";
import OrderCompletedTemplate from "@/templates/order-completed-template";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};
export const metadata: Metadata = {
    description: "You purchase was successful",
    title: "Order Confirmed",
};

export default async function OrderConfirmedPage(props: Props) {
    const params = await props.params;
    const order = await getOrder(params.id);

    if (!order) {
        return notFound();
    }

    return <OrderCompletedTemplate order={order} />;
}
