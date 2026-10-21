"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
    ShieldCheck,
    Sparkles,
    Truck,
    HandHeart,
    MapPin,
    Phone,
} from "lucide-react";
import { useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * About Us — static page, bilingual VI/EN.
 *
 * Sections (top → bottom):
 *   ab-hero      — eyebrow + display title + mission statement + CTA
 *   ab-story     — 2-column narrative + side stat strip
 *   ab-values    — 4-card values grid (mono palette, mirrors WhyUs)
 *   ab-timeline  — vertical timeline of 4 milestones
 *   ab-pledge    — quote block + signature
 *   ab-cta       — final contact block (address + phone + CTA)
 *
 * Data convention: each section pulls from CONTENT[locale]. Switching languages
 * is a no-op rerender — animations re-trigger only on first scroll-into-view.
 * ──────────────────────────────────────────────────────────────────────── */

const STORE_ADDRESS = "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây, TP. Hồ Chí Minh";
const STORE_HOTLINE = "0896 561 023";
const STORE_HOTLINE_TEL = "+84896561023";
const MAP_LINK = "https://maps.app.goo.gl/rczGiRmSjEK22WHC9";

const CONTENT = {
    vi: {
        hero: {
            eyebrow: "Về chúng tôi",
            titleA: "Saigon",
            titleAccent: "không khói.",
            titleB: "Một thế hệ mới của nicotine.",
            body: "Snus Sai Gon ra đời để đem nicotine pouches chính hãng đến cộng đồng người trưởng thành tại TP.HCM — minh bạch về nguồn gốc, công khai về giá, và ship trong ngày cho người Sài Gòn.",
            ctaLabel: "Khám phá sản phẩm",
            ctaLinkLabel: "Ghé cửa hàng",
        },
        story: {
            eyebrow: "Câu chuyện",
            heading: "Bắt đầu từ một câu hỏi đơn giản.",
            paragraphs: [
                "Tại sao một thành phố năng động như Sài Gòn không có nơi nào để mua snus và nicotine pouches chính hãng một cách tử tế? Không hàng xách tay nhập nhèm. Không giá thổi phồng. Không phải chờ ship Bắc Âu ba tuần.",
                "2025, Snus Sai Gon được dựng lên giữa Thạnh Mỹ Tây — một góc nhỏ, không ồn ào, nhưng đủ để bắt đầu. Chúng tôi nhập trực tiếp từ Scandinavian, tự gắn tem, tự ghi lot, tự chịu trách nhiệm cho từng lon đi ra cửa.",
                "Hôm nay, chúng tôi phục vụ hơn 10,000 khách hàng — phần lớn là người Sài Gòn — bằng cùng một niềm tin: nicotine không khói nên dễ tiếp cận, dễ kiểm chứng, và dễ tin tưởng.",
            ],
            stats: [
                { value: "2025", label: "Bắt đầu" },
                { value: "12+", label: "Thương hiệu chính hãng" },
                { value: "10K+", label: "Khách hàng phục vụ" },
                { value: "5h", label: "Ship trung bình HCMC" },
            ],
        },
        values: {
            eyebrow: "Niềm tin",
            heading: "Bốn nguyên tắc dẫn lối.",
            items: [
                {
                    icon: ShieldCheck,
                    title: "Minh bạch tuyệt đối",
                    body: "Mọi lon đều có mã lot, ngày sản xuất, xuất xứ rõ ràng. Bạn quét được, tra được — chúng tôi không có gì để giấu.",
                },
                {
                    icon: Sparkles,
                    title: "Đa dạng có chọn lọc",
                    body: "12+ thương hiệu, 150+ flavour. Mỗi sản phẩm phải đi qua bàn của đội Snus Sai Gon trước khi lên kệ.",
                },
                {
                    icon: Truck,
                    title: "Nhanh là tôn trọng",
                    body: "Nội thành HCMC: đặt trước 5pm — giao trong ngày. Tỉnh khác 2–4 ngày, COD kiểm hàng trước khi trả tiền.",
                },
                {
                    icon: HandHeart,
                    title: "Người trưởng thành, đúng nghĩa",
                    body: "Chúng tôi không bán cho người dưới 18, không quảng bá nicotine như thời trang. Phục vụ đúng người, đúng cách.",
                },
            ],
        },
        timeline: {
            eyebrow: "Hành trình",
            heading: "Từng cột mốc, từng bước.",
            items: [
                {
                    when: "Đầu 2025",
                    title: "Ý tưởng",
                    body: "Một câu hỏi đơn giản trong group chat: vì sao mua snus chính hãng ở Sài Gòn lại khó đến vậy?",
                },
                {
                    when: "Giữa 2025",
                    title: "Mở cửa",
                    box: "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây — một góc nhỏ giữa thành phố. Lô hàng đầu tiên: 6 thương hiệu, 24 flavour.",
                    body: "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây — một góc nhỏ giữa thành phố. Lô hàng đầu tiên: 6 thương hiệu, 24 flavour.",
                },
                {
                    when: "Cuối 2025",
                    title: "1,000 khách đầu",
                    body: "Ship trong ngày bắt đầu hoạt động. Khách Sài Gòn quay lại — chứng minh rằng minh bạch là chiến lược.",
                },
                {
                    when: "2026",
                    title: "Mở rộng catalog",
                    body: "12+ thương hiệu, 150+ flavour, 10K+ khách. Giao toàn quốc qua COD, đồng thời ra mắt website mới.",
                },
            ],
        },
        pledge: {
            quote: '"Smokeless vibe. Saigon spirit."',
            byline: "— Đó không phải tagline. Đó là cách chúng tôi sống ở thành phố này.",
        },
        cta: {
            eyebrow: "Ghé chúng tôi",
            heading: "Sài Gòn không khói chờ bạn.",
            body: "Đến cửa hàng, gọi điện, hoặc đặt online. Đội Snus Sai Gon có ở cả ba kênh, mỗi ngày.",
            addressLabel: "Địa chỉ",
            phoneLabel: "Hotline",
            ctaPrimary: "Đặt hàng ngay",
            ctaSecondary: "Chỉ đường",
        },
    },
    en: {
        hero: {
            eyebrow: "About us",
            titleA: "Smokeless",
            titleAccent: "Saigon.",
            titleB: "A new generation of nicotine.",
            body: "Snus Sai Gon exists to bring authentic nicotine pouches to HCMC's adult community — transparent about sourcing, open about pricing, and same-day delivery for locals.",
            ctaLabel: "Browse products",
            ctaLinkLabel: "Visit the store",
        },
        story: {
            eyebrow: "Our story",
            heading: "It started with a simple question.",
            paragraphs: [
                "Why doesn't a city as dynamic as Saigon have a proper place to buy authentic snus and nicotine pouches? No grey-market imports. No inflated prices. No three-week wait for Nordic shipping.",
                "In 2025, Snus Sai Gon opened in Thạnh Mỹ Tây — a small corner, quiet, but enough to start. We import directly from Scandinavia, stamp our own seals, log our own batches, and stand behind every can that leaves the door.",
                "Today we serve 10,000+ customers — mostly locals — with the same belief: smokeless nicotine should be accessible, verifiable, and trustworthy.",
            ],
            stats: [
                { value: "2025", label: "Founded" },
                { value: "12+", label: "Authentic brands" },
                { value: "10K+", label: "Customers served" },
                { value: "5h", label: "Avg. delivery HCMC" },
            ],
        },
        values: {
            eyebrow: "Beliefs",
            heading: "Four principles that guide us.",
            items: [
                {
                    icon: ShieldCheck,
                    title: "Radical transparency",
                    body: "Every can has batch codes, production dates, and clear origin. You can scan it, verify it — we have nothing to hide.",
                },
                {
                    icon: Sparkles,
                    title: "Curated variety",
                    body: "12+ brands, 150+ flavours. Each one goes through the Snus Sai Gon team's hands before hitting the shelf.",
                },
                {
                    icon: Truck,
                    title: "Speed as respect",
                    body: "HCMC inner-city: order before 5pm — same-day. Other provinces 2–4 days, COD with inspection before payment.",
                },
                {
                    icon: HandHeart,
                    title: "Adults, properly served",
                    body: "We don't sell to anyone under 18 and don't promote nicotine as fashion. Serving the right people, the right way.",
                },
            ],
        },
        timeline: {
            eyebrow: "The journey",
            heading: "Milestone by milestone.",
            items: [
                {
                    when: "Early 2025",
                    title: "The idea",
                    body: "One simple question in a group chat: why is buying authentic snus in Saigon so hard?",
                },
                {
                    when: "Mid 2025",
                    title: "Doors open",
                    body: "135/17/44 Nguyễn Hữu Cảnh, Thạnh Mỹ Tây — a small corner of the city. First batch: 6 brands, 24 flavours.",
                },
                {
                    when: "Late 2025",
                    title: "First 1,000 customers",
                    body: "Same-day delivery starts. Locals come back — proof that transparency is a strategy.",
                },
                {
                    when: "2026",
                    title: "Catalog expansion",
                    body: "12+ brands, 150+ flavours, 10K+ customers. Nationwide COD shipping, new website launched.",
                },
            ],
        },
        pledge: {
            quote: '"Smokeless vibe. Saigon spirit."',
            byline: "— Not a tagline. That's how we live in this city.",
        },
        cta: {
            eyebrow: "Visit us",
            heading: "Smokeless Saigon, ready when you are.",
            body: "Come to the store, call, or order online. The Snus Sai Gon team is on all three channels, every day.",
            addressLabel: "Address",
            phoneLabel: "Hotline",
            ctaPrimary: "Order now",
            ctaSecondary: "Get directions",
        },
    },
};

function localizeHref(href: string, locale: string): string {
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    if (locale !== "en") return href;
    if (href === "/" || href === "") return "/en";
    if (href.startsWith("/en/") || href === "/en") return href;
    return `/en${href.startsWith("/") ? "" : "/"}${href}`;
}

export default function SaigonAbout({
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

    return (
        <main data-component="sg-about" className="bg-white text-saigon-base">
            {/* ────── HERO ────────────────────────────────────────────── */}
            <section
                data-component="sg-about-hero"
                className="relative overflow-hidden bg-saigon-base text-white"
                ref={heroRef}
            >
                {/* Decorative gradient backdrop with parallax */}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                        y: heroBgY,
                        backgroundImage:
                            "radial-gradient(circle at 20% 20%, rgba(214,61,30,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 50%)",
                    }}
                />

                <div className="content-container relative z-10 pb-24 pt-32 md:pb-40 md:pt-44">
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
                        className="font-display mt-5 max-w-[15ch] text-[44px] font-bold uppercase leading-[0.95] tracking-tight md:text-[80px] lg:text-[96px]"
                        initial={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {c.hero.titleA}{" "}
                        <span className="text-saigon-red">
                            {c.hero.titleAccent}
                        </span>
                    </motion.h1>

                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display mt-3 max-w-[18ch] text-[22px] font-medium uppercase leading-tight text-white/85 md:text-[32px]"
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

                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.65 }}
                    >
                        <Link
                            className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-saigon-base transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-white sm:w-auto"
                            href={localizeHref("/snus", locale)}
                        >
                            {c.hero.ctaLabel}{" "}
                            <span aria-hidden>↗</span>
                        </Link>
                        <a
                            className="font-display inline-flex w-fit items-center gap-2 border-b border-white/50 pb-[2px] text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:border-white"
                            href={MAP_LINK}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {c.hero.ctaLinkLabel}{" "}
                            <span aria-hidden>↗</span>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ────── STORY + STATS ──────────────────────────────────── */}
            <section
                data-component="sg-about-story"
                className="bg-white py-20 md:py-28"
            >
                <div className="content-container">
                    <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
                        <motion.article
                            initial={{ opacity: 0, y: 24 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true, amount: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <p className="font-display text-[13px] uppercase tracking-[0.3em] text-saigon-grey">
                                — {c.story.eyebrow}
                            </p>
                            <h2 className="font-display mt-4 text-[32px] font-bold uppercase leading-[1.05] tracking-tight md:text-[48px]">
                                {c.story.heading}
                            </h2>
                            <div className="mt-8 space-y-5 font-body text-[16px] leading-[1.75] text-saigon-base/85 md:text-[17px]">
                                {c.story.paragraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </motion.article>

                        <motion.aside
                            data-component="sg-about-stats"
                            className="grid grid-cols-2 gap-3 self-start md:gap-4"
                            initial="hidden"
                            transition={{ staggerChildren: 0.08 }}
                            viewport={{ once: true, amount: 0.3 }}
                            whileInView="visible"
                        >
                            {c.story.stats.map((stat) => (
                                <motion.div
                                    className="border border-saigon-black/10 border-l-[3px] border-l-saigon-base bg-white p-5 md:p-6"
                                    key={stat.label}
                                    transition={{ duration: 0.5 }}
                                    variants={{
                                        hidden: { opacity: 0, x: 20 },
                                        visible: { opacity: 1, x: 0 },
                                    }}
                                >
                                    <p className="font-display text-[32px] font-bold uppercase leading-none tracking-tight text-saigon-base md:text-[44px]">
                                        {stat.value}
                                    </p>
                                    <p className="font-body mt-2 text-[12px] uppercase tracking-[0.08em] text-saigon-grey">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.aside>
                    </div>
                </div>
            </section>

            {/* ────── VALUES (4 cards on dark) ───────────────────────── */}
            <section
                data-component="sg-about-values"
                className="relative overflow-hidden bg-saigon-base py-20 text-white md:py-28"
            >
                <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-saigon-red/10 blur-3xl" />

                <div className="content-container relative z-10">
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <p className="font-display text-[13px] uppercase tracking-[0.3em] text-white/55">
                            — {c.values.eyebrow}
                        </p>
                        <h2 className="font-display mx-auto mt-4 max-w-[20ch] text-[32px] font-bold uppercase leading-[1.05] tracking-tight md:text-[44px]">
                            {c.values.heading}
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                        initial="hidden"
                        transition={{ staggerChildren: 0.1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        whileInView="visible"
                    >
                        {c.values.items.map((item) => (
                            <motion.div
                                data-component="sg-about-value-card"
                                className="group flex flex-col rounded-[12px] border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                                key={item.title}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                variants={{
                                    hidden: { opacity: 0, y: 28 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/25 bg-white/[0.05] text-white transition-all group-hover:border-white group-hover:bg-white group-hover:text-saigon-base">
                                    <item.icon
                                        className="h-[22px] w-[22px]"
                                        strokeWidth={2}
                                    />
                                </span>
                                <h3 className="font-display mt-5 text-[20px] font-bold uppercase tracking-tight md:text-[22px]">
                                    {item.title}
                                </h3>
                                <p className="font-body mt-3 max-w-[36ch] text-[15px] leading-relaxed text-white/70">
                                    {item.body}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ────── TIMELINE (vertical) ────────────────────────────── */}
            <section
                data-component="sg-about-timeline"
                className="bg-saigon-bg-warm py-20 md:py-28"
            >
                <div className="content-container">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <p className="font-display text-[13px] uppercase tracking-[0.3em] text-saigon-grey">
                            — {c.timeline.eyebrow}
                        </p>
                        <h2 className="font-display mt-4 max-w-[20ch] text-[32px] font-bold uppercase leading-[1.05] tracking-tight md:text-[44px]">
                            {c.timeline.heading}
                        </h2>
                    </motion.div>

                    <motion.ol
                        className="mt-12 grid gap-0 md:mt-16"
                        initial="hidden"
                        transition={{ staggerChildren: 0.12 }}
                        viewport={{ once: true, amount: 0.1 }}
                        whileInView="visible"
                    >
                        {c.timeline.items.map((item, i) => (
                            <motion.li
                                data-component="sg-about-timeline-item"
                                className="relative grid grid-cols-[80px_1fr] gap-5 border-l-2 border-saigon-base pb-12 pl-6 last:pb-0 md:grid-cols-[180px_1fr] md:gap-10"
                                key={i}
                                transition={{ duration: 0.5 }}
                                variants={{
                                    hidden: { opacity: 0, x: -16 },
                                    visible: { opacity: 1, x: 0 },
                                }}
                            >
                                {/* Marker dot */}
                                <span
                                    aria-hidden
                                    className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-saigon-base ring-4 ring-saigon-bg-warm"
                                />

                                <p className="font-display text-[13px] uppercase tracking-[0.16em] text-saigon-grey md:text-[14px]">
                                    {item.when}
                                </p>

                                <div>
                                    <h3 className="font-display text-[20px] font-bold uppercase tracking-tight md:text-[24px]">
                                        {item.title}
                                    </h3>
                                    <p className="font-body mt-2 max-w-[60ch] text-[15px] leading-relaxed text-saigon-base/80 md:text-[16px]">
                                        {item.body}
                                    </p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ol>
                </div>
            </section>

            {/* ────── PLEDGE QUOTE ───────────────────────────────────── */}
            <section
                data-component="sg-about-pledge"
                className="bg-white py-20 md:py-28"
            >
                <div className="content-container">
                    <motion.blockquote
                        className="mx-auto max-w-[72ch] border-l-[3px] border-saigon-red pl-6 md:pl-8"
                        initial={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, amount: 0.4 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <p className="font-display text-[28px] font-semibold uppercase italic leading-[1.15] tracking-tight md:text-[44px]">
                            {c.pledge.quote}
                        </p>
                        <footer className="font-body mt-4 text-[15px] text-saigon-grey md:text-[16px]">
                            {c.pledge.byline}
                        </footer>
                    </motion.blockquote>
                </div>
            </section>

            {/* ────── CTA / CONTACT ──────────────────────────────────── */}
            <section
                data-component="sg-about-cta"
                className="bg-saigon-base py-20 text-white md:py-28"
            >
                <div className="content-container">
                    <motion.div
                        className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16"
                        initial={{ opacity: 0, y: 24 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <p className="font-display text-[13px] uppercase tracking-[0.3em] text-white/55">
                                — {c.cta.eyebrow}
                            </p>
                            <h2 className="font-display mt-4 max-w-[15ch] text-[36px] font-bold uppercase leading-[1.05] tracking-tight md:text-[56px]">
                                {c.cta.heading}
                            </h2>
                            <p className="font-body mt-6 max-w-[52ch] text-[16px] leading-relaxed text-white/75 md:text-[17px]">
                                {c.cta.body}
                            </p>

                            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                                <Link
                                    className="inline-flex items-center justify-center gap-2.5 border border-white bg-white px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-saigon-base transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
                                    href={localizeHref("/snus", locale)}
                                >
                                    {c.cta.ctaPrimary}{" "}
                                    <span aria-hidden>↗</span>
                                </Link>
                                <a
                                    className="font-display inline-flex w-fit items-center gap-2 border-b border-white/50 pb-[2px] text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:border-white"
                                    href={MAP_LINK}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {c.cta.ctaSecondary}{" "}
                                    <span aria-hidden>↗</span>
                                </a>
                            </div>
                        </div>

                        <div
                            data-component="sg-about-contact-card"
                            className="flex flex-col gap-5 self-start rounded-[14px] border border-white/10 bg-white/[0.04] p-7 md:p-8"
                        >
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white/70" />
                                <div>
                                    <p className="font-display text-[12px] uppercase tracking-[0.12em] text-white/55">
                                        {c.cta.addressLabel}
                                    </p>
                                    <p className="font-body mt-1.5 text-[15px] leading-relaxed">
                                        {STORE_ADDRESS}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-white/70" />
                                <div>
                                    <p className="font-display text-[12px] uppercase tracking-[0.12em] text-white/55">
                                        {c.cta.phoneLabel}
                                    </p>
                                    <a
                                        className="font-body mt-1.5 inline-block text-[18px] font-semibold transition-opacity hover:opacity-80"
                                        href={`tel:${STORE_HOTLINE_TEL}`}
                                    >
                                        {STORE_HOTLINE}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
