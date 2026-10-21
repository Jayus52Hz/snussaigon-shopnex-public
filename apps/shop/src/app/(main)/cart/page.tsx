import type { Metadata } from "next";

import CartTemplate from "@/templates/cart";
import { getActivePromotion, getShippingSettings } from "@/services/homepage";
import { getLocale } from "@/i18n/locale";

export const metadata: Metadata = {
    description: "Giỏ hàng của bạn tại SnusSaigon - Giao hàng COD toàn quốc",
    title: "Giỏ Hàng | SnusSaigon",
};

export const dynamic = "force-dynamic";

export default async function Cart() {
    const locale = await getLocale();
    const [shippingSettings, promotion] = await Promise.all([
        getShippingSettings().catch(() => null),
        getActivePromotion(locale),
    ]);
    return <CartTemplate promotion={promotion} shippingSettings={shippingSettings} />;
}
