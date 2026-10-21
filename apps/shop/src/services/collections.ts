import { payloadSdk } from "@/utils/payload-sdk";
import { locationManyWhereClause } from "@/i18n/location-constants";
import { hasProductImage } from "@/utils/product-image";

export const getTopCollections = async () => {
    const collections = await payloadSdk.find({
        collection: "collections",
        limit: 3,
    });
    return collections.docs;
};

type CollectionPageDoc = {
    id: number;
    title: string;
    handle?: string | null;
    description?: string | null;
    updatedAt?: string;
    products?: (number | { id: number })[] | null;
    meta?: { title?: string | null; description?: string | null } | null;
};

/** Collection đang bật `visible` theo handle; `products` chỉ lấy id (depth 0). */
export const getCollectionByHandle = async (
    handle: string,
    locale?: string,
): Promise<CollectionPageDoc | null> => {
    const result = await payloadSdk.find({
        collection: "collections",
        depth: 0,
        limit: 1,
        ...(locale ? { locale: locale as any } : {}),
        where: { handle: { equals: handle }, visible: { equals: true } },
    });
    return (result.docs[0] as CollectionPageDoc | undefined) ?? null;
};

/**
 * Sản phẩm của một collection, giữ đúng thứ tự admin đã sắp.
 * Cùng điều kiện với /snus: visible + còn hàng + đúng location.
 */
export const getCollectionProducts = async (
    collection: CollectionPageDoc,
    locale?: string,
    locationId?: null | string,
) => {
    const ids = (collection.products || []).map((p) => (typeof p === "object" ? p.id : p));
    if (!ids.length) return [];

    const locWhere = locationManyWhereClause(locationId);
    const baseWhere = {
        id: { in: ids },
        visible: { equals: true },
        inStock: { equals: true },
    };
    const products = await payloadSdk.find({
        collection: "products",
        limit: ids.length,
        ...(locale ? { locale: locale as any } : {}),
        where: locWhere ? { and: [baseWhere, locWhere] } : baseWhere,
    });
    const order = new Map(ids.map((id, i) => [id, i]));
    // SP chưa có ảnh không hiện trên web
    return products.docs.filter(hasProductImage).sort(
        (a: any, b: any) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
    );
};
