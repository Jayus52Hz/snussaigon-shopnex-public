import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { payloadSdk } from "@/utils/payload-sdk";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default async function Footer({
    storeSettings,
    footerData,
}: {
    storeSettings: any;
    footerData?: any;
}) {
    const locale = await getLocale();
    const dict = dictionaries[locale];
    const isEn = locale === "en";

    // Fetch collections for the collections column
    const collectionsPayload = await payloadSdk
        .find({ collection: "collections" as any, limit: 6, sort: "createdAt" })
        .catch(() => ({ docs: [] }));
    const collections = collectionsPayload.docs || [];

    // ── CMS footer data ──────────────────────────────────────────────────────
    const cms = footerData || {};

    const description = cms.description ||
        (isEn
            ? "Official nicotine pouch distributor in HCMC — same-day delivery — 100% authentic guarantee."
            : "Đại lý nicotine pouches chính thức tại TP.HCM — giao hàng trong ngày — 100% cam kết chính hãng.");

    const address = cms.address ||
        (isEn ? "Thu Duc, Ho Chi Minh City" : "Thủ Đức, TP. Hồ Chí Minh");

    const phone = cms.phone || "0896 561 023";
    const email = cms.email || "contact@snussaigon.com";
    const facebook = cms.facebook || "https://facebook.com/snussaigon";
    const instagram = cms.instagram || "https://instagram.com/snussaigon";

    const bottomText = cms.bottomText ||
        `© ${new Date().getFullYear()} ${storeSettings?.name || "Snus Sai Gon"}. ${dict.footer.allRightsReserved}`;

    // CMS columns (custom link columns)
    const cmsColumns: any[] = cms.columns || [];

    return (
        <footer className="bg-[#0a0a1a] text-white">
            {/* Nicotine Warning */}
            <div className="bg-red-600 text-white py-2.5 text-center text-xs sm:text-sm font-medium">
                {isEn
                    ? "Warning: Products are only for adults 18+."
                    : "Cảnh báo: Sản phẩm chỉ dành cho người trên 18 tuổi."}
            </div>

            <div className="content-container py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    {/* ── Col 1: Brand info ──────────────────────────────────── */}
                    <div className="col-span-2 md:col-span-1">
                        <Link className="inline-block mb-4" href={isEn ? "/en" : "/"}>
                            <span className="text-xl font-bold">
                                {storeSettings?.name || "Snus Sai Gon"}
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm mb-4 leading-relaxed">
                            {description}
                        </p>
                        <div className="flex gap-3">
                            {facebook && (
                                <a
                                    aria-label="Facebook"
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    href={facebook}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            {instagram && (
                                <a
                                    aria-label="Instagram"
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    href={instagram}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ── Col 2: Collections (from CMS products) ────────────── */}
                    {collections.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-4 text-sm">
                                {isEn ? "Collections" : "Bộ Sưu Tập"}
                            </h3>
                            <ul className="space-y-2">
                                {collections.map((c: any) => (
                                    <li key={c.id}>
                                        <Link
                                            className="text-sm text-white/60 hover:text-white transition-colors"
                                            href={`${isEn ? "/en" : ""}/snus-${c.handle}`}
                                        >
                                            {c.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── CMS custom columns ────────────────────────────────── */}
                    {cmsColumns.map((col: any) => (
                        <div key={col.id}>
                            <h3 className="font-semibold mb-4 text-sm">
                                {col.title || ""}
                            </h3>
                            <ul className="space-y-2">
                                {(col.links || []).map((link: any) => (
                                    <li key={link.id}>
                                        <Link
                                            className="text-sm text-white/60 hover:text-white transition-colors"
                                            href={link.url?.startsWith("/") ? `${isEn ? "/en" : ""}${link.url}` : (link.url || "#")}
                                            target={link.newTab ? "_blank" : undefined}
                                            rel={link.newTab ? "noopener noreferrer" : undefined}
                                        >
                                            {link.label || ""}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* ── Col: Contact (always shown) ───────────────────────── */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm">
                            {dict.footer.contactInfo}
                        </h3>
                        <ul className="space-y-3 text-sm text-white/60">
                            {email && (
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                                        {email}
                                    </a>
                                </li>
                            )}
                            {phone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <a
                                        className="hover:text-white transition-colors"
                                        href={`tel:${phone.replace(/\s/g, "")}`}
                                    >
                                        {phone}
                                    </a>
                                </li>
                            )}
                            {address && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>{address}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* ── Bottom bar ─────────────────────────────────────────────── */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/50">{bottomText}</p>
                </div>
            </div>
        </footer>
    );
}
