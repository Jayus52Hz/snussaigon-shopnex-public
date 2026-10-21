"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
    Facebook,
    CheckCircle2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 * Contact page — static page, bilingual VI/EN.
 *
 * Sections (top → bottom):
 *   ct-hero    — eyebrow + display title + intro
 *   ct-info    — 4-card grid: hotline/zalo, email, address, hours
 *   ct-main    — 2-column: contact form (mailto) + map embed
 *   ct-cta     — final social/CTA strip (Zalo, Facebook, hotline)
 *
 * No backend wiring — form submit opens a prefilled mailto: link.
 * ──────────────────────────────────────────────────────────────────────── */

const STORE_ADDRESS = "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây, TP. Hồ Chí Minh";
const STORE_HOTLINE = "0896 561 023";
const STORE_HOTLINE_TEL = "+84896561023";
const STORE_EMAIL = "stbookstore1@gmail.com";
const ZALO_LINK = "https://zalo.me/0896561023";
const FACEBOOK_LINK = "https://facebook.com/snussaigon";
const MAP_LINK = "https://maps.app.goo.gl/rczGiRmSjEK22WHC9";
const MAP_SRC =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4240.692474517661!2d106.7174739!3d10.7963005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ba50e11fbd%3A0x7fdc0bc1a3782977!2sSnus%20Sai%20Gon%20-%20Engu%20Pouches!5e1!3m2!1sen!2s!4v1781869552578!5m2!1sen!2s";

const CONTENT = {
    vi: {
        hero: {
            eyebrow: "Liên hệ",
            titleA: "Nói chuyện",
            titleAccent: "với Snus Sai Gon.",
            titleB: "Chúng tôi trả lời nhanh, mỗi ngày.",
            body: "Có câu hỏi về sản phẩm, đơn hàng, hay muốn hợp tác? Điền form bên dưới hoặc nhắn trực tiếp qua Zalo / hotline — đội Snus Sai Gon luôn sẵn sàng.",
        },
        info: {
            heading: "Thông tin liên hệ",
            items: [
                {
                    icon: Phone,
                    label: "Hotline / Zalo",
                    value: STORE_HOTLINE,
                    href: `tel:${STORE_HOTLINE_TEL}`,
                    note: "9:00 – 22:00 hằng ngày",
                },
                {
                    icon: Mail,
                    label: "Email",
                    value: STORE_EMAIL,
                    href: `mailto:${STORE_EMAIL}`,
                    note: "Phản hồi trong 24h",
                },
                {
                    icon: MapPin,
                    label: "Địa chỉ cửa hàng",
                    value: STORE_ADDRESS,
                    href: MAP_LINK,
                    note: "Mở Google Maps",
                },
                {
                    icon: Clock,
                    label: "Giờ phục vụ",
                    value: "9:00 – 22:00",
                    note: "Ship trong ngày trước 17:00",
                },
            ],
        },
        form: {
            eyebrow: "Gửi tin nhắn",
            heading: "Để lại lời nhắn cho chúng tôi.",
            body: "Điền thông tin bên dưới — nhấn gửi sẽ mở email với nội dung đã điền sẵn.",
            nameLabel: "Họ và tên",
            namePlaceholder: "Nguyễn Văn A",
            emailLabel: "Email",
            emailPlaceholder: "ban@email.com",
            phoneLabel: "Số điện thoại",
            phonePlaceholder: "09xx xxx xxx",
            messageLabel: "Nội dung",
            messagePlaceholder: "Bạn cần hỗ trợ gì?",
            submit: "Gửi tin nhắn",
            errorRequired: "Vui lòng nhập thông tin này",
            errorEmail: "Email không hợp lệ",
            success: "Đã mở email — vui lòng nhấn gửi trong ứng dụng email của bạn.",
        },
        cta: {
            eyebrow: "Kênh nhanh hơn?",
            heading: "Nhắn Zalo, có người trả lời ngay.",
            body: "Đội ngũ Snus Sai Gon online liên tục — Zalo, Facebook hoặc gọi trực tiếp hotline.",
            zalo: "Chat Zalo",
            facebook: "Facebook",
            call: "Gọi hotline",
        },
    },
    en: {
        hero: {
            eyebrow: "Contact",
            titleA: "Let's talk",
            titleAccent: "to Snus Sai Gon.",
            titleB: "We reply fast, every day.",
            body: "Questions about products, orders, or partnerships? Fill the form below or message us directly on Zalo / hotline — the Snus Sai Gon team is always around.",
        },
        info: {
            heading: "Contact information",
            items: [
                {
                    icon: Phone,
                    label: "Hotline / Zalo",
                    value: STORE_HOTLINE,
                    href: `tel:${STORE_HOTLINE_TEL}`,
                    note: "Daily 9:00 AM – 10:00 PM",
                },
                {
                    icon: Mail,
                    label: "Email",
                    value: STORE_EMAIL,
                    href: `mailto:${STORE_EMAIL}`,
                    note: "Reply within 24h",
                },
                {
                    icon: MapPin,
                    label: "Store address",
                    value: STORE_ADDRESS,
                    href: MAP_LINK,
                    note: "Open Google Maps",
                },
                {
                    icon: Clock,
                    label: "Opening hours",
                    value: "9:00 AM – 10:00 PM",
                    note: "Same-day delivery before 5pm",
                },
            ],
        },
        form: {
            eyebrow: "Send a message",
            heading: "Leave us a message.",
            body: "Fill in the details below — submitting opens your email app with the message prefilled.",
            nameLabel: "Full name",
            namePlaceholder: "John Doe",
            emailLabel: "Email",
            emailPlaceholder: "you@email.com",
            phoneLabel: "Phone number",
            phonePlaceholder: "09xx xxx xxx",
            messageLabel: "Message",
            messagePlaceholder: "How can we help?",
            submit: "Send message",
            errorRequired: "This field is required",
            errorEmail: "Invalid email",
            success: "Email app opened — please hit send from there.",
        },
        cta: {
            eyebrow: "Need it faster?",
            heading: "Message us on Zalo, get an instant reply.",
            body: "The Snus Sai Gon team is online all day — Zalo, Facebook, or call the hotline directly.",
            zalo: "Chat on Zalo",
            facebook: "Facebook",
            call: "Call hotline",
        },
    },
};

type FormValues = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function SaigonContact({
    locale = "vi",
}: {
    locale?: "vi" | "en";
}) {
    const c = CONTENT[locale];
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        const subject = encodeURIComponent(
            `[Snus Sai Gon] Liên hệ từ ${data.name}`,
        );
        const bodyLines = [
            `${c.form.nameLabel}: ${data.name}`,
            `${c.form.emailLabel}: ${data.email}`,
            `${c.form.phoneLabel}: ${data.phone || "-"}`,
            "",
            data.message,
        ];
        const body = encodeURIComponent(bodyLines.join("\n"));
        window.location.href = `mailto:${STORE_EMAIL}?subject=${subject}&body=${body}`;
        setSent(true);
        reset();
    };

    return (
        <main data-component="sg-contact" className="bg-white text-saigon-base">
            {/* ────── HERO ────────────────────────────────────────────── */}
            <section
                data-component="sg-contact-hero"
                className="relative overflow-hidden bg-saigon-base text-white"
                ref={heroRef}
            >
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                        y: heroBgY,
                        backgroundImage:
                            "radial-gradient(circle at 20% 20%, rgba(214,61,30,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 50%)",
                    }}
                />

                <div className="content-container relative z-10 pb-24 pt-32 md:pb-36 md:pt-44">
                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-[13px] uppercase tracking-[0.32em] text-white/55"
                        initial={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        — {c.hero.eyebrow}
                    </motion.p>

                    <motion.h1
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display mt-5 max-w-[18ch] text-[44px] font-bold uppercase leading-[0.95] tracking-tight md:text-[80px] lg:text-[96px]"
                        initial={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {c.hero.titleA}{" "}
                        <span className="text-saigon-red">{c.hero.titleAccent}</span>
                    </motion.h1>

                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display mt-3 max-w-[22ch] text-[22px] font-medium uppercase leading-tight text-white/85 md:text-[32px]"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                    >
                        {c.hero.titleB}
                    </motion.p>

                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="font-body mt-8 max-w-[58ch] text-[16px] leading-relaxed text-white/75 md:text-[18px]"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        {c.hero.body}
                    </motion.p>
                </div>
            </section>

            {/* ────── CONTACT INFO CARDS ─────────────────────────────── */}
            <section
                data-component="sg-contact-info"
                className="bg-white py-16 md:py-24"
            >
                <div className="content-container">
                    <motion.h2
                        className="font-display mb-10 text-[28px] font-bold uppercase leading-[1.05] tracking-tight md:mb-14 md:text-[40px]"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        {c.info.heading}
                    </motion.h2>

                    <motion.div
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        initial="hidden"
                        transition={{ staggerChildren: 0.08 }}
                        viewport={{ once: true, amount: 0.2 }}
                        whileInView="visible"
                    >
                        {c.info.items.map((item) => {
                            const Wrapper = item.href ? "a" : "div";
                            const wrapperProps = item.href
                                ? {
                                      href: item.href,
                                      ...(item.href.startsWith("http")
                                          ? { target: "_blank", rel: "noopener noreferrer" }
                                          : {}),
                                  }
                                : {};
                            return (
                                <motion.div
                                    data-component="sg-contact-info-card"
                                    className="group flex flex-col rounded-[12px] border border-saigon-black/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-saigon-base hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-7"
                                    key={item.label}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    variants={{
                                        hidden: { opacity: 0, y: 24 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                >
                                    <span className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-saigon-black/15 bg-saigon-bg-soft text-saigon-base transition-all group-hover:border-saigon-base group-hover:bg-saigon-base group-hover:text-white">
                                        <item.icon className="h-[20px] w-[20px]" strokeWidth={2} />
                                    </span>
                                    <p className="font-display mt-5 text-[12px] uppercase tracking-[0.14em] text-saigon-grey">
                                        {item.label}
                                    </p>
                                    <Wrapper
                                        className="font-body mt-1.5 text-[15px] font-semibold leading-snug text-saigon-base transition-opacity hover:opacity-70 md:text-[16px]"
                                        {...wrapperProps}
                                    >
                                        {item.value}
                                    </Wrapper>
                                    <p className="font-body mt-2 text-[13px] text-saigon-grey">
                                        {item.note}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ────── FORM + MAP ─────────────────────────────────────── */}
            <section
                data-component="sg-contact-main"
                className="bg-saigon-bg-warm py-16 md:py-24"
            >
                <div className="content-container grid gap-10 md:grid-cols-2 md:gap-12">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, amount: 0.2 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <p className="font-display text-[13px] uppercase tracking-[0.3em] text-saigon-grey">
                            — {c.form.eyebrow}
                        </p>
                        <h2 className="font-display mt-4 text-[28px] font-bold uppercase leading-[1.05] tracking-tight md:text-[40px]">
                            {c.form.heading}
                        </h2>
                        <p className="font-body mt-4 max-w-[48ch] text-[15px] leading-relaxed text-saigon-base/75 md:text-[16px]">
                            {c.form.body}
                        </p>

                        <form
                            className="mt-8 space-y-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    className="font-display block text-[12px] uppercase tracking-[0.12em] text-saigon-grey"
                                    htmlFor="ct-name"
                                >
                                    {c.form.nameLabel}
                                </label>
                                <input
                                    className="font-body mt-2 w-full border border-saigon-black/15 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-saigon-base"
                                    id="ct-name"
                                    placeholder={c.form.namePlaceholder}
                                    type="text"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-[13px] text-saigon-red">
                                        {c.form.errorRequired}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        className="font-display block text-[12px] uppercase tracking-[0.12em] text-saigon-grey"
                                        htmlFor="ct-email"
                                    >
                                        {c.form.emailLabel}
                                    </label>
                                    <input
                                        className="font-body mt-2 w-full border border-saigon-black/15 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-saigon-base"
                                        id="ct-email"
                                        placeholder={c.form.emailPlaceholder}
                                        type="email"
                                        {...register("email", {
                                            required: true,
                                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-[13px] text-saigon-red">
                                            {errors.email.type === "pattern"
                                                ? c.form.errorEmail
                                                : c.form.errorRequired}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        className="font-display block text-[12px] uppercase tracking-[0.12em] text-saigon-grey"
                                        htmlFor="ct-phone"
                                    >
                                        {c.form.phoneLabel}
                                    </label>
                                    <input
                                        className="font-body mt-2 w-full border border-saigon-black/15 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-saigon-base"
                                        id="ct-phone"
                                        placeholder={c.form.phonePlaceholder}
                                        type="tel"
                                        {...register("phone")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    className="font-display block text-[12px] uppercase tracking-[0.12em] text-saigon-grey"
                                    htmlFor="ct-message"
                                >
                                    {c.form.messageLabel}
                                </label>
                                <textarea
                                    className="font-body mt-2 w-full resize-none border border-saigon-black/15 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-saigon-base"
                                    id="ct-message"
                                    placeholder={c.form.messagePlaceholder}
                                    rows={5}
                                    {...register("message", { required: true })}
                                />
                                {errors.message && (
                                    <p className="mt-1.5 text-[13px] text-saigon-red">
                                        {c.form.errorRequired}
                                    </p>
                                )}
                            </div>

                            <motion.button
                                className="font-display inline-flex items-center gap-2.5 bg-saigon-base px-7 py-3.5 text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-saigon-red"
                                type="submit"
                                whileTap={{ scale: 0.97 }}
                            >
                                {c.form.submit}
                                <Send className="h-4 w-4" />
                            </motion.button>

                            {sent && (
                                <motion.p
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-[14px] text-saigon-base"
                                    initial={{ opacity: 0, y: 8 }}
                                >
                                    <CheckCircle2 className="h-4 w-4 text-saigon-red" />
                                    {c.form.success}
                                </motion.p>
                            )}
                        </form>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        className="relative overflow-hidden rounded-[14px] border border-saigon-black/10"
                        initial={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, amount: 0.2 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <iframe
                            allowFullScreen
                            className="block h-[360px] w-full md:h-full md:min-h-[480px]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={MAP_SRC}
                            style={{ border: 0 }}
                            title="Snus Sai Gon - Engu Pouches"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ────── CTA / SOCIAL STRIP ─────────────────────────────── */}
            <section
                data-component="sg-contact-cta"
                className="relative overflow-hidden bg-saigon-base py-20 text-white md:py-28"
            >
                <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-saigon-red/10 blur-3xl" />

                <div className="content-container relative z-10 text-center">
                    <motion.p
                        className="font-display text-[13px] uppercase tracking-[0.3em] text-white/55"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        — {c.cta.eyebrow}
                    </motion.p>
                    <motion.h2
                        className="font-display mx-auto mt-4 max-w-[24ch] text-[32px] font-bold uppercase leading-[1.05] tracking-tight md:text-[52px]"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        {c.cta.heading}
                    </motion.h2>
                    <motion.p
                        className="font-body mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-white/75 md:text-[18px]"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        {c.cta.body}
                    </motion.p>

                    <motion.div
                        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                        initial="hidden"
                        transition={{ staggerChildren: 0.08, delayChildren: 0.15 }}
                        viewport={{ once: true }}
                        whileInView="visible"
                    >
                        <motion.a
                            className="inline-flex w-full items-center justify-center gap-2.5 border border-white bg-white px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-saigon-base transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-white sm:w-auto"
                            href={ZALO_LINK}
                            rel="noopener noreferrer"
                            target="_blank"
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <MessageCircle className="h-4 w-4" />
                            {c.cta.zalo}
                        </motion.a>
                        <motion.a
                            className="inline-flex w-full items-center justify-center gap-2.5 border border-white/40 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-0.5 hover:border-white sm:w-auto"
                            href={FACEBOOK_LINK}
                            rel="noopener noreferrer"
                            target="_blank"
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <Facebook className="h-4 w-4" />
                            {c.cta.facebook}
                        </motion.a>
                        <motion.a
                            className="inline-flex w-full items-center justify-center gap-2.5 border border-white/40 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-0.5 hover:border-white sm:w-auto"
                            href={`tel:${STORE_HOTLINE_TEL}`}
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <Phone className="h-4 w-4" />
                            {c.cta.call}
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
