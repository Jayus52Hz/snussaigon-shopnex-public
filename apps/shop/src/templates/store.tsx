"use client";

import type { SEOArticle } from "@/types/homepage";
import type { ReactNode } from "react";

import { useLocale } from "@/i18n/locale-provider";
import Breadcrumbs from "@/components/breadcrumbs";
import ProductCard from "@/components/product-card";
import SEOArticleSection from "@/components/seo-article-section";
import ShopFilterSidebar, { resetFilters } from "@/components/shop-filter-sidebar";
import ShopFilterSheet from "@/components/shop-filter-sheet";
import ActiveFilterChips from "@/components/active-filter-chips";
import ShopEmptyState from "@/components/shop-empty-state";
import ShopPagination from "@/components/shop-pagination";
import { ListFilter, ArrowUpDown, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import {
    applyFilters,
    brandPagePath,
    buildFilteredUrl,
    getActiveFilterCount,
    getStockGroup,
    parseFiltersFromSearchParams,
    useShopFilters,
    type ActiveFilters,
    type FilterOptions,
} from "@/hooks/use-shop-filters";

const PRODUCTS_PER_PAGE = 24;

/** Tổng tồn kho của sản phẩm = cộng stockCount mọi variant. */
const getTotalStock = (p: any): number =>
    (p.variants || []).reduce((sum: number, v: any) => sum + (Number(v?.stockCount) || 0), 0);

/** Tồn kho cao → thấp; bằng nhau thì sản phẩm tạo gần đây nhất lên trước. */
const compareByStockThenNewest = (a: any, b: any): number =>
    getTotalStock(b) - getTotalStock(a) ||
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const byPrice = (p: any): number => p.variants?.[0]?.price || 0;

/** So sánh trong cùng nhóm tồn kho theo kiểu sort đang chọn. 0 = giữ thứ tự gốc. */
const compareWithinGroup = (sortBy: string, defaultSortByStock: boolean) => (a: any, b: any): number => {
    switch (sortBy) {
        case "price-low":
            return byPrice(a) - byPrice(b);
        case "price-high":
            return byPrice(b) - byPrice(a);
        case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "name-az":
            return String(a.title || "").localeCompare(String(b.title || ""));
        default:
            return defaultSortByStock ? compareByStockThenNewest(a, b) : 0;
    }
};

const StoreTemplate = ({
    products,
    defaultSortByStock = false,
    brandSlug,
    collectionTitle,
    collectionDescription,
    seoArticles,
    brandTerms,
    filterAttributes,
    hero,
    breadcrumbParent,
}: {
    products: any[];
    /** Sort "Mặc định" = tồn kho giảm dần, rồi ngày tạo mới nhất (áp dụng cả khi đang lọc). */
    defaultSortByStock?: boolean;
    brandSlug?: string;
    collectionTitle?: string;
    collectionDescription?: string;
    seoArticles?: SEOArticle[];
    brandTerms?: { name: string; slug: string; image?: string }[];
    /** Attributes CMS cho bộ lọc (lấy phía server) — tên term + thứ tự mục. */
    filterAttributes?: any[];
    /** Khối giới thiệu thương hiệu, đặt dưới danh sách sản phẩm, ngay trên SEO Article. Không chứa H1 (H1 là tiêu đề danh sách). */
    hero?: ReactNode;
    /** Mục breadcrumb cha, vd Thương hiệu (/brands) cho trang /snus-{slug}. */
    breadcrumbParent?: { href: string; label: string };
}) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { dict, locale } = useLocale();

    const SORT_OPTIONS = [
        { value: "default", label: dict.common.sortDefault },
        { value: "newest", label: dict.common.sortNewest },
        { value: "price-low", label: dict.common.sortPriceLow },
        { value: "price-high", label: dict.common.sortPriceHigh },
        { value: "name-az", label: dict.common.sortNameAz },
    ];

    const [sortBy, setSortBy] = useState("default");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
    const closeFilterSheet = useCallback(() => setIsFilterOpen(false), []);

    const activeFilters: ActiveFilters = useMemo(
        () => parseFiltersFromSearchParams(searchParams, brandSlug),
        [searchParams, brandSlug]
    );
    const filterOptions: FilterOptions = useShopFilters(products, brandTerms, filterAttributes);
    const activeFilterCount = getActiveFilterCount(activeFilters, brandSlug);
    const shopPath = locale === "en" ? "/en/snus" : "/snus";
    // Trang shop snus + trang brand: 1 thương hiệu = trang /snus-{brand}
    const brandHref = useMemo(
        () => (brandSlug || pathname === shopPath ? (slug: string) => brandPagePath(shopPath, slug) : undefined),
        [brandSlug, pathname, shopPath]
    );

    // Đổi bộ lọc = đổi query. Cùng trang → pushState (không gọi lại server);
    // rời trang brand → router.push sang trang shop chung.
    const applyFilterChange = useCallback(
        (next: ActiveFilters) => {
            const url = buildFilteredUrl(pathname, searchParams, next, { brandSlug, shopPath });
            setVisibleCount(PRODUCTS_PER_PAGE);
            if (url.split("?")[0] === pathname) window.history.pushState(null, "", url);
            else router.push(url, { scroll: false });
        },
        [pathname, searchParams, brandSlug, shopPath, router]
    );

    const sortLabel =
        SORT_OPTIONS.find((o) => o.value === sortBy)?.label || dict.common.sortDefault;

    // Luôn: còn hàng → hết hàng → "Chưa kinh doanh"; trong từng nhóm theo kiểu sort đang chọn.
    const filteredProducts = useMemo(() => {
        const within = compareWithinGroup(sortBy, defaultSortByStock);
        return applyFilters(products, activeFilters).sort(
            (a, b) => getStockGroup(a) - getStockGroup(b) || within(a, b)
        );
    }, [products, activeFilters, sortBy, defaultSortByStock]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const handleClearFilters = useCallback(() => {
        applyFilterChange(resetFilters(brandSlug));
    }, [applyFilterChange, brandSlug]);

    // Mặc định chỉ hiện SP còn hàng → "Tất cả sản phẩm" = bỏ bộ lọc + ?availability=all
    // (trang brand giữ brand), để danh sách toàn SP hết hàng không bị trống.
    const handleBrowseAll = useCallback(() => {
        applyFilterChange({ ...resetFilters(brandSlug), availability: "all" });
    }, [applyFilterChange, brandSlug]);

    const title = collectionTitle || dict.common.allProducts;
    const breadcrumbItems = breadcrumbParent ? [breadcrumbParent, { label: title }] : [{ label: title }];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="content-container py-3 sm:py-6">
                <div className="flex gap-6 mt-4">
                    {/* Desktop sidebar — dính khi cuộn, có thanh cuộn riêng */}
                    <div className="hidden md:block w-[240px] flex-shrink-0">
                        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain pb-6 pr-2">
                            <ShopFilterSidebar
                                brandHref={brandHref}
                                brandSlug={brandSlug}
                                filterOptions={filterOptions}
                                filters={activeFilters}
                                onChange={applyFilterChange}
                                products={products}
                            />
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Header — title + count */}
                        <div className="mb-3">
                            <h1 className="text-xl sm:text-2xl font-bold">
                                {title}
                            </h1>
                            {collectionDescription && (
                                <div
                                    className="mt-2 text-sm text-gray-500 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: collectionDescription,
                                    }}
                                />
                            )}
                            <p className="text-sm text-gray-500 mt-0.5">
                                {locale === "en"
                                    ? `${filteredProducts.length} products match your filters`
                                    : `${filteredProducts.length} sản phẩm khớp bộ lọc`}
                                <span className="mx-1.5 text-gray-300">·</span>
                                {locale === "en" ? "in stock shown first" : "còn hàng hiện trước"}
                            </p>
                        </div>

                        {/* Filter & Sort toolbar */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                                {/* Mobile filter button */}
                                <button
                                    className="relative inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors md:hidden"
                                    onClick={() => setIsFilterOpen(true)}
                                    type="button"
                                >
                                    <ListFilter className="h-4 w-4" />
                                    {dict.common.filter}
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                            {/* Sort dropdown */}
                            <div className="relative">
                                <button
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    type="button"
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    <span className="hidden sm:inline">{dict.store.sortLabel}</span>
                                    <span>{sortLabel}</span>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                                {isSortOpen && (
                                    <>
                                        <button
                                            aria-label="Close sort dropdown"
                                            className="fixed inset-0 z-10 w-full h-full cursor-default border-0 bg-transparent"
                                            onClick={() => setIsSortOpen(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape") setIsSortOpen(false);
                                            }}
                                            type="button"
                                        />
                                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                            {SORT_OPTIONS.map((opt) => (
                                                <button
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                                        sortBy === opt.value ? "bg-gray-50 font-medium" : ""
                                                    }`}
                                                    key={opt.value}
                                                    onClick={() => {
                                                        setSortBy(opt.value);
                                                        setVisibleCount(PRODUCTS_PER_PAGE);
                                                        setIsSortOpen(false);
                                                    }}
                                                    type="button"
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Lựa chọn đang bật (cả desktop và mobile) */}
                        <ActiveFilterChips
                            className="mb-4"
                            filterOptions={filterOptions}
                            filters={activeFilters}
                            onChange={applyFilterChange}
                        />

                        {isFilterOpen && (
                            <ShopFilterSheet
                                brandHref={brandHref}
                                brandSlug={brandSlug}
                                filterOptions={filterOptions}
                                filters={activeFilters}
                                onApply={(next) => {
                                    setIsFilterOpen(false);
                                    applyFilterChange(next);
                                }}
                                onClose={closeFilterSheet}
                                products={products}
                            />
                        )}

                        {/* Results */}
                        {filteredProducts.length === 0 ? (
                            <ShopEmptyState
                                onBrowseAll={handleBrowseAll}
                                onClearFilters={handleClearFilters}
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-7">
                                    {visibleProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                                <ShopPagination
                                    onLoadMore={() =>
                                        setVisibleCount(
                                            (prev) => prev + PRODUCTS_PER_PAGE
                                        )
                                    }
                                    shown={visibleProducts.length}
                                    total={filteredProducts.length}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {hero}

            {seoArticles && seoArticles.length > 0 && (
                <SEOArticleSection articles={seoArticles} />
            )}
        </>
    );
};

export default StoreTemplate;
