import type { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import ProductCard from "@/components/product-card";
import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { hasProductImage } from "@/utils/product-image";
import { getTrendingTerms } from "@/services/homepage";
import { Search } from "lucide-react";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isEn = locale === "en";
    const meta = await buildMetadata({
        path: "/search",
        locale,
        fallbackTitle: isEn ? "Search | SnusSaigon" : "Tìm Kiếm | SnusSaigon",
        fallbackDescription: isEn
            ? "Search for snus & nicotine pouch products at SnusSaigon"
            : "Tìm kiếm sản phẩm snus & nicotine pouch tại SnusSaigon",
    });
    // Trang kết quả tìm kiếm không nên index; vẫn follow link sản phẩm.
    return { ...meta, robots: { index: false, follow: true } };
}

/** Nhóm hiển thị: 0 = còn hàng, 1 = hết hàng, 2 = "Chưa kinh doanh" (luôn cuối). */
const stockGroup = (p: any): number => (p.notForSale === true ? 2 : p.inStock === false ? 1 : 0);

const totalStock = (p: any): number =>
    (p.variants || []).reduce((sum: number, v: any) => sum + (Number(v?.stockCount) || 0), 0);

/** Cùng quy tắc với catalog: còn hàng → hết hàng → chưa kinh doanh; trong nhóm: tồn kho giảm dần, rồi mới nhất. */
const compareSearchResults = (a: any, b: any): number =>
    stockGroup(a) - stockGroup(b) ||
    totalStock(b) - totalStock(a) ||
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q: query = "" } = await searchParams;
    const locale = await getLocale();
    const dict = dictionaries[locale];
    const isEn = locale === "en";
    const trendingTerms = await getTrendingTerms().catch(() => []);

    let filteredProducts: any[] = [];
    const term = query.trim();
    if (term) {
        const { payloadSdk } = await import("@/utils/payload-sdk");
        // Lọc ở CMS theo tên + thương hiệu (contains, không phân biệt hoa thường) trên TOÀN BỘ sản phẩm.
        // Không tìm trong mô tả: chuỗi ngắn như "velo" khớp nhầm "develop".
        const result = await payloadSdk.find({
            collection: "products" as any,
            limit: 500,
            locale: locale as any,
            where: {
                and: [
                    { visible: { equals: true } },
                    {
                        or: [
                            { title: { contains: term } },
                            { brand: { contains: term } },
                        ],
                    },
                ],
            } as any,
        });
        // SP chưa có ảnh không hiện trên web
        filteredProducts = (result.docs || []).filter(hasProductImage).sort(compareSearchResults);
    }

    const breadcrumbItems = query
        ? [
              { href: isEn ? "/en/search" : "/search", label: dict.common.search },
              { label: `"${query}"` },
          ]
        : [{ label: dict.common.search }];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="content-container py-10">
                <h1 className="text-2xl font-semibold text-ui-fg-base mb-6">
                    {isEn ? "Search Products" : "Tìm Kiếm Sản Phẩm"}
                </h1>

                <form action={isEn ? "/en/search" : "/search"} method="GET">
                    <div className="flex gap-2 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-fg-muted" />
                            <input
                                className="w-full pl-10 pr-4 py-2.5 border border-ui-border-base rounded-lg text-sm focus:outline-none focus:border-ui-fg-interactive"
                                defaultValue={query}
                                name="q"
                                placeholder={dict.common.searchPlaceholder}
                                type="search"
                            />
                        </div>
                        <button
                            className="px-5 py-2.5 bg-ui-fg-base text-white rounded-lg text-sm font-medium hover:bg-ui-fg-subtle transition-colors"
                            type="submit"
                        >
                            {dict.common.search}
                        </button>
                    </div>
                </form>

                {query ? (
                    <div className="mt-8">
                        <p className="text-sm text-ui-fg-muted mb-6">
                            {isEn ? "Results for" : "Kết quả cho"} &quot;{query}&quot;:{" "}
                            <span className="font-medium text-ui-fg-base">
                                {filteredProducts.length}{" "}
                                {isEn ? "products" : "sản phẩm"}
                            </span>
                        </p>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-7">
                                {filteredProducts.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-lg text-ui-fg-muted mb-2">
                                    {isEn
                                        ? "No products found"
                                        : "Không tìm thấy sản phẩm nào"}
                                </p>
                                <p className="text-sm text-ui-fg-muted">
                                    {isEn
                                        ? "Try a different keyword or browse below"
                                        : "Thử tìm với từ khóa khác hoặc xem các gợi ý bên dưới"}
                                </p>
                            </div>
                        )}
                    </div>
                ) : null}

                {!query && trendingTerms.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-sm font-medium text-ui-fg-muted mb-3 uppercase tracking-wide">
                            {dict.homepage.trendingTitle}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {trendingTerms.map((term: any) => (
                                <Link
                                    className="inline-flex items-center rounded-full border border-ui-border-base px-3 py-1.5 text-sm text-ui-fg-subtle hover:text-ui-fg-base hover:border-ui-fg-interactive hover:bg-ui-bg-subtle transition-colors"
                                    href={`${isEn ? "/en" : ""}/search?q=${encodeURIComponent(term.term)}`}
                                    key={term.id}
                                >
                                    {term.term}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
