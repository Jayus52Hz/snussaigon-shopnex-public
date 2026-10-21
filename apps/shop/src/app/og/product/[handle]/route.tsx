import { getBrandInfo } from "@/services/products";
import { convertToLocale } from "@/utils/money";
import { loadProductImage, ogText, renderOgImage } from "@/utils/og-image";
import { productOgPrice } from "@/utils/og-url";
import { payloadSdk } from "@/utils/payload-sdk";
import { getProductImageUrl, hasProductImage, pickByHandle } from "@/utils/product-image";

export const runtime = "nodejs";

/**
 * Ảnh OG 1200×630 cho trang chi tiết SP /{handle} khi CMS không có ảnh OG riêng:
 * ảnh SP + thương hiệu + tên + giá VND. SP "Chưa kinh doanh" không hiện giá.
 * Metadata trỏ tới đây qua productOgImageUrl (utils/og-url.ts).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;
    const result = await payloadSdk.find({
        collection: "products",
        limit: 10,
        select: {
            title: true,
            handle: true,
            brand: true,
            currency: true,
            gallery: true,
            variants: true,
            visible: true,
            inStock: true,
            notForSale: true,
        } as any,
        where: { handle: { equals: handle } },
    });
    const product = pickByHandle(result.docs) as any;
    // Cùng điều kiện 404 với trang chi tiết.
    if (!product || !hasProductImage(product)) return new Response("Not found", { status: 404 });

    const [image, brand] = await Promise.all([
        loadProductImage(getProductImageUrl(product)),
        product.brand ? getBrandInfo(product.brand, "vi").catch(() => null) : Promise.resolve(null),
    ]);
    const price = productOgPrice(product);
    const money = (amount: number) => convertToLocale({ amount, currency_code: product.currency || "VND" });

    return renderOgImage({
        image,
        children: (
            <div style={ogText.stack}>
                {brand?.name ? <div style={ogText.eyebrow}>{brand.name}</div> : null}
                <div style={ogText.title(product.title || "")}>{product.title}</div>
                {price ? (
                    <div style={ogText.price}>
                        {money(price.price)}
                        {price.originalPrice ? <span style={ogText.oldPrice}>{money(price.originalPrice)}</span> : null}
                    </div>
                ) : null}
            </div>
        ),
    });
}
