import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import type React from "react";

import NavigationProgress from "@/components/navigation-progress";
import { LocaleProvider } from "@/i18n/locale-provider";
import { getLocale } from "@/i18n/locale";
import { Providers } from "@/providers/providers";
import { getStoreSettings } from "@/services/store-settings";

const beVietnamPro = Be_Vietnam_Pro({
    display: "swap",
    subsets: ["latin", "latin-ext", "vietnamese"],
    variable: "--font-vietnam",
    weight: ["400", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://snussaigon.com";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getStoreSettings();
    const faviconUrl = settings.faviconUrl || "/favicon.ico";
    const ogImageUrl = settings.ogImageUrl;
    const title = "SnusSaigon - Snus & Nicotine Pouch Chính Hãng";
    const description =
        "SnusSaigon - Cửa hàng snus & nicotine pouch chính hãng tại TP.HCM. Giao hàng nhanh, COD toàn quốc.";
    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
        },
        openGraph: {
            title,
            description,
            siteName: "Snus Sai Gon",
            locale: "vi_VN",
            type: "website",
            ...(ogImageUrl
                ? {
                      images: [
                          {
                              url: ogImageUrl,
                              width: 1200,
                              height: 630,
                              alt: "Snus Sai Gon — Smokeless vibe. Saigon spirit.",
                          },
                      ],
                  }
                : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default async function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props;
    const locale = await getLocale();

    return (
        <html
            className={beVietnamPro.variable}
            data-mode="light"
            lang={locale === "en" ? "en" : "vi"}
        >
            <body>
                <LocaleProvider locale={locale}>
                    <Providers>
                        <NavigationProgress />
                        <main className="relative">{children}</main>
                    </Providers>
                </LocaleProvider>
                {/* Google Tag Manager — inline loader đặt sớm trong <head>
                    (beforeInteractive) đúng kiểu cài chuẩn của GTM. gtm.js vẫn
                    tải async nên không chặn render đáng kể. */}
                <Script
                    id="gtm"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5SHVX3SS');`,
                    }}
                />
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-5SHVX3SS"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                        title="gtm-noscript"
                    />
                </noscript>
            </body>
        </html>
    );
}
