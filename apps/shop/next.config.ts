import type { NextConfig } from "next";

import { IMAGE_REMOTE_PATTERNS } from "./src/utils/image-hosts";

const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        // Danh sách host dùng chung với utils/image-url.ts (usableImageUrl).
        remotePatterns: IMAGE_REMOTE_PATTERNS,
        // Image optimization ON (sharp installed). Serves AVIF/WebP resized
        // per device — biggest LCP/payload win. Cached to .next/cache/images.
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 2678400, // 31 days — long cache on optimized variants
    },
    // Tắt streaming metadata: canonical/hreflang/robots luôn nằm trong <head>
    // với mọi User-Agent. Khai báo option này THAY danh sách bot mặc định.
    // https://nextjs.org/docs/15/app/api-reference/config/next-config-js/htmlLimitedBots
    htmlLimitedBots: /.*/,
    // skipTrailingSlashRedirect: true,
};

export default nextConfig;
