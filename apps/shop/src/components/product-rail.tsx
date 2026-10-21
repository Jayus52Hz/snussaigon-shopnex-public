import { payloadSdk } from "@/utils/payload-sdk";
import { Text } from "@medusajs/ui";

import InteractiveLink from "./interactive-link";
import ProductPreview from "./product-preview";

export default async function ProductRail({ collection }: { collection: any }) {
    const products = await payloadSdk
        .find({
            collection: "products",
            depth: 2,
            limit: 3,
            sort: "createdAt",
            where: {
                collections: {
                    equals: collection.id,
                },
            },
        })
        .catch(() => ({ docs: [] }));

    if (!products.docs?.length) return null;

    return (
        <div className="content-container py-12 small:py-24">
            <div className="flex justify-between mb-8">
                <Text className="txt-xlarge">{collection.title}</Text>
                <InteractiveLink href={`/snus-${collection.handle}`}>
                    View all
                </InteractiveLink>
            </div>
            <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
                {(products.docs || []).map((product) => (
                    <li key={product.id}>
                        <ProductPreview isFeatured product={product} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
