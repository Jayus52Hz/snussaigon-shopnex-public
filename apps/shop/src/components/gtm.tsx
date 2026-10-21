"use client";

/**
 * GTM — Google Tag Manager + GA4 dataLayer helper
 *
 * Hướng dẫn cấu hình GTM:
 * 1. Đăng nhập GTM → tạo workspace → lấy GTM-XXXXXXX
 * 2. Thêm biến môi trường: NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 * 3. Trong GTM tạo Trigger GA4 Event với event_name tương ứng
 *
 * Events đã chuẩn hóa theo GA4 Ecommerce best practice:
 * - page_view         (tự động qua GTM)
 * - view_item         (trang chi tiết sản phẩm)
 * - add_to_cart       (thêm vào giỏ)
 * - remove_from_cart  (xóa khỏi giỏ)
 * - view_cart         (mở giỏ hàng)
 * - begin_checkout    (bắt đầu thanh toán)
 * - purchase          (đặt hàng thành công)
 * - search            (tìm kiếm)
 */

import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// ── GTM Script inject ────────────────────────────────────────────────────────
export function GTMScript() {
    if (!GTM_ID) return null;
    return (
        <>
            <Script
                id="gtm-init"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
                }}
            />
        </>
    );
}

// ── GTM NoScript (noscript fallback) ─────────────────────────────────────────
export function GTMNoScript() {
    if (!GTM_ID) return null;
    return (
        <noscript>
            <iframe
                height="0"
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                style={{ display: "none", visibility: "hidden" }}
                title="gtm-noscript"
                width="0"
            />
        </noscript>
    );
}

// ── dataLayer push helper ────────────────────────────────────────────────────
declare global {
    interface Window {
        dataLayer: Record<string, any>[];
    }
}

export function pushDataLayer(event: Record<string, any>) {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
}

// ── GA4 Ecommerce event helpers ──────────────────────────────────────────────

export function gtmViewItem(product: {
    id: string | number;
    name: string;
    brand?: string;
    price: number;
    currency?: string;
}) {
    pushDataLayer({
        event: "view_item",
        ecommerce: {
            currency: product.currency || "VND",
            value: product.price,
            items: [{
                item_id: String(product.id),
                item_name: product.name,
                item_brand: product.brand,
                price: product.price,
                quantity: 1,
            }],
        },
    });
}

export function gtmAddToCart(product: {
    id: string | number;
    name: string;
    brand?: string;
    price: number;
    quantity: number;
    currency?: string;
}) {
    pushDataLayer({
        event: "add_to_cart",
        ecommerce: {
            currency: product.currency || "VND",
            value: product.price * product.quantity,
            items: [{
                item_id: String(product.id),
                item_name: product.name,
                item_brand: product.brand,
                price: product.price,
                quantity: product.quantity,
            }],
        },
    });
}

export function gtmRemoveFromCart(product: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    currency?: string;
}) {
    pushDataLayer({
        event: "remove_from_cart",
        ecommerce: {
            currency: product.currency || "VND",
            value: product.price * product.quantity,
            items: [{
                item_id: String(product.id),
                item_name: product.name,
                price: product.price,
                quantity: product.quantity,
            }],
        },
    });
}

export function gtmViewCart(items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
}>, total: number, currency = "VND") {
    pushDataLayer({
        event: "view_cart",
        ecommerce: {
            currency,
            value: total,
            items: items.map(i => ({
                item_id: String(i.id),
                item_name: i.name,
                price: i.price,
                quantity: i.quantity,
            })),
        },
    });
}

export function gtmBeginCheckout(items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
}>, total: number, currency = "VND") {
    pushDataLayer({
        event: "begin_checkout",
        ecommerce: {
            currency,
            value: total,
            items: items.map(i => ({
                item_id: String(i.id),
                item_name: i.name,
                price: i.price,
                quantity: i.quantity,
            })),
        },
    });
}

export function gtmPurchase(order: {
    orderId: string;
    total: number;
    items: Array<{ id: string | number; name: string; price: number; quantity: number }>;
    currency?: string;
}) {
    pushDataLayer({
        event: "purchase",
        ecommerce: {
            transaction_id: order.orderId,
            currency: order.currency || "VND",
            value: order.total,
            items: order.items.map(i => ({
                item_id: String(i.id),
                item_name: i.name,
                price: i.price,
                quantity: i.quantity,
            })),
        },
    });
}

export function gtmSearch(searchTerm: string) {
    pushDataLayer({
        event: "search",
        search_term: searchTerm,
    });
}
