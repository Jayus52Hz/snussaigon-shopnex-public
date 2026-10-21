import { getSelectedLocation } from "@/i18n/location";
import { getBrandEntry } from "@/services/brands";
import { getBrandInfo, getProducts } from "@/services/products";
import { loadImageDataUri, loadProductImage, ogText, renderOgImage } from "@/utils/og-image";
import { pickBrandOgProduct } from "@/utils/og-url";
import { getProductImageUrl } from "@/utils/product-image";

export const runtime = "nodejs";

/**
 * Ảnh OG 1200×630 cho trang hãng /snus-{slug} khi CMS (seo-meta) không có ảnh:
 * ảnh SP đầu tiên của catalog hãng (sort mặc định) + logo + tên hãng.
 * Metadata trỏ tới đây qua brandOgImageUrl (utils/og-url.ts).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const brandInfo = await getBrandInfo(slug, "vi");
    if (!brandInfo) return new Response("Not found", { status: 404 });

    const [products, brandEntry] = await Promise.all([
        // Cùng danh sách trang /snus-{brand} dùng.
        getProducts("vi", await getSelectedLocation(), "snus", "all"),
        getBrandEntry(slug, "vi").catch(() => null),
    ]);
    const product = pickBrandOgProduct(products, slug);
    if (!product) return new Response("Not found", { status: 404 });

    const [image, logo] = await Promise.all([
        loadProductImage(getProductImageUrl(product)),
        loadImageDataUri(brandEntry?.logo, { width: 320, height: 140 }),
    ]);

    return renderOgImage({
        image,
        children: (
            <div style={ogText.stack}>
                {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.src} alt="" width={logo.width} height={logo.height} style={{ marginBottom: 32 }} />
                ) : null}
                <div style={ogText.eyebrow}>Snus</div>
                <div style={ogText.title(brandInfo.name)}>{brandInfo.name}</div>
            </div>
        ),
    });
}
