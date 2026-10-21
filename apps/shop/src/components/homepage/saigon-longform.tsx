"use client";

import { motion } from "motion/react";

import { useLocale } from "@/i18n/locale-provider";
import SaigonSectionLabel from "./saigon-section-label";

/* ─────────────────────────────────────────────────────────────────────────────
 * Bilingual longform content. Stored inline (rather than in dictionaries.ts)
 * because the section is ~10 paragraphs of SEO copy — keeping it next to the
 * component makes copy-editing simpler.
 * ────────────────────────────────────────────────────────────────────────── */

const CONTENT = {
    vi: {
        sectionTitle: "Về Snus Sai Gon",
        h2: "Sài Gòn không khói — và một thế hệ mới của nicotine.",
        intro: "Snus Sai Gon ra đời từ một câu hỏi đơn giản: tại sao một thành phố năng động như Sài Gòn lại không có nơi để mua snus và nicotine pouches chính hãng một cách tử tế? Không hàng xách tay nhập nhèm, không giá thổi phồng, không phải chờ ship Bắc Âu ba tuần.",
        h3a: "Nicotine pouches là gì?",
        bodyA: "Nicotine pouches (hay còn gọi là snus trắng, white snus) là túi nhỏ chứa nicotine, hương liệu và chất độn thực vật — đặt giữa môi và lợi, không cần đốt, không khói, không tàn. Nguồn gốc từ Thuỵ Điển, lan rộng khắp Bắc Âu và đang trở thành lựa chọn của giới trẻ thành thị toàn cầu nhờ tính tiện lợi và sự kín đáo.",
        h3b: "Vì sao chọn Snus Sai Gon?",
        bullets: [
            { strong: "Chính hãng kiểm chứng:", body: "Mọi lon đều có mã lot, ngày sản xuất, xuất xứ rõ ràng. Đặt trên kệ — không phải kho hàng xách tay mơ hồ." },
            { strong: "Đủ brand, đủ flavour:", body: "VELO, ZYN, KILLA, ICEBERG, LOOP, CUBA, SIBERIA, ODEN'S, GENERAL, SKRUF, LUNDGRENS, PABLO — luôn có hàng." },
            { strong: "Ship trong ngày:", body: "Nội thành HCMC — đặt trước 5pm, nhận trong ngày. Toàn quốc 2–4 ngày, COD kiểm hàng trước khi trả tiền." },
            { strong: "Tư vấn thực sự:", body: "Đội Snus Sai Gon dùng sản phẩm hằng ngày — hỏi gì cũng có đáp án, không bị copy-paste kịch bản bán hàng." },
        ],
        h3c: "Bắt đầu thế nào nếu lần đầu thử?",
        bodyC: "Nếu bạn mới làm quen, chúng tôi khuyên bắt đầu với các sản phẩm low-strength (3–6mg) như VELO Mini Mint hay ZYN Cool Mint. Đặt pouch giữa môi trên và lợi, giữ 20–40 phút. Bạn sẽ cảm thấy hơi tê nhẹ — đó là dấu hiệu nicotine đang được hấp thụ qua niêm mạc. Đừng nhai, đừng nuốt. Sau khi dùng xong vứt vào lid của lon (có ngăn riêng cho pouch đã dùng).",
        h3d: "Cam kết của chúng tôi",
        bodyD: "Snus Sai Gon không bán cho người dưới 18 tuổi và không quảng bá nicotine như một sản phẩm \"thời trang\". Chúng tôi phục vụ cộng đồng người trưởng thành đã có thói quen sử dụng nicotine, và cung cấp một lựa chọn không khói — tiện hơn, kín đáo hơn, sạch hơn so với hút thuốc lá truyền thống. Sản phẩm có hàm lượng nicotine khác nhau, vui lòng đọc kỹ trước khi sử dụng.",
        quoteA: '"Smokeless vibe.',
        quoteAccent: "Saigon spirit.",
        quoteB: '" — Đó không phải tagline, đó là cách chúng tôi sống ở thành phố này.',
        stats: [
            { value: "12+", label: "Thương hiệu chính hãng" },
            { value: "150+", label: "Flavour đang có hàng" },
            { value: "5h", label: "Ship trung bình HCMC" },
            { value: "10K+", label: "Khách đã phục vụ" },
        ],
    },
    en: {
        sectionTitle: "About Snus Sai Gon",
        h2: "Smokeless Saigon — a new generation of nicotine.",
        intro: "Snus Sai Gon started from one simple question: why doesn't a city as dynamic as Saigon have a proper place to buy authentic snus and nicotine pouches? No murky grey-market imports, no inflated prices, no three-week wait for Nordic shipping.",
        h3a: "What are nicotine pouches?",
        bodyA: "Nicotine pouches (also called white snus) are small pouches containing nicotine, flavouring, and plant-based fillers — placed between your lip and gum. No burning, no smoke, no ash. Originating in Sweden, they've spread across Scandinavia and are becoming the preferred choice for urban adults worldwide thanks to their convenience and discretion.",
        h3b: "Why choose Snus Sai Gon?",
        bullets: [
            { strong: "Verified authentic:", body: "Every can has batch codes, production dates, and clear origin. Off the shelf — not from some hazy grey-market warehouse." },
            { strong: "Every brand, every flavour:", body: "VELO, ZYN, KILLA, ICEBERG, LOOP, CUBA, SIBERIA, ODEN'S, GENERAL, SKRUF, LUNDGRENS, PABLO — always in stock." },
            { strong: "Same-day delivery:", body: "HCMC inner-city — order before 5pm, get it the same day. Nationwide 2–4 days, COD with inspection before payment." },
            { strong: "Real advice:", body: "The Snus Sai Gon team uses these products every day — ask anything, no copy-paste sales scripts." },
        ],
        h3c: "How do I start as a first-timer?",
        bodyC: "If you're new, we recommend starting with low-strength products (3–6mg) like VELO Mini Mint or ZYN Cool Mint. Place the pouch between your upper lip and gum, hold for 20–40 minutes. You'll feel a slight tingle — that's the nicotine being absorbed through the mucous membrane. Don't chew, don't swallow. When done, dispose of it in the can's lid (which has a separate compartment for used pouches).",
        h3d: "Our commitment",
        bodyD: 'Snus Sai Gon does not sell to anyone under 18 and does not promote nicotine as a "fashion" product. We serve a community of adults with existing nicotine habits, and offer a smokeless alternative — more convenient, more discreet, cleaner than traditional cigarettes. Products contain varying nicotine strengths; please read labels carefully before use.',
        quoteA: '"Smokeless vibe.',
        quoteAccent: "Saigon spirit.",
        quoteB: '" — Not a tagline. That\'s how we live in this city.',
        stats: [
            { value: "12+", label: "Authentic brands" },
            { value: "150+", label: "Flavours in stock" },
            { value: "5h", label: "Avg. delivery HCMC" },
            { value: "10K+", label: "Customers served" },
        ],
    },
};

export type SaigonStat = { value: string; label: string };

export default function SaigonLongform({
    stats,
}: {
    stats?: SaigonStat[];
} = {}) {
    const { locale } = useLocale();
    const base = CONTENT[locale === "en" ? "en" : "vi"];
    // CMS-managed stats (Homepage Stats) override the inline fallback when present.
    const c = {
        ...base,
        stats: stats && stats.length > 0 ? stats : base.stats,
    };

    // overflow-x-clip trên <section>: chứa phần "tràn" 20px của entrance-animation
    // (initial x:20) ở stat card cột phải trên mobile — fix tràn ngang TẠI NGUỒN,
    // scope trong section (KHÔNG đụng body → giữ nguyên swipe-back mặc định).
    return (
        <section className="overflow-x-clip bg-saigon-bg py-14 md:py-20">
            <div className="content-container">
                <SaigonSectionLabel title={c.sectionTitle} />

                <motion.div
                    className="mt-6 grid gap-10 md:mt-8 md:grid-cols-[2fr_1fr] md:gap-16"
                    initial={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ amount: 0.2, once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    {/* Main copy */}
                    <article className="font-body prose prose-neutral max-w-none text-saigon-black">
                        <h2 className="font-display text-[28px] font-bold uppercase leading-tight tracking-tight text-saigon-base md:text-[42px]">
                            {c.h2}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-saigon-black/85 md:mt-5 md:text-xl">
                            {c.intro}
                        </p>

                        <h3 className="font-display mt-8 text-xl font-bold uppercase tracking-tight text-saigon-base md:mt-10 md:text-2xl">
                            {c.h3a}
                        </h3>
                        <p className="mt-3 leading-relaxed text-saigon-black/80">
                            {c.bodyA}
                        </p>

                        <h3 className="font-display mt-8 text-xl font-bold uppercase tracking-tight text-saigon-base md:mt-10 md:text-2xl">
                            {c.h3b}
                        </h3>
                        <ul className="mt-3 space-y-3 leading-relaxed text-saigon-black/80">
                            {c.bullets.map((b) => (
                                <li key={b.strong}>
                                    <strong className="text-saigon-base">
                                        {b.strong}
                                    </strong>{" "}
                                    {b.body}
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-display mt-8 text-xl font-bold uppercase tracking-tight text-saigon-base md:mt-10 md:text-2xl">
                            {c.h3c}
                        </h3>
                        <p className="mt-3 leading-relaxed text-saigon-black/80">
                            {c.bodyC}
                        </p>

                        <h3 className="font-display mt-8 text-xl font-bold uppercase tracking-tight text-saigon-base md:mt-10 md:text-2xl">
                            {c.h3d}
                        </h3>
                        <p className="mt-3 leading-relaxed text-saigon-black/80">
                            {c.bodyD}
                        </p>

                        <p className="font-display mt-10 border-l-[3px] border-saigon-red pl-[18px] text-[20px] font-semibold uppercase leading-snug tracking-tight text-saigon-base md:mt-12 md:pl-[22px] md:text-2xl">
                            {c.quoteA}{" "}
                            <span className="text-saigon-red">
                                {c.quoteAccent}
                            </span>
                            {c.quoteB}
                        </p>
                    </article>

                    {/* Side stats: 2-col grid mobile, vertical stack on desktop */}
                    <aside className="grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-6">
                        {c.stats.map((stat) => (
                            <motion.div
                                className="border border-saigon-black/10 border-l-[3px] border-l-saigon-base bg-white p-4 md:p-6"
                                initial={{ opacity: 0, x: 20 }}
                                key={stat.label}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                whileInView={{ opacity: 1, x: 0 }}
                            >
                                <p className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-saigon-base md:text-5xl">
                                    {stat.value}
                                </p>
                                <p className="font-body mt-2 text-[11px] uppercase tracking-[0.08em] text-saigon-grey md:text-sm">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </aside>
                </motion.div>
            </div>
        </section>
    );
}
