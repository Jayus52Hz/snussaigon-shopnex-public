"use client";

import { useLocale } from "@/i18n/locale-provider";
import ProductCard from "@/components/product-card";

type RelatedProductsProps = {
    // Đã được lọc + rank sẵn ở server (services/products.ts → getRelatedProducts):
    // chỉ sản phẩm còn hàng, ưu tiên cùng độ mạnh → cùng vị → còn lại.
    products?: any[];
};

export default function RelatedProducts({ products = [] }: RelatedProductsProps) {
    const { dict } = useLocale();

    if (!products.length) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
                <span className="text-sm font-medium text-gray-500 mb-2">
                    {dict.product.relatedProducts.toUpperCase()}
                </span>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {dict.product.youMayAlsoLike}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-7">
                {products.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}
