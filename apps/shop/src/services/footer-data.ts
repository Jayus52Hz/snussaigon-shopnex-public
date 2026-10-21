import { payloadSdk } from "@/utils/payload-sdk";

export const getFooterData = async () => {
    try {
        return await payloadSdk.findGlobal({ slug: "footer" } as any) as any;
    } catch {
        return null;
    }
};
