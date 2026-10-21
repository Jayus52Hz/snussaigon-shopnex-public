import type { Order } from "@shopnex/types";

import { convertToLocale } from "@/utils/money";
import { Container, Heading, Text } from "@medusajs/ui";

import Divider from "../../divider";
import CreditCard from "../../icons/credit-card";

type PaymentDetailsProps = {
    order: Order;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
    return (
        <div>
            <Heading className="flex flex-row text-3xl-regular my-6" level="h2">
                Payment
            </Heading>
            <div>
                <div className="flex items-start gap-x-1 w-full">
                    <div className="flex flex-col w-1/3">
                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                            Payment method
                        </Text>
                        <Text
                            className="txt-medium text-ui-fg-subtle"
                            data-testid="payment-method"
                        >
                            {order.paymentMethod === "card"
                                ? "Credit Card"
                                : order.paymentMethod}
                        </Text>
                    </div>
                    <div className="flex flex-col w-2/3">
                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                            Payment details
                        </Text>
                        <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center mt-2">
                            <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                                <CreditCard />
                            </Container>
                            <Text data-testid="payment-amount">
                                {convertToLocale({
                                    amount: order.totalAmount,
                                    currency_code: order.currency,
                                })}{" "}
                                paid at{" "}
                                {new Date(
                                    order.createdAt ?? ""
                                ).toLocaleString()}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            <Divider className="mt-8" />
        </div>
    );
};

export default PaymentDetails;
