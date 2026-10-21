import { useLocale } from "@/i18n/locale-provider";
import { StarRating } from "@/utils/ratings";
import { convertToLocale } from "@/utils/money";
import { cn } from "@/utils";
import Link from "next/link";

type ProductInfoProps = {
    product: any;
};

export default function ProductInfo({ product }: ProductInfoProps) {
    const { dict, locale } = useLocale();
    const variant = product.variants?.[0];
    const price = variant?.price || 0;
    const originalPrice = variant?.originalPrice;
    const isOnSale = originalPrice && originalPrice > price;
    const discountPercent = isOnSale
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;
    const currency = product.currency || "VND";
    const isNotForSale = product.notForSale === true;

    const collectionHandle =
        product.collections?.[0] && typeof product.collections[0] === "object"
            ? product.collections[0].handle
            : null;
    const collectionTitle =
        product.collections?.[0] && typeof product.collections[0] === "object"
            ? product.collections[0].title
            : null;

    return (
        <div className="flex flex-col gap-y-3">
            {/* Collection link */}
            {collectionHandle && collectionTitle && (
                <Link
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    href={`/snus-${collectionHandle}`}
                >
                    {collectionTitle}
                </Link>
            )}

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold leading-tight text-gray-900">
                {product.title}
            </h1>

            {/* Badge + Strength + Format + Rating */}
            <div className="flex items-center gap-2 flex-wrap">
                {product.badge && (
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase",
                            product.badge === "hot"
                                ? "bg-red-100 text-red-700"
                                : product.badge === "new"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                        )}
                    >
                        {product.badge === "hot" && (locale === "en" ? "Best Seller" : "Bán Chạy")}
                        {product.badge === "new" && dict.common.newArrivals}
                        {product.badge === "sale" && dict.common.sale}
                    </span>
                )}
                {product.strength && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-semibold">
                        {product.strength}
                    </span>
                )}
            </div>

            {/* Rating */}
            {product.rating && (
                <button
                    className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
                    onClick={() => {
                        document
                            .getElementById("product-reviews")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    type="button"
                >
                    <StarRating rating={product.rating} />
                    <span className="text-gray-600">
                        {product.rating}
                    </span>
                    {product.reviewCount && (
                        <span className="text-gray-400">
                            ({product.reviewCount} {dict.product.reviews.toLowerCase()})
                        </span>
                    )}
                </button>
            )}

            {/* Price — "Chưa kinh doanh": giá trong CMS là 0đ (bắt buộc nhập) nên hiện nhãn thay cho giá */}
            {isNotForSale ? (
                <p className="mt-1 text-2xl font-bold text-gray-500" data-component="pdp-not-for-sale">
                    {dict.common.notForSale}
                </p>
            ) : (
                <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-2xl font-bold text-red-600">
                        {convertToLocale({
                            amount: price,
                            currency_code: currency,
                        })}
                    </span>
                    {isOnSale && originalPrice && (
                        <>
                            <span className="text-lg text-gray-400 line-through">
                                {convertToLocale({
                                    amount: originalPrice,
                                    currency_code: currency,
                                })}
                            </span>
                            <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                -{discountPercent}%
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* Stock status — hết hàng (cờ inStock) ưu tiên trước tồn kho; "Chưa kinh doanh" đã hiện ở chỗ giá */}
            {isNotForSale ? null : product.inStock === false ? (
                <p className="text-sm font-medium text-red-600">{dict.common.soldOut}</p>
            ) : variant?.stockCount !== undefined && (
                <p
                    className={cn(
                        "text-sm font-medium",
                        variant.stockCount === 0
                            ? "text-red-600"
                            : variant.stockCount <= 5
                              ? "text-amber-600"
                              : "text-green-600"
                    )}
                >
                    {variant.stockCount === 0
                        ? dict.common.soldOut
                        : variant.stockCount <= 5
                          ? (locale === "en" ? `Only ${variant.stockCount} left` : `Chỉ còn ${variant.stockCount} sản phẩm`)
                          : (locale === "en" ? "In Stock" : "Còn hàng")}
                </p>
            )}
        </div>
    );
}
