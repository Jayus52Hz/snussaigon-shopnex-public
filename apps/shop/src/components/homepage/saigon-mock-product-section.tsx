import SaigonProductCard from "./saigon-product-card";
import SaigonSectionLabel from "./saigon-section-label";
import { type SaigonProduct } from "./saigon-mock-data";

export default function SaigonMockProductSection({
    title,
    products,
    href = "/snus",
    limit = 8,
    bg = "bg-saigon-bg",
    linkText = "Xem tất cả",
}: {
    title: string;
    products: SaigonProduct[];
    href?: string;
    limit?: number;
    bg?: string;
    linkText?: string;
}) {
    if (!products?.length) return null;

    return (
        <section className={`${bg} py-14 md:py-20`}>
            <div className="content-container">
                <SaigonSectionLabel href={href} linkText={linkText} title={title} />
                <div className="grid grid-cols-2 gap-x-[10px] gap-y-4 md:grid-cols-3 md:gap-x-3 md:gap-y-5 lg:grid-cols-4 lg:gap-x-4">
                    {products.slice(0, limit).map((p, i) => (
                        <div
                            key={p.id}
                            className="opacity-0"
                            style={{
                                animation: `fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s both`,
                            }}
                        >
                            <SaigonProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
