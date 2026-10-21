"use client";

import { useLocale } from "@/i18n/locale-provider";
import { getFAQs } from "@/services/homepage";
import type { FAQItem } from "@/types/homepage";
import { cn } from "@/utils";
import {
    Beaker,
    ChevronDown,
    CircleDot,
    FlaskConical,
    Globe,
    HelpCircle,
    Info,
    Leaf,
    Package,
    Ruler,
    ShieldCheck,
    Truck,
    Weight,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProductDocuments from "@/components/products/product-documents";

type ProductTabsProps = {
    product: any;
};

export default function ProductTabs({ product }: ProductTabsProps) {
    const { dict, locale } = useLocale();
    // Tech specs grouped
    const genInfo = dict.product;
    const isEn = locale === "en";

    // Nhãn attribute đã resolve tên từ CMS ở server (products.ts → getProductSpecLabels).
    // SSR ra đúng tên ngay, không nháy. Fallback về giá trị thô nếu thiếu.
    const spec = product.specLabels || {};

    // pouchCount từ CMS: portion_count → mapped thành pouchCount trong localizeProduct
    const pouchCount = product.pouchCount ?? product.portion_count;
    // origin từ CMS: origin_country → mapped thành origin trong localizeProduct
    const origin = spec.origin || product.origin || product.origin_country;

    const generalSpecs = [
        {
            icon: Info,
            label: genInfo.brand,
            value: spec.brand || product.brand,
        },
        {
            icon: Zap,
            label: isEn ? "Strength" : "Độ Mạnh",
            value: product.strength,
        },
        {
            icon: CircleDot,
            label: genInfo.format,
            value: spec.format || product.format,
        },
        {
            icon: Leaf,
            label: dict.common.flavor,
            value: spec.flavor || product.flavor || product.flavour,
        },
        // Nicotine mg/pouch
        product.nicotine_mg != null && {
            icon: Zap,
            label: isEn ? "Nicotine (mg/pouch)" : "Nicotine (mg/pouch)",
            value: `${product.nicotine_mg} mg`,
        },
    ].filter(Boolean).filter((s: any) => s.value) as { icon: any; label: string; value: string }[];

    const packageSpecs = [
        pouchCount && {
            icon: Package,
            label: isEn ? "Pouches/Can" : "Số pouch/hộp",
            value: `${pouchCount} ${isEn ? "pouches" : "pouches"}`,
        },
        (product.netWeight || product.weight) && {
            icon: Weight,
            label: genInfo.netWeight,
            value: spec.netWeight || product.netWeight || product.weight,
        },
        product.pouchSize && {
            icon: Ruler,
            label: genInfo.pouchSize,
            value: spec.pouchSize || product.pouchSize,
        },
        origin && {
            icon: Globe,
            label: genInfo.origin,
            value: origin,
        },
    ].filter(Boolean) as { icon: any; label: string; value: string }[];

    const chemSpecs = [
        {
            icon: FlaskConical,
            label: genInfo.nicotineType,
            value: spec.nicotineType || product.nicotineType,
        },
        {
            icon: Beaker,
            label: genInfo.pH,
            value: product.ph,
        },
        {
            icon: Leaf,
            label: genInfo.ingredients,
            value: product.ingredients,
        },
    ].filter((s) => s.value);

    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    useEffect(() => {
        getFAQs().then((data) => setFaqs(data)).catch(() => {});
    }, []);

    return (
        <div className="mt-6 border-t border-gray-200">
            <AccordionItem defaultOpen title={dict.product.productInfo}>
                <SpecsTable specs={[...generalSpecs, ...packageSpecs, ...chemSpecs]} />
            </AccordionItem>

            {/* Product Documents */}
            {product.productDocuments?.length > 0 && (
                <AccordionItem title={dict.product.productDocuments}>
                    <ProductDocuments documents={product.productDocuments} />
                </AccordionItem>
            )}

            {/* Shipping */}
            <AccordionItem title={dict.product.aboutShipping}>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <Truck className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {isEn ? "Fast Shipping" : "Giao hàng nhanh"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {dict.product.aboutShippingDesc}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {dict.product.easyReturns}
                            </p>
                            <p className="text-sm text-gray-500">
                                {dict.product.easyReturnsDesc}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Package className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {dict.product.qualityGuarantee}
                            </p>
                            <p className="text-sm text-gray-500">
                                {dict.product.qualityGuaranteeDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* FAQ */}
            <AccordionItem title={dict.product.faq}>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FaqItem
                            answer={isEn && faq.answer_en ? faq.answer_en : faq.answer}
                            key={i}
                            question={isEn && faq.question_en ? faq.question_en : faq.question}
                        />
                    ))}
                </div>
            </AccordionItem>
        </div>
    );
}

function SpecsTable({
    specs,
}: {
    specs: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];
}) {
    return (
        <div className="border border-gray-100 rounded-lg overflow-hidden">
            {specs.map((spec, i) => (
                <div
                    className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        i < specs.length - 1 && "border-b border-gray-100"
                    )}
                    key={spec.label}
                >
                    <spec.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500 flex-shrink-0 w-[140px]">
                        {spec.label}
                    </span>
                    <span className="text-sm font-medium text-gray-900 text-right flex-1">
                        {spec.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

function AccordionItem({
    children,
    defaultOpen = false,
    title,
}: {
    children: React.ReactNode;
    defaultOpen?: boolean;
    title: string;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200">
            <button
                aria-expanded={open}
                className="flex items-center justify-between w-full py-4 text-left"
                onClick={() => setOpen(!open)}
                type="button"
            >
                <span className="text-sm font-semibold text-gray-900">
                    {title}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>
            {open && <div className="pb-5">{children}</div>}
        </div>
    );
}

function FaqItem({
    answer,
    question,
}: {
    answer: string;
    question: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
            <button
                aria-expanded={open}
                className="flex items-start gap-2 w-full p-3 text-left"
                onClick={() => setOpen(!open)}
                type="button"
            >
                <HelpCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-gray-900 flex-1">
                    {question}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>
            {open && (
                <p className="text-sm text-gray-500 px-3 pb-3 pl-9">
                    {answer}
                </p>
            )}
        </div>
    );
}
