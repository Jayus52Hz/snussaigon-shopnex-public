import type { Metadata } from "next";

import { headers } from "next/headers";
import { buildAlternates } from "@/utils/alternates";

import SaigonBackToTop from "@/components/homepage/saigon-back-to-top";
import SaigonFooter from "@/components/homepage/saigon-footer";
import SaigonMainWrapper from "@/components/homepage/saigon-main-wrapper";
import SaigonNav from "@/components/homepage/saigon-nav";
import StickyContactWrapper from "@/components/sticky-contact-wrapper";
import { getLocale } from "@/i18n/locale";
import { getSelectedLocation } from "@/i18n/location";
import { getLocations } from "@/services/homepage";
import { getNavigation, getFooterData } from "@/services/navigation";
import { getStoreSettings } from "@/services/store-settings";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isEn = locale === "en";

    // Derive vi/en URLs for hreflang from the original public pathname
    const headersList = await headers();
    const rawPathname = headersList.get("x-pathname") || "/";
    const basePath = /^\/en(?=\/|$)/.test(rawPathname)
        ? rawPathname.slice(3) || "/"
        : rawPathname;
    return {
        description: isEn
            ? "SnusSaigon - Premium snus & nicotine pouches. Fast delivery in HCMC, COD nationwide."
            : "SnusSaigon - Cửa hàng snus & nicotine pouch chính hãng. Giao hàng nhanh tại TP.HCM.",
        title: isEn
            ? "SnusSaigon - Premium Snus & Nicotine Pouches"
            : "SnusSaigon - Snus & Nicotine Pouch Chính Hãng",
        alternates: buildAlternates(basePath, locale),
    };
}

export default async function PageLayout(props: { children: React.ReactNode }) {
    const locale = await getLocale();
    // Fetch once per request — feeds nav (locations + logo + menu) and footer.
    const [
        locations,
        selectedLocation,
        siteSettings,
        navigation,
        footerData,
    ] = await Promise.all([
        getLocations(),
        getSelectedLocation(),
        getStoreSettings(),
        getNavigation(locale === "en" ? "en" : "vi").catch(() => null),
        getFooterData(locale === "en" ? "en" : "vi").catch(() => null),
    ]);

    const navLocations = (locations as any[]).map((l) => ({
        id: l.id,
        name: l.name,
        address: l.address,
    }));

    return (
        <>
            <SaigonNav
                locale={locale}
                locations={navLocations}
                logoUrl={siteSettings.logoUrl}
                navigationData={navigation}
                selectedLocationId={selectedLocation}
                storeName={siteSettings.name}
            />
            <SaigonMainWrapper>{props.children}</SaigonMainWrapper>
            <SaigonFooter footerData={footerData} locale={locale} />
            <SaigonBackToTop />
            <StickyContactWrapper />
        </>
    );
}
