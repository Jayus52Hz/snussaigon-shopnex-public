import type { Metadata } from "next";

import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { getSelectedLocation } from "@/i18n/location";
import { getCollectionByHandle, getCollectionProducts } from "@/services/collections";
import { getFilterAttributes } from "@/services/homepage";
import StoreTemplate from "@/templates/store";
import { buildMetadata } from "@/utils/build-metadata";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type CollectionPageProps = {
    params: Promise<{ handle: string }>;
};

export async function generateMetadata(
    props: CollectionPageProps,
): Promise<Metadata> {
    const { handle } = await props.params;
    const locale = await getLocale();
    const collection = await getCollectionByHandle(handle, locale);
    if (!collection) return { title: "Not Found" };
    return buildMetadata({
        path: `/bo-suu-tap/${handle}`,
        locale,
        fallbackTitle: collection.meta?.title || collection.title,
        fallbackDescription:
            collection.meta?.description || dictionaries[locale].seo.shopDescription,
    });
}

export const dynamic = "force-dynamic";

/**
 * Trang collection tạo trong CMS (Catalog → Collections): /bo-suu-tap/{handle}
 * và /en/bo-suu-tap/{handle}. Sản phẩm theo đúng danh sách + thứ tự chọn trong admin.
 * Collection không tồn tại hoặc tắt `visible` → 404.
 */
export default async function CollectionPage(props: CollectionPageProps) {
    const { handle } = await props.params;
    const locale = await getLocale();
    const selectedLocation = await getSelectedLocation();

    const collection = await getCollectionByHandle(handle, locale);
    if (!collection) notFound();

    const [products, filterAttributes] = await Promise.all([
        getCollectionProducts(collection, locale, selectedLocation),
        getFilterAttributes().catch(() => []),
    ]);

    return (
        <Suspense fallback={null}>
            <StoreTemplate
                filterAttributes={filterAttributes}
                collectionDescription={collection.description || undefined}
                collectionTitle={collection.title}
                products={products}
            />
        </Suspense>
    );
}
