import type { Metadata } from "next";

import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { getSelectedLocation } from "@/i18n/location";
import { getCategoryName, getProducts } from "@/services/products";
import { getFilterAttributes } from "@/services/homepage";
import StoreTemplate from "@/templates/store";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";

// /caffeine là URL chính của danh mục caffeine → /danh-muc/caffeine 308 về đó.
const CANONICAL_CATEGORY_PATHS: Record<string, string> = { caffeine: "/caffeine" };

function canonicalCategoryRedirect(category: string, locale: string): void {
    const target = CANONICAL_CATEGORY_PATHS[category];
    if (target) permanentRedirect(locale === "en" ? `/en${target}` : target);
}

type CategoryPageProps = {
    params: Promise<{ category: string }>;
};

export async function generateMetadata(
    props: CategoryPageProps,
): Promise<Metadata> {
    const { category } = await props.params;
    const locale = await getLocale();
    canonicalCategoryRedirect(category, locale);
    const name = await getCategoryName(category, locale);
    if (!name) return { title: "Not Found" };
    return buildMetadata({
        path: `/danh-muc/${category}`,
        locale,
        fallbackTitle: name,
        fallbackDescription: name,
    });
}

export const dynamic = "force-dynamic";

/**
 * Trang danh mục ĐỘNG: bất kỳ danh mục nào khai báo trong Attributes → "category"
 * đều tự có trang tại /danh-muc/{slug}, liệt kê sản phẩm thuộc danh mục đó
 * (productType == slug). Danh mục không tồn tại → 404.
 */
export default async function CategoryPage(props: CategoryPageProps) {
    const { category } = await props.params;
    const locale = await getLocale();
    canonicalCategoryRedirect(category, locale);
    const selectedLocation = await getSelectedLocation();

    const name = await getCategoryName(category, locale);
    if (!name) notFound();

    const [products, filterAttributes] = await Promise.all([
        getProducts(locale, selectedLocation, category, "all"),
        getFilterAttributes().catch(() => []),
    ]);

    return (
        <Suspense fallback={null}>
            <StoreTemplate collectionTitle={name} filterAttributes={filterAttributes} products={products} />
        </Suspense>
    );
}
