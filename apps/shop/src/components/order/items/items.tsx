import type { Cart, Order, Product  } from "@shopnex/types";

import { isExpandedDoc } from "@/utils/is-expanded-doc";
import { Table } from "@medusajs/ui";

import Divider from "../../divider";
import Item from "../item/item";

type ItemsProps = {
    order: Order;
};

const Items = ({ order }: ItemsProps) => {
    if (!isExpandedDoc<Cart>(order.cart) || !order.cart.cartItems) {
        return null;
    }
    const { cartItems } = order.cart;
    const items = cartItems.map((item) => {
        const { variantId } = item;
        const product = item.product as Product;
        const variant = product.variants.find(
            (variant) => variant.id === variantId
        );

        return {
            ...variant,
            gallery: product.variants[0].gallery,
            productName: product.title,
            quantity: item.quantity,
        };
    });

    return (
        <div className="flex flex-col">
            <Divider className="!mb-0" />
            <Table>
                <Table.Body data-testid="products-table">
                    {items.map((item) => {
                        return (
                            <Item
                                currencyCode={"usd"}
                                item={item as any}
                                key={item.id}
                            />
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default Items;
