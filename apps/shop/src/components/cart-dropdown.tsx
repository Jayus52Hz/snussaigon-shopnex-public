"use client";

import { useLocale } from "@/i18n/locale-provider";
import { convertToLocale } from "@/utils/money";
import {
    Popover,
    PopoverPanel,
    Transition,
} from "@headlessui/react";
import { Button } from "@medusajs/ui";
import { ShoppingBag, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCart } from "react-use-cart";

import DeleteButton from "./delete-button";
import LineItemOptions from "./line-item-options";
import LineItemPrice from "./line-item-price";
import Thumbnail from "./thumbnail";

// Resolves thumbnail for a cart item — fetches from API if missing
function CartItemThumbnail({ item, prefix }: { item: any; prefix: string }) {
    const getUrl = (it: any) => {
        const g = it.gallery;
        if (Array.isArray(g) && g.length > 0) {
            const first = g[0];
            if (typeof first === 'object' && first?.url) return first.url;
        }
        return it.thumbnail || it.imageUrl || null;
    };

    const [thumbUrl, setThumbUrl] = useState<string | null>(getUrl(item));

    useEffect(() => {
        if (thumbUrl) return;
        const handle = item.handle || item.productId;
        if (!handle) return;
        const base = process.env.NEXT_PUBLIC_STOREFRONT_URL || "";
        fetch(`${base}/api/products?where[handle][equals]=${handle}&limit=1&depth=2`)
            .then((r) => r.json())
            .then((data) => {
                const g = data?.docs?.[0]?.gallery;
                if (Array.isArray(g) && g.length > 0 && g[0]?.url) {
                    setThumbUrl(g[0].url);
                }
            })
            .catch(() => {});
    }, [item.handle, item.productId, thumbUrl]);

    return (
        <Link
            className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
            href={`${prefix}/${item.handle}`}
        >
            <Thumbnail size="square" thumbnail={thumbUrl || undefined} />
        </Link>
    );
}

const CartDropdown = ({
    variant = "light",
}: {
    variant?: "light" | "dark";
} = {}) => {
    const { cartTotal, items, totalItems } = useCart();
    const { dict, locale } = useLocale();
    const prefix = locale === "en" ? "/en" : "";
    const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
        undefined
    );
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const open = () => setCartDropdownOpen(true);
    const close = () => setCartDropdownOpen(false);

    const subtotal = cartTotal ?? 0;
    const itemRef = useRef<number>(totalItems || 0);

    const timedOpen = () => {
        open();
        const timer = setTimeout(close, 5000);
        setActiveTimer(timer);
    };

    const openAndCancel = () => {
        if (activeTimer) {
            clearTimeout(activeTimer as any);
        }
        open();
    };

    // Clean up the timer when the component unmounts
    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer as any);
            }
        };
    }, [activeTimer]);

    const pathname = usePathname();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const currentItems = itemRef.current;
        itemRef.current = totalItems;

        if (
            totalItems > 0 &&
            currentItems !== totalItems &&
            !pathname.includes("/cart")
        ) {
            timedOpen();
        }
    }, [totalItems, pathname]);

    return (
        <>
            {/* Mobile backdrop overlay */}
            {cartDropdownOpen && (
                <div
                    aria-label="Close cart dropdown"
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={close}
                    onKeyDown={(e) => { if (e.key === "Escape") close(); }}
                    role="button"
                    tabIndex={0}
                />
            )}
            <div
                className="h-full z-50 flex items-center"
                onMouseEnter={openAndCancel}
                onMouseLeave={close}
            >
            <Popover className="relative h-full flex items-center">
                {variant === "dark" ? (
                    <Link
                        aria-label="Cart"
                        className="relative text-white/85 transition-colors hover:text-white"
                        href={`${prefix}/cart`}
                        onClick={close}
                    >
                        <ShoppingBag className="h-6 w-6" />
                        {isMounted && totalItems > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 font-body text-[11px] font-bold text-saigon-base">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>
                ) : (
                    <Link
                        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        href={`${prefix}/cart`}
                        onClick={close}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {isMounted && totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>
                )}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                    show={cartDropdownOpen}
                >
                    <PopoverPanel
                        className="fixed top-[100px] left-2 right-2 md:absolute md:top-[calc(100%+8px)] md:left-auto md:right-0 md:w-[380px] bg-white border border-gray-200 rounded-xl shadow-lg max-h-[calc(100dvh-140px)] overflow-hidden flex flex-col"
                        static
                    >
                        {/* Header with close button */}
                        <div className="p-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                            <h3 className="text-lg font-semibold">{dict.common.cart} ({totalItems})</h3>
                            <button
                                aria-label={dict.common.close}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={close}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {items.length ? (
                            <>
                                <div className="overflow-y-auto flex-1 min-h-0 px-4 grid grid-cols-1 gap-y-4 py-2">
                                    {items.map((item) => (
                                        <div
                                            className="grid grid-cols-[80px_1fr] gap-x-3 py-2"
                                            key={item.id}
                                        >
                                            <CartItemThumbnail item={item} prefix={prefix} />
                                            <div className="flex flex-col justify-between min-w-0">
                                                <div>
                                                    <Link
                                                        className="text-sm font-medium line-clamp-1 hover:text-blue-600"
                                                        href={`${prefix}/${item.handle}`}
                                                        onClick={close}
                                                    >
                                                        {item.productName}
                                                    </Link>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            {dict.product.quantity}: {item.quantity}
                                                        </span>
                                                        <LineItemPrice
                                                            cartTotal={
                                                                item.price * (item.quantity || 1)
                                                            }
                                                            currencyCode={
                                                                item.currency || "VND"
                                                            }
                                                            originalPrice={
                                                                item.originalPrice
                                                            }
                                                            style="tight"
                                                        />
                                                    </div>
                                                </div>
                                                <DeleteButton
                                                    className="mt-1 self-start"
                                                    id={item.id}
                                                    productId={item.productId}
                                                >
                                                    {locale === "en" ? "Remove" : "Xóa"}
                                                </DeleteButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 flex flex-col gap-y-3 border-t border-gray-100 flex-shrink-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">
                                            {locale === "en" ? "Subtotal" : "Tạm tính"}
                                        </span>
                                        <span className="font-bold text-lg">
                                            {convertToLocale({
                                                amount: subtotal,
                                                currency_code:
                                                    items[0]?.currency || "VND",
                                            })}
                                        </span>
                                    </div>
                                    <Link href={`${prefix}/cart`} onClick={close}>
                                        <Button
                                            className="w-full"
                                            size="large"
                                        >
                                            {locale === "en" ? "View Cart" : "Xem giỏ hàng"}
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex py-12 flex-col gap-y-4 items-center justify-center">
                                <div className="bg-gray-900 text-sm flex items-center justify-center w-6 h-6 rounded-full text-white">
                                    <span>0</span>
                                </div>
                                <span className="text-sm text-gray-500">{dict.cart.emptyTitle}.</span>
                                <Link href={`${prefix}/snus`} onClick={close}>
                                    <Button>
                                        {dict.cart.exploreProducts}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </PopoverPanel>
                </Transition>
            </Popover>
        </div>
        </>
    );
};

export default CartDropdown;
