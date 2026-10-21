"use client";

import { payloadSdk } from "@/utils/payload-sdk";
import { useEffect, useState } from "react";

interface ShippingSettings {
    baseRate: number;
    freeShippingMinOrder: number;
}

let cachedPromise: Promise<ShippingSettings | null> | null = null;
let cachedResult: ShippingSettings | null = null;

function fetchSettings(): Promise<ShippingSettings | null> {
    if (cachedResult) return Promise.resolve(cachedResult);
    if (cachedPromise) return cachedPromise;

    cachedPromise = payloadSdk
        .find({
            collection: "shipping" as any,
            limit: 1,
            sort: "id",
            where: { enabled: { equals: true } },
        })
        .then((result) => {
            const method = result.docs?.[0];
            const provider = method?.shippingProvider?.[0];
            if (!provider) return null;
            const settings: ShippingSettings = {
                baseRate: provider.baseRate || 0,
                freeShippingMinOrder: provider.freeShippingMinOrder || 0,
            };
            cachedResult = settings;
            return settings;
        })
        .catch(() => null);

    return cachedPromise;
}

export function useShipping() {
    const [settings, setSettings] = useState<ShippingSettings | null>(cachedResult);

    useEffect(() => {
        if (cachedResult) return;
        let cancelled = false;
        fetchSettings().then((s) => {
            if (!cancelled) setSettings(s);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return settings;
}
