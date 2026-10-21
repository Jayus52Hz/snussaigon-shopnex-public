import type { Metadata } from "next";

import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import SaigonAbout from "@/components/about/saigon-about";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://snussaigon.com";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isEn = locale === "en";
    const title = isEn
        ? "About Us — Snus Sai Gon"
        : "Về chúng tôi — Snus Sai Gon";
    const description = isEn
        ? "How Snus Sai Gon began, what we believe in, and how we serve HCMC's smokeless community."
        : "Câu chuyện Snus Sai Gon — vì sao chúng tôi bắt đầu, niềm tin và cách phục vụ cộng đồng không khói tại TP.HCM.";
    return buildMetadata({
        path: "/about",
        locale,
        fallbackTitle: title,
        fallbackDescription: description,
    });
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    const locale = await getLocale();
    return <SaigonAbout locale={locale === "en" ? "en" : "vi"} />;
}
