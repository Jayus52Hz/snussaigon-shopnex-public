import ProductCard from "@/components/product-card";

import SaigonSectionLabel from "./saigon-section-label";

export default function SaigonProductSection({
    title,
    products,
    href,
    limit = 8,
    bg = "bg-saigon-bg",
}: {
    title: string;
    products: any[];
    href?: string;
    limit?: number;
    bg?: string;
}) {
    if (!products?.length) return null;

    return (
        <section className={`${bg} py-14 md:py-20`}>
            <div className="content-container">
                <SaigonSectionLabel href={href} title={title} />
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-x-4 md:gap-y-6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-7">
                    {products.slice(0, limit).map((product, i) => (
                        <div
                            key={product.id}
                            className="opacity-0"
                            style={{
                                animation: `fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s both`,
                            }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
