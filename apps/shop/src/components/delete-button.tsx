import { updateCart } from "@/services/cart";
import { clx } from "@medusajs/ui";
import { useState } from "react";
import { useCart } from "react-use-cart";

import Spinner from "./icons/spinner";
import Trash from "./icons/trash";

const DeleteButton = ({
    id,
    children,
    className,
    productId,
}: {
    children?: React.ReactNode;
    className?: string;
    id: string;
    productId: number;
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { removeItem } = useCart();

    const handleDelete = (id: string) => {
        setIsDeleting(true);
        setTimeout(async () => {
            removeItem(id);
            await updateCart({
                id,
                productId,
                quantity: 0,
            });
            setIsDeleting(false);
        }, 200);
    };

    return (
        <div
            className={clx(
                "flex items-center justify-between text-small-regular",
                className
            )}
        >
            <button
                className="flex items-center gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
                onClick={() => handleDelete(id)}
                type="button"
            >
                {isDeleting ? (
                    <Spinner className="animate-spin" />
                ) : (
                    <Trash size={20} />
                )}
                <span>{children}</span>
            </button>
        </div>
    );
};

export default DeleteButton;
