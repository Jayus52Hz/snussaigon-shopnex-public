"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

import { useLocale } from "@/i18n/locale-provider";
import SaigonSectionLabel from "./saigon-section-label";

const STORE_ADDRESS = "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây, TP. Hồ Chí Minh";
const STORE_HOTLINE = "0896 561 023";
const STORE_HOTLINE_TEL = "+84896561023";

const T = {
    vi: {
        sectionTitle: "Ghé tụi mình",
        sectionLink: "Mở Google Maps",
        storeName: "Snus Sai Gon",
        storeSubname: "Engu Pouches",
        addressLabel: "Địa chỉ cửa hàng",
        hotlineLabel: "Hotline / Zalo",
        hoursLabel: "Giờ phục vụ",
        hoursValue: "Hằng ngày · 9:00 – 22:00",
        hoursNote: "Ship trong ngày trước 17:00",
        directions: "Chỉ đường",
    },
    en: {
        sectionTitle: "Visit us",
        sectionLink: "Open Google Maps",
        storeName: "Snus Sai Gon",
        storeSubname: "Engu Pouches",
        addressLabel: "Store address",
        hotlineLabel: "Hotline / Zalo",
        hoursLabel: "Opening hours",
        hoursValue: "Daily · 9:00 AM – 10:00 PM",
        hoursNote: "Same-day delivery before 5pm",
        directions: "Get directions",
    },
};

const MAP_SRC =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4240.692474517661!2d106.7174739!3d10.7963005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ba50e11fbd%3A0x7fdc0bc1a3782977!2sSnus%20Sai%20Gon%20-%20Engu%20Pouches!5e1!3m2!1sen!2s!4v1781869552578!5m2!1sen!2s";
const MAP_LINK = "https://maps.app.goo.gl/rczGiRmSjEK22WHC9";

export default function SaigonMap() {
    const { locale } = useLocale();
    const t = T[locale === "en" ? "en" : "vi"];
    const [mapLoaded, setMapLoaded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setMapLoaded(true); },
            { rootMargin: "300px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="bg-saigon-bg py-14 md:py-20">
            <div className="content-container">
                <SaigonSectionLabel
                    href={MAP_LINK}
                    linkText={t.sectionLink}
                    title={t.sectionTitle}
                />

                <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-[1fr_2fr] md:gap-8">
                    {/* Info block */}
                    <div className="flex flex-col gap-4 rounded-xl bg-saigon-navy p-5 text-white md:rounded-2xl md:p-8">
                        <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                            {t.storeName}
                            <br />
                            <span className="text-saigon-lime">{t.storeSubname}</span>
                        </h3>

                        <div className="mt-2 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saigon-lime" />
                                <div>
                                    <p className="font-display text-xs uppercase tracking-[0.1em] text-white/60">
                                        {t.addressLabel}
                                    </p>
                                    <p className="font-body mt-1 text-sm text-white/90">
                                        {STORE_ADDRESS}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-saigon-lime" />
                                <div>
                                    <p className="font-display text-xs uppercase tracking-[0.1em] text-white/60">
                                        {t.hotlineLabel}
                                    </p>
                                    <a
                                        className="font-body mt-1 inline-block text-sm font-semibold text-white transition-opacity hover:opacity-80"
                                        href={`tel:${STORE_HOTLINE_TEL}`}
                                    >
                                        {STORE_HOTLINE}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-saigon-lime" />
                                <div>
                                    <p className="font-display text-xs uppercase tracking-[0.1em] text-white/60">
                                        {t.hoursLabel}
                                    </p>
                                    <p className="font-body mt-1 text-sm text-white/90">
                                        {t.hoursValue}
                                        <br />
                                        {t.hoursNote}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            className="font-display mt-4 inline-flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-saigon-base transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                            href={MAP_LINK}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {t.directions} <span aria-hidden>↗</span>
                        </a>
                    </div>

                    {/* Map embed — lazy loaded when section enters viewport */}
                    <div className="relative overflow-hidden rounded-xl border border-saigon-black/10 md:rounded-2xl">
                        {mapLoaded ? (
                            <iframe
                                allowFullScreen
                                className="block h-[320px] w-full md:h-[450px]"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={MAP_SRC}
                                style={{ border: 0 }}
                                title="Snus Sai Gon - Engu Pouches"
                            />
                        ) : (
                            <div className="h-[320px] w-full animate-pulse rounded-xl bg-saigon-black/10 md:h-[450px]" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
