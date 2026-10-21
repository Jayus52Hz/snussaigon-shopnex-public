import ProductRail from "./product-rail";

export default function FeaturedProducts({
    collections,
}: {
    collections: any[];
}) {
    return collections.map((collection) => (
        <li key={collection.id}>
            <ProductRail collection={collection} />
        </li>
    ));
}
