"use client";

import type { Order, User } from "@shopnex/types";

import { useAuth } from "@/providers/auth";
import { convertToLocale } from "@/utils/money";
import { Container } from "@medusajs/ui";
import Link from "next/link";

import ChevronDown from "./icons/chevron-down";

type OverviewProps = {
    orders: null | Order[];
};

const Overview = ({ orders }: OverviewProps) => {
    const { user: customer } = useAuth();
    return (
        <div data-testid="overview-page-wrapper">
            <div className="hidden small:block">
                <div className="text-xl-semi flex justify-between items-center mb-4">
                    <span
                        data-testid="welcome-message"
                        data-value={(customer as any)?.firstName}
                    >
                        Hello {(customer as any)?.firstName}
                    </span>
                    <span className="text-small-regular text-ui-fg-base">
                        Signed in as:{" "}
                        <span
                            className="font-semibold"
                            data-testid="customer-email"
                            data-value={customer?.email}
                        >
                            {customer?.email}
                        </span>
                    </span>
                </div>
                <div className="flex flex-col py-8 border-t border-gray-200">
                    <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
                        <div className="flex items-start gap-x-16 mb-6">
                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-large-semi">Profile</h3>
                                <div className="flex items-end gap-x-2">
                                    <span
                                        className="text-3xl-semi leading-none"
                                        data-testid="customer-profile-completion"
                                        data-value={getProfileCompletion(
                                            customer
                                        )}
                                    >
                                        {getProfileCompletion(customer)}%
                                    </span>
                                    <span className="uppercase text-base-regular text-ui-fg-subtle">
                                        Completed
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-large-semi">Addresses</h3>
                                <div className="flex items-end gap-x-2">
                                    {/* <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span> */}
                                    <span className="uppercase text-base-regular text-ui-fg-subtle">
                                        Saved
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-4">
                            <div className="flex items-center gap-x-2">
                                <h3 className="text-large-semi">
                                    Recent orders
                                </h3>
                            </div>
                            <ul
                                className="flex flex-col gap-y-4"
                                data-testid="orders-wrapper"
                            >
                                {orders && orders.length > 0 ? (
                                    orders.slice(0, 5).map((order) => {
                                        return (
                                            <li
                                                data-testid="order-wrapper"
                                                data-value={order.id}
                                                key={order.id}
                                            >
                                                <Link
                                                    href={`/account/orders/details/${order.id}`}
                                                >
                                                    <Container className="bg-gray-50 flex justify-between items-center p-4">
                                                        <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                                                            <span className="font-semibold">
                                                                Date placed
                                                            </span>
                                                            <span className="font-semibold">
                                                                Order number
                                                            </span>
                                                            <span className="font-semibold">
                                                                Total amount
                                                            </span>
                                                            <span data-testid="order-created-date">
                                                                {new Date(
                                                                    order.createdAt
                                                                ).toDateString()}
                                                            </span>
                                                            <span
                                                                data-testid="order-id"
                                                                data-value={
                                                                    order.orderId
                                                                }
                                                            >
                                                                #{order.orderId}
                                                            </span>
                                                            <span data-testid="order-amount">
                                                                {convertToLocale(
                                                                    {
                                                                        amount: order.totalAmount,
                                                                        currency_code:
                                                                            order.currency,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="flex items-center justify-between"
                                                            data-testid="open-order-button"
                                                            type="button"
                                                        >
                                                            <span className="sr-only">
                                                                Go to order #
                                                                {order.orderId}
                                                            </span>
                                                            <ChevronDown className="-rotate-90" />
                                                        </button>
                                                    </Container>
                                                </Link>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <span data-testid="no-orders-message">
                                        No recent orders
                                    </span>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getProfileCompletion = (customer: null | User) => {
    let count = 0;

    if (!customer) {
        return 0;
    }

    if (customer.email) {
        count++;
    }

    if ((customer as any).firstName && (customer as any).lastName) {
        count++;
    }

    // if (customer.phone) {
    //     count++;
    // }

    // const billingAddress = customer.addresses?.find(
    //     (addr: any) => addr.is_default_billing
    // );

    // if (billingAddress) {
    //     count++;
    // }

    return (count / 4) * 100;
};

export default Overview;
