import { unstable_cache } from "next/cache";
import { payloadSdk } from "@/utils/payload-sdk";

// Nav + footer chạy trên MỌI trang (layout). Cache theo locale để không gọi lại
// CMS mỗi request. Giữ fetch (có thể throw) TRONG cache, fallback null NGOÀI cache
// để lỗi CMS thoáng qua không bị pin cả window revalidate.
const NAV_REVALIDATE = 300;

const _getNavigation = unstable_cache(
    async (locale?: string) => {
        return (await payloadSdk.findGlobal({
            slug: "navigation",
            ...(locale ? { locale } : {}),
        } as any)) as any;
    },
    ["navigation:getNavigation"],
    { revalidate: NAV_REVALIDATE, tags: ["navigation"] }
);

export const getNavigation = async (locale?: string) => {
    try {
        return await _getNavigation(locale);
    } catch {
        return null;
    }
};

const _getFooterData = unstable_cache(
    async (locale?: string) => {
        return (await payloadSdk.findGlobal({
            slug: "footer",
            ...(locale ? { locale } : {}),
        } as any)) as any;
    },
    ["navigation:getFooterData"],
    { revalidate: NAV_REVALIDATE, tags: ["footer"] }
);

export const getFooterData = async (locale?: string) => {
    try {
        return await _getFooterData(locale);
    } catch {
        return null;
    }
};
