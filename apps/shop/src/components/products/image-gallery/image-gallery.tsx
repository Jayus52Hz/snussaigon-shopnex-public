"use client";

import { cn } from "@/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ImageItem = {
    alt?: string;
    url: string;
};

type ImageGalleryProps = {
    images: ImageItem[];
    thumbnail?: null | string;
};

export default function ImageGallery({ images, thumbnail }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const allImages: ImageItem[] =
        images.length > 0
            ? images
            : thumbnail
              ? [{ url: thumbnail, alt: "Product image" }]
              : [{ url: "/placeholder.svg", alt: "No image" }];

    const activeImage = allImages[activeIndex] || allImages[0];

    const goTo = useCallback(
        (index: number) => {
            setActiveIndex(Math.max(0, Math.min(index, allImages.length - 1)));
        },
        [allImages.length]
    );

    const goNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const goPrev = useCallback(() => {
        setActiveIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length
        );
    }, [allImages.length]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "Escape") setLightboxOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxOpen, goNext, goPrev]);

    return (
        <>
            <div className="flex flex-col gap-3">
                {/* Main image */}
                <div
                    className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setLightboxOpen(true);
                    }}
                    aria-label="Open image lightbox"
                >
                    <img
                        alt={activeImage.alt || "Product image"}
                        className="h-full w-full object-cover"
                        src={activeImage.url}
                    />
                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                aria-label="Previous image"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrev();
                                }}
                                type="button"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                aria-label="Next image"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                                type="button"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}
                    {/* Dot indicators for mobile */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                            {allImages.map((_, i) => (
                                <button
                                    aria-label={`Go to image ${i + 1}`}
                                    className={cn(
                                        "h-2 rounded-full transition-all",
                                        i === activeIndex
                                            ? "w-4 bg-white"
                                            : "w-2 bg-white/60"
                                    )}
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goTo(i);
                                    }}
                                    type="button"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {allImages.map((img, i) => (
                            <button
                                aria-label={`View image ${i + 1}`}
                                className={cn(
                                    "h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                                    i === activeIndex
                                        ? "border-gray-900"
                                        : "border-transparent hover:border-gray-300"
                                )}
                                key={i}
                                onClick={() => goTo(i)}
                                type="button"
                            >
                                <img
                                    alt={img.alt || `Thumbnail ${i + 1}`}
                                    className="h-full w-full object-cover"
                                    src={img.url}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                    <button
                        aria-label="Close lightbox"
                        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                        onClick={() => setLightboxOpen(false)}
                        type="button"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <button
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                        onClick={goPrev}
                        type="button"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <img
                        alt={activeImage.alt || "Product image"}
                        className="max-h-[85vh] max-w-[90vw] object-contain"
                        src={activeImage.url}
                    />
                    <button
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                        onClick={goNext}
                        type="button"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">
                        {activeIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </>
    );
}
