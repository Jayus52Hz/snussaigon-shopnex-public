"use client";

import Item from "@/components/item";
import { useCart } from "react-use-cart";

const ItemsTemplate = () => {
    const { items } = useCart();

    return (
        <div className="space-y-4">
            {items.map((item: any) => (
                <Item
                    currencyCode={item.currency || "VND"}
                    item={item}
                    key={item.id}
                />
            ))}
        </div>
    );
};

export default ItemsTemplate;
