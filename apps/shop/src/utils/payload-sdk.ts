import type { Config } from "@shopnex/types";

import { PayloadSDK } from "@shopnex/payload-sdk";

const isBrowser = typeof window !== "undefined";

const sdk = new PayloadSDK<Config>({
    baseInit: {
        credentials: "include",
    },
    baseURL: `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/api`,
    fetch: isBrowser ? (...args) => window.fetch(...args) : undefined,
});

// Wrapper to enforce default depth on all queries to prevent OOM
const withDefaultDepth = (fn: (...args: any[]) => any) => {
    return (options: any, ...rest: any[]) => {
        if (options && typeof options === "object" && options.collection) {
            return fn({ depth: 2, ...options }, ...rest);
        }
        return fn(options, ...rest);
    };
};

const origFind = sdk.find.bind(sdk);

// Use prototype delegation to preserve all SDK methods (me, findByID, create, etc.)
// while only overriding find with the depth wrapper
export const payloadSdk: typeof sdk = Object.assign(Object.create(sdk), {
    find: withDefaultDepth(origFind),
});
