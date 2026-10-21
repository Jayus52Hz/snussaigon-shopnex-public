"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";

import { useLocale } from "@/i18n/locale-provider";
import SaigonSectionLabel from "./saigon-section-label";

const T = {
    vi: {
        sectionTitle: "Câu hỏi thường gặp",
        h2a: "Còn thắc mắc?",
        h2b: "Hỏi Engu nhé.",
        body: "Không tìm thấy câu trả lời? Inbox Zalo OA — phản hồi trong 5 phút giờ hành chính.",
        cta: "Liên hệ ngay",
    },
    en: {
        sectionTitle: "Frequently asked questions",
        h2a: "Still wondering?",
        h2b: "Ask Engu.",
        body: "Can't find your answer? Message our Zalo OA — replies within 5 minutes during business hours.",
        cta: "Contact us",
    },
};

export type SaigonFaqItem = { q: string; a: string };

const FALLBACK_FAQS: SaigonFaqItem[] = [
    {
        q: "Snus và nicotine pouches có hợp pháp ở Việt Nam không?",
        a: "Nicotine pouches là sản phẩm dùng cho người trên 18 tuổi. Sản phẩm tại Snus Sai Gon được nhập khẩu chính ngạch, có chứng từ đầy đủ và tuân thủ quy định hiện hành. Chúng tôi chỉ phục vụ khách hàng đã đủ tuổi và yêu cầu xác minh khi cần thiết.",
    },
    {
        q: "Làm sao để biết hàng là chính hãng?",
        a: "Mọi sản phẩm đều có tem chống hàng giả, mã lot, ngày sản xuất rõ ràng. Bạn có thể tra mã trên website nhà sản xuất (VELO, ZYN, KILLA…) hoặc gửi ảnh mã lot cho support — chúng tôi xác minh ngay.",
    },
    {
        q: "Thời gian giao hàng tại HCMC bao lâu?",
        a: "Trong nội thành HCMC: đặt trước 5pm — giao trong cùng ngày. Đặt sau 5pm — giao sáng hôm sau. Tỉnh khác toàn quốc: 2–4 ngày qua chuyển phát nhanh.",
    },
    {
        q: "Tôi có thể đổi trả nếu mở rồi không?",
        a: "Vì lý do vệ sinh, sản phẩm đã mở seal không thể đổi trả. Tuy nhiên nếu hàng lỗi từ nhà sản xuất, hỏng móp hay sai mẫu khi giao — chúng tôi đổi miễn phí trong 7 ngày.",
    },
    {
        q: "Có thanh toán COD không?",
        a: "Có. COD áp dụng cho toàn quốc. Khách hàng kiểm hàng trước khi thanh toán cho shipper.",
    },
    {
        q: "Mua sỉ / B2B có chính sách gì?",
        a: "Chúng tôi có chính sách giá riêng cho khách sỉ từ 50 lon trở lên, hỗ trợ chia flavour theo nhu cầu, có thể giao kho hoặc kho lạnh. Liên hệ Zalo OA để được tư vấn.",
    },
];

export default function SaigonFaq({
    items,
}: {
    items?: SaigonFaqItem[];
} = {}) {
    const FAQS = items && items.length > 0 ? items : FALLBACK_FAQS;
    const [openIdx, setOpenIdx] = useState<null | number>(0);
    const { locale } = useLocale();
    const t = T[locale === "en" ? "en" : "vi"];

    return (
        <section className="bg-saigon-bg-warm py-14 md:py-20">
            <div className="content-container">
                <SaigonSectionLabel title={t.sectionTitle} />
                <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-[1fr_2fr] md:gap-16">
                    {/* Sidebar */}
                    <motion.div
                        className="md:sticky md:top-24 md:self-start"
                        initial={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            className="-ml-2"
                            transition={{
                                duration: 4.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Image
                                alt="Engu Cat thắc mắc"
                                className="h-[140px] w-[140px] md:h-[180px] md:w-[180px]"
                                height={180}
                                src="/Question-icon-v2.png"
                                width={180}
                            />
                        </motion.div>
                        <h2 className="font-display mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-saigon-base md:mt-4 md:text-[42px]">
                            {t.h2a}{" "}
                            <span className="text-saigon-red">{t.h2b}</span>
                        </h2>
                        <p className="font-body mt-4 max-w-sm text-base text-saigon-grey">
                            {t.body}
                        </p>
                        <a
                            className="font-display mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.05em] text-saigon-base hover:text-saigon-red"
                            href="https://snussaigon.com/contact"
                        >
                            {t.cta} <span aria-hidden>↗</span>
                        </a>
                    </motion.div>

                    {/* Accordion */}
                    <div className="divide-y divide-saigon-black/10 border-y border-saigon-black/10">
                        {FAQS.map((faq, i) => {
                            const open = openIdx === i;
                            return (
                                <div key={faq.q}>
                                    <button
                                        aria-controls={`faq-answer-${i}`}
                                        aria-expanded={open}
                                        className="flex w-full items-start justify-between gap-4 py-4 text-left transition-colors hover:bg-saigon-black/[0.02] md:gap-6 md:py-5"
                                        onClick={() =>
                                            setOpenIdx(open ? null : i)
                                        }
                                        type="button"
                                    >
                                        <span className="font-display text-base font-semibold uppercase leading-snug tracking-tight text-saigon-black md:text-xl">
                                            {faq.q}
                                        </span>
                                        <motion.span
                                            animate={{ rotate: open ? 45 : 0 }}
                                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saigon-navy text-white"
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                                        </motion.span>
                                    </button>
                                    {/* Answer always in DOM for SEO — hidden visually when closed */}
                                    <div
                                        id={`faq-answer-${i}`}
                                        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="font-body pb-5 pr-2 text-[15px] leading-relaxed text-saigon-grey md:pr-12 md:text-base">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
