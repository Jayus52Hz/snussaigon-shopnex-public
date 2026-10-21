import type { Metadata } from "next";

import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import SaigonContact from "@/components/contact/saigon-contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://snussaigon.com";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isEn = locale === "en";
    const title = isEn
        ? "Contact — Snus Sai Gon"
        : "Liên hệ — Snus Sai Gon";
    const description = isEn
        ? "Get in touch with Snus Sai Gon — hotline, Zalo, email, store address and opening hours in HCMC."
        : "Liên hệ Snus Sai Gon — hotline, Zalo, email, địa chỉ cửa hàng và giờ mở cửa tại TP.HCM.";
    return buildMetadata({
        path: "/contact",
        locale,
        fallbackTitle: title,
        fallbackDescription: description,
    });
}

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    const locale = await getLocale();
    return <SaigonContact locale={locale === "en" ? "en" : "vi"} />;
}
