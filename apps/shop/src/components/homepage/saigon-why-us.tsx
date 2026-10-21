import {
    Package,
    CheckCircle2,
    Zap,
    Shield,
    Star,
    Truck,
    Gem,
    Target,
    type LucideIcon,
} from "lucide-react";

export type SaigonWhyUsItem = {
    iconName?: string;
    title: string;
    body: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
    Package,
    CheckCircle2,
    Zap,
    Shield,
    Star,
    Truck,
    Gem,
    Target,
};

const FALLBACK_REASONS: SaigonWhyUsItem[] = [
    {
        iconName: "Package",
        title: "Chính hãng 100%",
        body: "Nhập khẩu trực tiếp từ Scandinavian. Không hàng trôi nổi, không hàng giả.",
    },
    {
        iconName: "CheckCircle2",
        title: "Đủ brand đủ vị",
        body: "12+ thương hiệu: VELO, ZYN, KILLA, ICEBERG, LOOP, CUBA và nhiều hơn nữa.",
    },
    {
        iconName: "Zap",
        title: "Ship nhanh trong ngày",
        body: "Nội thành HCMC — đặt trước 5pm, nhận trong ngày. Toàn quốc 2–4 ngày, COD.",
    },
];

export default function SaigonWhyUs({
    items,
    eyebrow,
}: {
    items?: SaigonWhyUsItem[];
    eyebrow?: string;
} = {}) {
    const REASONS = (items && items.length > 0 ? items : FALLBACK_REASONS).map(
        (item) => ({
            ...item,
            Icon: ICON_MAP[item.iconName || "Package"] || Package,
        })
    );
    const eyebrowText = eyebrow || "Tại sao chọn Snus Sai Gon";

    // Dải viền mảnh kiểu vinapouches: gap-px trên nền white/15 tạo đường kẻ 1px
    // giữa các ô ở mọi bố cục cột. 4 mục → 1/2/4 cột, còn lại → 1/3 cột.
    const gridCols =
        REASONS.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

    return (
        <section className="relative overflow-hidden bg-saigon-base py-10 md:py-14">
            <div className="content-container relative z-10">
                <div className="mb-6 flex justify-center md:mb-8">
                    <span className="inline-block rounded-full border border-white/18 bg-white/[0.06] px-[18px] py-1.5 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white/90">
                        {eyebrowText}
                    </span>
                </div>

                <div
                    className={`grid grid-cols-1 gap-px border border-white/15 bg-white/15 ${gridCols}`}
                >
                    {REASONS.map((r) => (
                        <div
                            className="group flex items-start gap-4 bg-saigon-base px-5 py-6 md:py-7"
                            key={r.title}
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.05] text-white transition-all group-hover:border-white group-hover:bg-white group-hover:text-saigon-base">
                                <r.Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-display text-[15px] font-bold uppercase tracking-tight text-white">
                                    {r.title}
                                </h3>
                                <p className="font-body mt-1 text-[13px] leading-relaxed text-white/70">
                                    {r.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
