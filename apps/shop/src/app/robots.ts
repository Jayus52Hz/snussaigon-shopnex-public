import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://snussaigon.com";

// Production: allow indexing of public storefront pages. Disallow private
// transaction routes and any URL with query strings (filters/sort/pagination
// generate near-duplicate URLs that hurt the crawl budget).
// `/_next/image` phải Allow: mọi ảnh next/image có dạng /_next/image?url=…, nếu
// không sẽ dính `/*?*`. Google lấy rule khớp dài nhất → Allow (12 ký tự) thắng.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/_next/image"],
                disallow: [
                    "/api/",
                    "/admin/",
                    "/cart",
                    "/checkout",
                    "/account",
                    "/order",
                    "/confirm-order",
                    "/*?*",
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
