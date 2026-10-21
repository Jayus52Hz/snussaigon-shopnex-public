"use client";

import { useLocale } from "@/i18n/locale-provider";
import { convertToLocale } from "@/utils/money";
import { localizeProduct } from "@/utils/localize-product";
import { cn } from "@/utils";
import {
    CheckCircle,
    Eye,
    Loader2,
    Minus,
    Plus,
    ShoppingCart,
    Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "react-use-cart";

/* ─────────────────────────────────────────────────────────────────────────────
 * ProductCard — used on /snus listings, brand pages, search, related products
 * AND on homepage product sections.
 *
 * Class-naming convention (BEM-ish, prefixed with `pc-` = "product card"):
 *   pc-root          → outer article
 *   pc-media         → image wrapper (square)
 *   pc-media-img     → the <img>
 *   pc-badge-stack   → top-left badge stack
 *   pc-badge         → individual badge (dark)
 *   pc-badge--muted  → grey badge variant (sold out)
 *   pc-strength      → top-right strength chip
 *   pc-quickview     → bottom-right hover quick-view button
 *   pc-body          → text content block
 *   pc-title         → product title h3
 *   pc-rating        → stars + count row
 *   pc-price-row     → price + strike + discount
 *   pc-price         → main price
 *   pc-price-old     → strikethrough original
 *   pc-discount      → red "−XX%" pill (only red accent in the card)
 *   pc-stock-warn    → "Only X left" red text
 *   pc-cta-area      → bottom button row
 *   pc-cta           → add-to-cart button
 *   pc-qty           → quantity stepper container
 *   pc-qty-btn       → +/− buttons
 *
 * Tailwind utilities are inlined for tooling/intellisense but grouped per
 * element with the semantic name as a leading comment so future edits stay
 * surgical.
 * ──────────────────────────────────────────────────────────────────────── */

type ProductCardProps = {
    product: any;
    variant?: "compact" | "grid";
};

// Reusable class blobs ───────────────────────────────────────────────────────
const PC_BADGE_BASE =
    "inline-block rounded-[2px] px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.08em]";

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem, items, removeItem, updateItemQuantity } = useCart();
    const { dict, locale } = useLocale();
    const localizedProduct = localizeProduct(product, locale);
    const [addState, setAddState] = useState<"idle" | "loading" | "added">(
        "idle"
    );
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Derived data ──────────────────────────────────────────────────────────
    const firstVariant = localizedProduct.variants?.[0];
    const price = firstVariant?.calculated_price || firstVariant?.price || 0;
    const originalPrice = firstVariant?.original_price;
    const thumbnail =
        firstVariant?.gallery?.[0]?.url || localizedProduct.thumbnail;
    const hasSale = originalPrice && originalPrice > price;
    const discountPercent = hasSale
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    // Hết hàng khi: product.inStock === false (nguồn CMS) HOẶC tồn kho variant = 0.
    const isOutOfStock =
        localizedProduct.inStock === false ||
        firstVariant?.inventory_quantity === 0;
    // "Chưa kinh doanh" (cờ CMS): không mua được, ưu tiên hơn nhãn Hết hàng.
    const isNotForSale = localizedProduct.notForSale === true;
    const isUnavailable = isNotForSale || isOutOfStock;
    const isLowStock =
        !isNotForSale &&
        firstVariant?.inventory_quantity > 0 &&
        firstVariant?.inventory_quantity <= 5;

    const cartItem = items.find((i) => i.productId === localizedProduct.id);
    // Hydration-safe: react-use-cart reads from localStorage on mount only.
    const inCart = isMounted && !!cartItem;
    const cartQty = cartItem?.quantity || 1;

    const rating = localizedProduct.rating || 0;
    const reviewCount = localizedProduct.reviewCount || 0;
    const productHref =
        locale === "en"
            ? `/en/${localizedProduct.handle}`
            : `/${localizedProduct.handle}`;

    // Event handlers ────────────────────────────────────────────────────────
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isUnavailable || addState !== "idle") return;

        if (inCart) {
            removeItem(cartItem.id);
            return;
        }

        setAddState("loading");
        setTimeout(() => {
            addItem(
                {
                    id: String(localizedProduct.id),
                    currency: localizedProduct.currency || "VND",
                    gallery:
                        firstVariant?.gallery ||
                        (thumbnail ? [{ url: thumbnail }] : []),
                    handle: localizedProduct.handle,
                    name: localizedProduct.title,
                    originalPrice: originalPrice || undefined,
                    price,
                    productId: localizedProduct.id,
                    productName: localizedProduct.title,
                    quantity: 1,
                } as any,
                1
            );
            setAddState("added");
            setTimeout(() => setAddState("idle"), 1500);
        }, 400);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItem) updateItemQuantity(cartItem.id, cartQty + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!cartItem) return;
        if (cartQty <= 1) removeItem(cartItem.id);
        else updateItemQuantity(cartItem.id, cartQty - 1);
    };

    return (
        <article
            data-component="pc-root"
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-saigon-black/10 bg-white transition-all duration-300",
                "hover:-translate-y-1 hover:border-saigon-base hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
            )}
        >
            <Link className="tap-press block flex-1" href={productHref}>
                {/* pc-media — image wrapper. Image fills full edges (no inner
                    padding) per design spec. */}
                <div
                    data-component="pc-media"
                    className="relative aspect-square overflow-hidden bg-white pt-3"
                >
                    {thumbnail ? (
                        <Image
                            data-component="pc-media-img"
                            alt={localizedProduct.title}
                            className="object-cover transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06]"
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            src={thumbnail}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="text-sm text-saigon-grey">
                                No image
                            </span>
                        </div>
                    )}

                    {/* pc-badge-stack — mg/pouch + sale/oos (top-left)
                        Card has +12px top padding so badges don't overlap the
                        product image silhouette. */}
                    <div
                        data-component="pc-badge-stack"
                        className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5"
                    >
                        {localizedProduct.nicotine_mg != null && (
                            <span
                                className={cn(
                                    PC_BADGE_BASE,
                                    "bg-saigon-base text-white"
                                )}
                            >
                                {localizedProduct.nicotine_mg}mg/pouch
                            </span>
                        )}
                        {/* Hết hàng: không gắn nhãn (nút "Sold out" ở cuối card đã báo).
                            Chưa kinh doanh: vẫn gắn nhãn. */}
                        {isNotForSale ? (
                            <span
                                data-component="pc-badge--muted"
                                className={cn(
                                    PC_BADGE_BASE,
                                    "bg-saigon-border-dark text-white/80"
                                )}
                            >
                                {dict.common.notForSale}
                            </span>
                        ) : isUnavailable ? null : hasSale ? (
                            <span
                                className={cn(
                                    PC_BADGE_BASE,
                                    "bg-saigon-base text-white"
                                )}
                            >
                                {dict.common.sale}
                            </span>
                        ) : null}
                    </div>

                    {/* pc-quickview — bottom-right hover affordance */}
                    <button
                        data-component="pc-quickview"
                        aria-label={dict.common.quickView}
                        className="absolute bottom-2.5 right-2.5 z-10 rounded-full bg-white/95 p-2 opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        type="button"
                    >
                        <Eye className="h-4 w-4 text-saigon-base" />
                    </button>
                </div>

                {/* pc-body — text section */}
                <div
                    data-component="pc-body"
                    className="flex flex-col gap-1.5 px-3.5 pb-3 pt-3 md:px-4"
                >
                    {/* pc-title — product name (brand row removed per spec —
                        title already contains the brand). */}
                    <h3
                        data-component="pc-title"
                        className="font-body line-clamp-2 min-h-[42px] text-[15px] font-medium leading-[1.35] text-saigon-base"
                    >
                        {localizedProduct.title}
                    </h3>

                    {/* pc-strength — plain 12px text under the title (was a
                        floating chip on the image). */}
                    {localizedProduct.strength && (
                        <p
                            data-component="pc-strength"
                            className="font-body text-[12px] text-saigon-grey"
                        >
                            {localizedProduct.strength}
                        </p>
                    )}

                    {/* pc-rating — only when rating data exists */}
                    {(rating > 0 || reviewCount > 0) && (
                        <div
                            data-component="pc-rating"
                            className="flex items-center gap-1"
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    className={cn(
                                        "h-3 w-3",
                                        star <= Math.round(rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-saigon-black/15 text-saigon-black/15"
                                    )}
                                    key={star}
                                />
                            ))}
                            <span className="ml-1 text-[12px] text-saigon-grey">
                                {rating.toFixed(1)}
                                {reviewCount > 0 && ` (${reviewCount})`}
                            </span>
                        </div>
                    )}

                    {/* pc-price-row — ẩn khi "Chưa kinh doanh" (giá CMS = 0đ); badge + CTA đã ghi nhãn */}
                    {!isNotForSale && (
                        <div
                            data-component="pc-price-row"
                            className="mt-1 flex flex-wrap items-baseline gap-x-2"
                        >
                            <span
                                data-component="pc-price"
                                className="font-body text-[16px] font-semibold text-saigon-base"
                            >
                                {convertToLocale({
                                    amount: price,
                                    currency_code:
                                        localizedProduct.currency || "VND",
                                })}
                            </span>
                            {hasSale && (
                                <>
                                    <span
                                        data-component="pc-price-old"
                                        className="font-body text-[13px] text-saigon-grey line-through"
                                    >
                                        {convertToLocale({
                                            amount: originalPrice,
                                            currency_code:
                                                localizedProduct.currency || "VND",
                                        })}
                                    </span>
                                    {discountPercent > 0 && (
                                        <span
                                            data-component="pc-discount"
                                            className="font-body text-[12px] font-semibold text-saigon-red"
                                        >
                                            −{discountPercent}%
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* pc-stock-warn */}
                    {isLowStock && (
                        <p
                            data-component="pc-stock-warn"
                            className="font-body text-[12px] font-medium text-saigon-red"
                        >
                            {locale === "en"
                                ? `Only ${firstVariant.inventory_quantity} left!`
                                : `Chỉ còn ${firstVariant.inventory_quantity} sản phẩm!`}
                        </p>
                    )}
                </div>
            </Link>

            {/* pc-cta-area — sticky bottom button row */}
            <div
                data-component="pc-cta-area"
                className="mt-auto px-3.5 pb-4 md:px-4"
            >
                {isUnavailable ? (
                    /* pc-cta-unavailable — Hết hàng / Chưa kinh doanh: không thêm vào giỏ,
                       chỉ mở trang chi tiết (có form "Báo tôi khi có hàng" nếu hết hàng). */
                    <Link
                        data-component="pc-cta-unavailable"
                        className="inline-flex h-[42px] w-full items-center justify-center whitespace-nowrap rounded-[2px] border border-saigon-black/15 bg-saigon-bg-warm px-1 font-display text-[11px] font-semibold uppercase tracking-[0.06em] text-saigon-grey transition-colors hover:border-saigon-base hover:text-saigon-base sm:px-3 sm:text-[13px] sm:tracking-[0.08em]"
                        href={productHref}
                    >
                        {isNotForSale
                            ? dict.common.notForSale
                            : locale === "en"
                              ? "Out of stock"
                              : "Hết hàng"}
                    </Link>
                ) : inCart ? (
                    /* pc-qty — quantity stepper when already in cart */
                    <div
                        data-component="pc-qty"
                        className="flex h-[42px] items-center justify-between rounded-[2px] border border-saigon-base bg-saigon-base text-white"
                    >
                        <button
                            data-component="pc-qty-btn"
                            aria-label="Decrease quantity"
                            className="flex h-full w-[42px] items-center justify-center transition-opacity hover:opacity-80"
                            onClick={handleDecrease}
                            type="button"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-body text-[14px] font-semibold tabular-nums">
                            {cartQty}
                        </span>
                        <button
                            data-component="pc-qty-btn"
                            aria-label="Increase quantity"
                            className="flex h-full w-[42px] items-center justify-center transition-opacity hover:opacity-80"
                            onClick={handleIncrease}
                            type="button"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : (
                    /* pc-cta — add to cart.
                       Mobile padding: px-1 (4px) to keep "Thêm vào giỏ" on a
                       single line at 375px viewport. Tablet+ bumps padding,
                       gap, and font-size up to comfortable density. */
                    <button
                        data-component="pc-cta"
                        aria-label={`${dict.common.addToCart} ${localizedProduct.title}`}
                        className={cn(
                            "inline-flex h-[42px] w-full items-center justify-center gap-1 whitespace-nowrap rounded-[2px] border border-saigon-base px-1 font-display text-[11px] font-semibold uppercase tracking-[0.06em] transition-all sm:gap-1.5 sm:px-3 sm:text-[13px] sm:tracking-[0.08em]",
                            addState === "added"
                                ? "bg-saigon-base text-white"
                                : "bg-transparent text-saigon-base hover:bg-saigon-base hover:text-white"
                        )}
                        disabled={addState !== "idle"}
                        onClick={handleAddToCart}
                        type="button"
                    >
                        {addState === "loading" && (
                            <Loader2 className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5" />
                        )}
                        {addState === "added" && (
                            <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        )}
                        {addState === "idle" && (
                            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        )}
                        {addState === "loading"
                            ? locale === "en"
                                ? "Adding..."
                                : "Đang thêm..."
                            : addState === "added"
                              ? locale === "en"
                                  ? "Added!"
                                  : "Đã thêm!"
                              : dict.common.addToCart}
                    </button>
                )}
            </div>
        </article>
    );
}
