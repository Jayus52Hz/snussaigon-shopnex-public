"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SaigonBackToTop() {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 600));

    const isCart = pathname === "/cart" || pathname === "/en/cart";
    if (isCart) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    aria-label="Lên đầu trang"
                    className="group fixed bottom-24 right-5 z-40 inline-flex items-center justify-center md:bottom-28 md:right-7"
                    exit={{ opacity: 0, scale: 0.7, y: 20 }}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    type="button"
                >
                    <motion.span
                        animate={{ y: [0, -6, 0] }}
                        className="block drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105"
                        transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Image
                            alt=""
                            className="h-10 w-10"
                            height={40}
                            priority={false}
                            src="/up-icon-v2.png"
                            width={40}
                        />
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
