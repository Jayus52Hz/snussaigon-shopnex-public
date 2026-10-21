import Image from "next/image";

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=700&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529832031826-1bd1d29d2fb9?q=80&w=650&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=850&auto=format&fit=crop",
];

function ImageRow({ images }: { images: string[] }) {
    return (
        <div className="flex h-[220px] shrink-0 items-stretch gap-2 px-1 md:h-[300px] lg:h-[360px]">
            {images.map((src, i) => (
                <Image
                    alt=""
                    className="h-full w-auto shrink-0 object-cover transition-transform duration-500 hover:scale-[1.04]"
                    height={0}
                    key={`${src}-${i}`}
                    sizes="(max-width: 768px) 60vw, 33vw"
                    src={src}
                    style={{ height: "100%", width: "auto" }}
                    width={0}
                />
            ))}
        </div>
    );
}

export default function SaigonMarqueeStrip({
    images,
}: {
    images?: string[];
} = {}) {
    const list = images && images.length > 0 ? images : FALLBACK_IMAGES;
    return (
        <div className="flex h-[220px] w-full overflow-hidden bg-saigon-base md:h-[320px]">
            <div className="flex w-max animate-marquee-slow">
                <ImageRow images={list} />
                <ImageRow images={list} />
            </div>
        </div>
    );
}
