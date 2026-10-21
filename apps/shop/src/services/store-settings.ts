export const getStoreSettings = async () => {
    try {
        // Dùng internal URL khi chạy server-side để tránh external HTTP round-trip
        const internalBase = typeof window === "undefined"
            ? (process.env.CMS_INTERNAL_URL || "http://localhost:3000")
            : (process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://snussaigon.com");
        const res = await fetch(`${internalBase}/api/globals/site-settings?depth=1`, {
            next: { revalidate: 300 }, // cache 5 phút
        });
        if (res.ok) {
            const data = await res.json();
            return {
                name:          data.storeName || "SnusSaigon",
                currency:      data.currency || "VND",
                currencyFormat:"symbol",
                currencySymbol:"₫",
                dateFormat:    "d MMMM, yyyy",
                locale:        "vi-VN",
                timeFormat:    "H:mm",
                timezone:      "Asia/Ho_Chi_Minh",
                logoUrl:       data.logo?.url || null,
                faviconUrl:    data.favicon?.url || null,
                ogImageUrl:    data.seo?.ogImage?.url || null,
            };
        }
    } catch {
        // fallback to defaults
    }
    return {
        name:          "SnusSaigon",
        currency:      "VND",
        currencyFormat:"symbol",
        currencySymbol:"₫",
        dateFormat:    "d MMMM, yyyy",
        locale:        "vi-VN",
        timeFormat:    "H:mm",
        timezone:      "Asia/Ho_Chi_Minh",
        logoUrl:       null,
        faviconUrl:    null,
        ogImageUrl:    null,
    };
};
