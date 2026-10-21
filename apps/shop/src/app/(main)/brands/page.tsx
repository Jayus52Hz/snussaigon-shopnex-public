import type { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import BrandDirectory from "@/components/brand-directory";
import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { localizePath } from "@/i18n/locale-paths";
import { getSelectedLocation } from "@/i18n/location";
import { getBrandDirectory } from "@/services/brands";
import { buildMetadata } from "@/utils/build-metadata";
import { generateBrandListSchema } from "@/utils/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const seo = dictionaries[locale].seo;
    return buildMetadata({
        path: "/brands",
        locale,
        fallbackTitle: seo.brandsTitle,
        fallbackDescription: seo.brandsDescription,
    });
}

export const dynamic = "force-dynamic";

/**
 * /brands — danh bạ toàn bộ thương hiệu (term của attribute "brand"), kể cả
 * brand chỉ có sản phẩm hết hàng / chưa kinh doanh. Trang chi tiết vẫn là
 * /snus-{slug}.
 */
export default async function BrandsPage() {
    const locale = await getLocale();
    const selectedLocation = await getSelectedLocation();
    const dict = dictionaries[locale];
    const t = dict.brands;
    const brands = await getBrandDirectory(locale, selectedLocation);

    const heading = t.heading.replace("{count}", String(brands.length));
    const schema = generateBrandListSchema({
        name: heading,
        description: dict.seo.brandsDescription,
        url: localizePath("/brands", locale),
        brands: brands.map((b) => ({
            name: b.name,
            url: localizePath(`/snus-${b.slug}`, locale),
            logo: b.logo,
            description: b.profile?.tagline,
        })),
    });

    return (
        <>
            <script
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                type="application/ld+json"
            />
            <Breadcrumbs items={[{ label: t.breadcrumb }]} />
            <div className="content-container pb-16 pt-2 md:pb-24 md:pt-4">
                <header className="max-w-3xl">
                    <h1 className="font-display text-[28px] font-bold uppercase leading-[1.1] tracking-[0.02em] text-saigon-base md:text-[40px]">
                        {heading}
                    </h1>
                    <p className="mt-3 font-body text-[15px] leading-[1.6] text-saigon-grey md:text-[16px]">
                        {t.intro}
                    </p>
                </header>
                <div className="mt-8">
                    <BrandDirectory brands={brands} />
                </div>
            </div>
        </>
    );
}
