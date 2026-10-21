"use client";

import type { SEOArticle } from "@/types/homepage";
import type { Collection } from "@shopnex/types";

import StoreTemplate from "./store";

export default function CollectionTemplate({
    collection,
    seoArticles,
}: {
    collection: Collection;
    seoArticles?: SEOArticle[];
}) {
    const products = (collection.products || []) as any[];
    const brandSlug = collection.handle || undefined;

    return (
        <StoreTemplate
            brandSlug={brandSlug}
            collectionDescription={collection.description || undefined}
            collectionTitle={collection.title}
            products={products}
            seoArticles={seoArticles}
        />
    );
}
