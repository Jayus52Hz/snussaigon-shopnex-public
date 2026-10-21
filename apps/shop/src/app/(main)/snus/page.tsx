import type { Metadata } from "next";

import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { getSelectedLocation } from "@/i18n/location";
import { getProducts } from "@/services/products";
import { getBrandTerms, getFilterAttributes, getSEOArticles } from "@/services/homepage";
import StoreTemplate from "@/templates/store";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const seo = dictionaries[locale].seo;
    return buildMetadata({
        path: "/snus",
        locale,
        fallbackTitle: seo.shopTitle,
        fallbackDescription: seo.shopDescription,
    });
}

export const dynamic = "force-dynamic";

export default async function SnusPage() {
    const locale = await getLocale();
    const selectedLocation = await getSelectedLocation();
    const [products, seoArticles, brandTerms, filterAttributes] = await Promise.all([
        getProducts(locale, selectedLocation, "snus", "all"),
        getSEOArticles({ pageType: "store", locale }).catch(() => []),
        getBrandTerms().catch(() => []),
        getFilterAttributes().catch(() => []),
    ]);

    return (
        <Suspense fallback={null}>
            <StoreTemplate
                defaultSortByStock
                products={products}
                seoArticles={seoArticles}
                brandTerms={brandTerms}
                filterAttributes={filterAttributes}
            />
        </Suspense>
    );
}
