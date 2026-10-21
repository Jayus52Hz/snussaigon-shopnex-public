import Image from "next/image";
import Link from "next/link";

export type SaigonMomentContent = {
    eyebrow?: string;
    title?: string;
    body?: string;
    backgroundUrl?: string;
    ctaPrimary?: { label: string; href: string };
    ctaSecondary?: { label: string; href: string };
};

const DEFAULTS = {
    eyebrow: "— Saigon Moment",
    title: "Saigon runs on snus.",
    body: "Ship trong ngày nội thành HCMC. Hàng chính hãng, giá minh bạch, không chặt chém.",
    backgroundUrl:
        "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?q=80&w=2000&auto=format&fit=crop",
    ctaPrimary: { label: "Order ngay", href: "/snus" },
    ctaSecondary: {
        label: "Xem địa điểm",
        href: "https://maps.app.goo.gl/rczGiRmSjEK22WHC9",
    },
};

export default function SaigonMomentBlock({
    content,
}: {
    content?: SaigonMomentContent;
} = {}) {
    const c = {
        eyebrow: content?.eyebrow || DEFAULTS.eyebrow,
        title: content?.title || DEFAULTS.title,
        body: content?.body || DEFAULTS.body,
        backgroundUrl: content?.backgroundUrl || DEFAULTS.backgroundUrl,
        ctaPrimary: content?.ctaPrimary || DEFAULTS.ctaPrimary,
        ctaSecondary: content?.ctaSecondary || DEFAULTS.ctaSecondary,
    };

    const isExternal = /^https?:\/\//.test(c.ctaSecondary.href);
    const secondaryCls =
        "font-display order-2 inline-flex w-fit items-center gap-2 border-b border-white/50 pb-[2px] text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:border-white sm:order-none";

    return (
        <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-saigon-black">
            {/* Background image — static, no parallax. next/image resizes + AVIF. */}
            <div className="absolute inset-0">
                <Image
                    alt=""
                    aria-hidden
                    className="object-cover object-center"
                    fill
                    quality={65}
                    sizes="100vw"
                    src={c.backgroundUrl}
                />
            </div>
            <div className="absolute inset-0 bg-saigon-base/80 md:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-saigon-base/95 via-saigon-base/65 to-transparent md:block" />

            <div className="relative z-10 px-4 py-20 md:px-12 md:py-24 lg:px-20">
                <span className="font-display text-sm uppercase tracking-[0.32em] text-white/55">
                    {c.eyebrow}
                </span>
                <h2 className="font-display mt-3 max-w-2xl text-[40px] font-bold uppercase leading-[1.05] tracking-tight text-white md:text-[56px] lg:text-[72px]">
                    {c.title}
                </h2>
                <p className="font-body mt-5 max-w-[480px] text-base text-white/85 md:text-lg">
                    {c.body}
                </p>
                <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6 md:mt-8">
                    {isExternal ? (
                        <a className={secondaryCls} href={c.ctaSecondary.href} rel="noopener noreferrer" target="_blank">
                            {c.ctaSecondary.label}
                        </a>
                    ) : (
                        <Link className={secondaryCls} href={c.ctaSecondary.href}>
                            {c.ctaSecondary.label}
                        </Link>
                    )}
                    <Link
                        className="group order-1 inline-flex items-center justify-center gap-2.5 border border-white bg-white px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-saigon-base transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] sm:order-none"
                        href={c.ctaPrimary.href}
                    >
                        {c.ctaPrimary.label}
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
