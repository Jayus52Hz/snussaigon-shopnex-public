import type { Metadata } from "next";

import OrderDetailsTemplate from "@/templates/order-details";
import { payloadSdk } from "@/utils/payload-sdk";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const orderId = params.id;

    if (!orderId) {
        notFound();
    }

    return {
        description: "View your order",
        title: `Order #${orderId}`,
    };
}

export default async function OrderDetailPage(props: Props) {
    const params = await props.params;
    const orderId = params.id;

    const order = await payloadSdk.findByID({
        id: orderId,
        collection: "orders",
    });

    if (!order) {
        notFound();
    }

    return <OrderDetailsTemplate order={order} />;
}
