import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default async function Footer({
    footerData,
    storeSettings,
}: {
    footerData: any;
    storeSettings: any;
}) {
    const locale = await getLocale();
    const dict = dictionaries[locale];
    const isEn = locale === "en";

    const columns = footerData?.columns?.length
        ? footerData.columns
        : [];

    const socialLinks = storeSettings?.social || {};
    const contact = storeSettings?.contact || {};
    const showSocial = footerData?.showSocialLinks ?? true;
    const bottomText = footerData?.bottomText || `© ${new Date().getFullYear()} ${storeSettings?.name || "Snus Sai Gon"}. ${dict.footer.allRightsReserved}`;
    const legalLinks = footerData?.legalLinks?.length ? footerData.legalLinks : [];

    return (
        <footer className="bg-[#0a0a1a] text-white">
            <div className="bg-red-600 text-white py-2.5 text-center text-xs sm:text-sm font-medium">
                {isEn
                    ? "Warning: Products are only for adults 18+."
                    : "Cảnh báo: Sản phẩm chỉ dành cho người trên 18 tuổi."}
            </div>

            <div className="content-container py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link className="inline-block mb-4" href="/">
                            <span className="text-xl font-bold">
                                {storeSettings?.name || "Snus Sai Gon"}
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm mb-4 leading-relaxed">
                            {isEn
                                ? "Official Engupouches nicotine pouch distributor in HCMC — same-day delivery within Saigon — 100% authentic guarantee."
                                : "Đại lý nicotine pouches chính thức của Engupouches tại TP.HCM — giao hàng trong ngày nội thành Sài Gòn - 100% cam kết sản phẩm chính hãng."}
                        </p>
                        {showSocial && (
                            <div className="flex gap-3">
                                {socialLinks.facebook && (
                                    <a
                                        aria-label="Facebook"
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        href={socialLinks.facebook}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Facebook className="h-4 w-4" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a
                                        aria-label="Instagram"
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        href={socialLinks.instagram}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Instagram className="h-4 w-4" />
                                    </a>
                                )}
                                {!socialLinks.facebook && !socialLinks.instagram && (
                                    <>
                                        <a
                                            aria-label="Facebook"
                                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                            href="https://facebook.com/snussaigon"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </a>
                                        <a
                                            aria-label="Instagram"
                                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                            href="https://instagram.com/snussaigon"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Footer Columns */}
                    {columns.map((col: any) => (
                        <div key={col.id}>
                            <h3 className="font-semibold mb-4 text-sm">{col.title}</h3>
                            <ul className="space-y-2">
                                {col.links?.map((link: any) => (
                                    <li key={link.id}>
                                        <Link
                                            className="text-sm text-white/60 hover:text-white transition-colors"
                                            href={link.url}
                                            target={link.newTab ? "_blank" : undefined}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Fallback if no CMS columns */}
                    {columns.length === 0 && (
                        <>
                            <div>
                                <h3 className="font-semibold mb-4 text-sm">
                                    {isEn ? "Policies" : "Chính Sách"}
                                </h3>
                                <ul className="space-y-2">
                                    {[
                                        { name: isEn ? "Return Policy" : "Chính Sách Đổi Trả", href: "/policy/chinh-sach-doi-tra" },
                                        { name: isEn ? "Warranty Policy" : "Chính Sách Bảo Hành", href: "/policy/chinh-sach-bao-hanh" },
                                        { name: isEn ? "Shipping Policy" : "Chính Sách Vận Chuyển", href: "/policy/chinh-sach-van-chuyen" },
                                        { name: isEn ? "Terms of Service" : "Điều Khoản Dịch Vụ", href: "/policy/dieu-khoan-dich-vu" },
                                    ].map((link) => (
                                        <li key={link.name}>
                                            <Link className="text-sm text-white/60 hover:text-white transition-colors" href={link.href}>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4 text-sm">
                                    {isEn ? "Collections" : "Bộ Sưu Tập"}
                                </h3>
                                <ul className="space-y-2">
                                    <li><Link className="text-sm text-white/60 hover:text-white transition-colors" href="/snus">{isEn ? "All Products" : "Tất cả sản phẩm"}</Link></li>
                                    <li><Link className="text-sm text-white/60 hover:text-white transition-colors" href="/snus">{isEn ? "Promotions" : "Khuyến mãi"}</Link></li>
                                    <li><Link className="text-sm text-white/60 hover:text-white transition-colors" href="/snus">{isEn ? "Brands" : "Thương hiệu"}</Link></li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/50">{bottomText}</p>
                    {legalLinks.length > 0 && (
                        <div className="flex gap-4">
                            {legalLinks.map((link: any) => (
                                <Link
                                    className="text-xs text-white/50 hover:text-white transition-colors"
                                    href={link.url}
                                    key={link.id}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
