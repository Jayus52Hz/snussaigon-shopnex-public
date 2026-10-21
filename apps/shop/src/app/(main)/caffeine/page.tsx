import type { Metadata } from "next";

import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { getSelectedLocation } from "@/i18n/location";
import { getProducts } from "@/services/products";
import { getFilterAttributes } from "@/services/homepage";
import StoreTemplate from "@/templates/store";
import { Suspense } from "react";

const CAFFEINE_TITLE = "Caffeine Pouches";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    return buildMetadata({
        path: "/caffeine",
        locale,
        fallbackTitle: CAFFEINE_TITLE,
        fallbackDescription:
            locale === "en"
                ? "Caffeine pouches — energy pouches without nicotine."
                : "Caffeine pouches — túi năng lượng caffeine, không chứa nicotine.",
    });
}

export const dynamic = "force-dynamic";

export default async function CaffeinePage() {
    const locale = await getLocale();
    const selectedLocation = await getSelectedLocation();
    const [products, filterAttributes] = await Promise.all([
        getProducts(locale, selectedLocation, "caffeine", "all"),
        getFilterAttributes().catch(() => []),
    ]);

    return (
        <Suspense fallback={null}>
            <StoreTemplate collectionTitle={CAFFEINE_TITLE} filterAttributes={filterAttributes} products={products} />
        </Suspense>
    );
}
