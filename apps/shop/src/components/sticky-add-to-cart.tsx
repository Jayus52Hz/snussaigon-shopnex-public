"use client";

import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { MessageCircle, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

declare global {
    interface Window {
        SnusChat?: { open: () => void };
        __snusChatOpen?: boolean;
    }
}

interface StickyAddToCartProps {
    productName?: string;
    price?: number;
    currency?: string;
    quantity?: number;
    onAddToCart?: () => void;
    disabled?: boolean;
}

/** Floating chat button on mobile — expands to WhatsApp / Messenger / Zalo */
export default function StickyAddToCart(_props: StickyAddToCartProps) {
    const { locale } = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const isEn = locale === "en";
    const chatEnabled = Boolean(process.env.NEXT_PUBLIC_CHAT_WIDGET_SRC);

    const channels = [
        {
            href: "https://zalo.me/0896561023",
            label: "Zalo",
            // Zalo logo dùng màu thật → button nền trắng, chữ xanh Zalo brand.
            color: "bg-white text-[#0068FF] hover:bg-blue-50 border border-[#0068FF]/20",
            icon: (
                <Image
                    alt="Zalo"
                    className="h-5 w-5"
                    height={20}
                    src="/zalo-icon.webp"
                    width={20}
                />
            ),
        },
        {
            href: "https://m.me/61569228890948",
            label: "Messenger",
            color: "bg-sky-500 text-white hover:bg-sky-600",
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.3 5.7 3.3 7.5V22l3-1.6c1.2.4 2.5.6 3.7.6 5.5 0 10-4.5 10-10S17.5 2 12 2zm1 13.5l-2.5-2.7-5 2.7L11 10l2.5 2.7 5-2.7L13 15.5z" />
                </svg>
            ),
        },
        {
            href: "https://wa.me/84896561023",
            label: "WhatsApp",
            color: "bg-green-500 text-white hover:bg-green-600",
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.5 14.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.4-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.5-1.8-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
            {/* Channel options */}
            {isOpen && (
                <div className="flex flex-col gap-2 animate-slide-up">
                    {chatEnabled ? (
                        <button
                            className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-violet-700"
                            onClick={() => {
                                setIsOpen(false);
                                if (window.SnusChat) window.SnusChat.open();
                                else window.__snusChatOpen = true;
                            }}
                            type="button"
                        >
                            <Sparkles className="h-5 w-5" />
                            {isEn ? "AI assistant" : "Tư vấn AI"}
                        </button>
                    ) : null}
                    {channels.map((ch) => (
                        <a
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg transition-colors",
                                ch.color
                            )}
                            href={ch.href}
                            key={ch.label}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {ch.icon}
                            {ch.label}
                        </a>
                    ))}
                </div>
            )}

            {/* Toggle button */}
            <button
                aria-label={isEn ? "Chat with us" : "Nhắn tin với chúng tôi"}
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all",
                    isOpen
                        ? "bg-gray-800 text-white rotate-90"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                )}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>
        </div>
    );
}
