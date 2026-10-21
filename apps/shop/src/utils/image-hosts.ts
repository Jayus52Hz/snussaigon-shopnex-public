/**
 * Host ảnh remote mà next/image được phép tối ưu. Dùng chung cho
 * `next.config.ts` (images.remotePatterns) và `utils/image-url.ts`
 * (bỏ URL ảnh ngoài danh sách này để không vỡ ảnh).
 */
export const IMAGE_REMOTE_PATTERNS: { protocol: "http" | "https"; hostname: string; pathname?: string }[] = [
    {
        protocol: "https",
        hostname: "next.medusajs.com",
    },
    {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
    },
    {
        protocol: "https",
        hostname: "cf.cjdropshipping.com",
    },
    {
        protocol: "https",
        hostname: "cbu01.alicdn.com",
    },
    {
        protocol: "https",
        hostname: "oss-cf.cjdropshipping.com",
    },
    {
        protocol: "https",
        hostname: "pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev",
    },
    {
        // Custom CDN domain cho R2 bucket (media chính) — dùng chính thức.
        protocol: "https",
        hostname: "cdn.snussaigon.com",
        pathname: "/**",
    },
    {
        // TRANSITIONAL: domain R2 công khai cũ. Giữ tới khi migration DB
        // (media.url + product_documents.file_url) chạy xong rồi mới gỡ.
        protocol: "https",
        hostname: "pub-d4b33dbabfd649ca9af88f53262ce5a8.r2.dev",
    },
    {
        protocol: "https",
        hostname: "images.unsplash.com",
    },
    {
        protocol: "http",
        hostname: "localhost",
    },
    {
        protocol: "https",
        hostname: "cdn.shopnex.ai",
        pathname: "/**",
    },
];
