import type { Product } from "@shopnex/types";

import { Pagination } from "@/components/pagination";
import ProductCard from "@/components/product-card";

export default function PaginatedProducts({
    page,
    products,
    totalPages,
}: {
    page: number;
    products: Product[];
    totalPages: number;
}) {
    return (
        <>
            {products.length === 0 ? (
                <p className="text-ui-fg-muted py-12 text-center">
                    Không tìm thấy sản phẩm nào.
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-7">
                        {products.map((p: Product) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                data-testid="product-pagination"
                                page={page}
                                totalPages={totalPages}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
}
