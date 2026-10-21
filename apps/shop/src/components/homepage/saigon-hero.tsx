import Image from "next/image";
import Link from "next/link";

export type SaigonHeroContent = {
    titleA?: string;
    titleBPrefix?: string;
    titleBSuffix?: string;
    subtitle?: string;
    backgroundUrl?: string;
    ctaPrimary?: { label: string; href: string };
    ctaSecondary?: { label: string; href: string };
};

const DEFAULTS = {
    titleA: "Smokeless vibe.",
    titleBPrefix: "Saigon",
    titleBSuffix: "spirit.",
    subtitle:
        "Snus, nicotine pouch chính hãng. Flagship store tại Bình Thạnh (đối diện Vinhomes Central Park), hoặc Ship trong ngày nội thành HCMC. Sản phẩm nhập khẩu chính hãng, giá cả minh bạch.",
    backgroundUrl:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2000&auto=format&fit=crop",
    ctaPrimary: { label: "Mua ngay", href: "/snus" },
    ctaSecondary: { label: "Xem tất cả sản phẩm", href: "/snus" },
};

export default function SaigonHero({
    content,
}: {
    content?: SaigonHeroContent;
} = {}) {
    const c = {
        titleA: content?.titleA || DEFAULTS.titleA,
        titleBPrefix: content?.titleBPrefix || DEFAULTS.titleBPrefix,
        titleBSuffix: content?.titleBSuffix || DEFAULTS.titleBSuffix,
        subtitle: content?.subtitle || DEFAULTS.subtitle,
        backgroundUrl: content?.backgroundUrl || DEFAULTS.backgroundUrl,
        ctaPrimary: content?.ctaPrimary || DEFAULTS.ctaPrimary,
        ctaSecondary: content?.ctaSecondary || DEFAULTS.ctaSecondary,
    };

    return (
        <section className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-saigon-base">
            {/* Hero background — next/image with priority auto-generates the
                preload + responsive srcset (AVIF/WebP, resized per device).
                Mobile gets a ~412-640px variant instead of the 2000px original. */}
            <div aria-hidden className="absolute inset-0">
                <Image
                    alt=""
                    className="object-cover object-center"
                    fill
                    priority
                    quality={70}
                    sizes="100vw"
                    src={c.backgroundUrl}
                />
            </div>

            {/* Decorative beams — CSS animation only, no JS */}
            <div className="pointer-events-none absolute right-[8%] top-[12%] hidden h-72 w-1 origin-bottom bg-gradient-to-t from-white to-transparent opacity-0 md:block" style={{ animation: "beam 6s ease-in-out infinite" }} />
            <div className="pointer-events-none absolute left-[10%] top-[18%] hidden h-48 w-1 origin-bottom bg-gradient-to-t from-white to-transparent opacity-0 md:block" style={{ animation: "beam 8s ease-in-out 1.5s infinite" }} />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-saigon-base via-saigon-base/70 to-saigon-base/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-saigon-base/40 via-transparent to-transparent" />

            {/* HCMC label */}
            <div className="absolute left-4 top-20 z-10 font-display text-[11px] uppercase tracking-[0.3em] text-white/60 md:left-12 md:top-28 lg:left-20">
                Saigon · HCMC · 2026
            </div>

            {/* Hero content — CSS animation, visible in SSR immediately */}
            <div
                className="relative z-10 flex h-full flex-col items-start justify-end px-4 pb-28 md:px-12 lg:px-20"
                style={{ animation: "hero-content-in 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
            >
                <h1
                    className="font-display font-bold uppercase leading-[0.95] tracking-tight text-white"
                    style={{ fontSize: "clamp(44px, 9vw, 110px)" }}
                >
                    {c.titleA}
                </h1>
                <h1
                    className="font-display font-bold uppercase leading-[0.95] tracking-tight text-white"
                    style={{ fontSize: "clamp(44px, 9vw, 110px)" }}
                >
                    <span className="text-saigon-red">{c.titleBPrefix}</span> {c.titleBSuffix}
                </h1>

                <p className="font-body mt-5 max-w-[520px] text-base text-white/85 md:text-lg">
                    {c.subtitle}
                </p>

                <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:mt-8">
                    <Link
                        className="group inline-flex w-full items-center justify-center gap-2.5 border border-white/50 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:border-white sm:w-auto"
                        href={c.ctaSecondary.href}
                    >
                        {c.ctaSecondary.label}
                    </Link>
                </div>
            </div>

            {/* Scroll cue — CSS animation. pb-28 phía trên chừa chỗ để không đè CTA trên mobile */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60" style={{ animation: "pulse-opacity 2.4s ease-in-out infinite" }}>
                <span className="font-display text-xs uppercase tracking-[0.2em]">Scroll</span>
                <span className="h-8 w-px bg-white/60" />
            </div>
        </section>
    );
}
