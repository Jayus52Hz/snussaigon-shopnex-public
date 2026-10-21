import type { Order } from "@shopnex/types";

import { convertToLocale } from "@/utils/money";
import { Heading, Text } from "@medusajs/ui";

import Divider from "../../divider";

type ShippingDetailsProps = {
    order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
    return (
        <div>
            <Heading className="flex flex-row text-3xl-regular my-6" level="h2">
                Delivery
            </Heading>
            <div className="flex items-start gap-x-8">
                <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                        Shipping Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {order.shippingAddress?.name}{" "}
                        {/* {order.shippingAddress?.last_name} */}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {order.shippingAddress?.address?.line1}{" "}
                        {order.shippingAddress?.address?.line2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {order.shippingAddress?.address?.postal_code},{" "}
                        {order.shippingAddress?.address?.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {order.shippingAddress?.address?.country?.toUpperCase()}
                    </Text>
                </div>

                <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                        Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {order.shippingAddress?.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {typeof order?.user === "object" && order.user?.email}
                    </Text>
                </div>

                <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-method-summary"
                >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                        Method
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                        {(order as any).shippingMethod?.name || "FedEx"} (
                        {convertToLocale({
                            amount: order.totalAmount ?? 0,
                            currency_code: order.currency,
                        })
                            .replace(/,/g, "")
                            .replace(/\./g, ",")}
                        )
                    </Text>
                </div>
            </div>
            <Divider className="mt-8" />
        </div>
    );
};

export default ShippingDetails;
