import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const stars: React.ReactNode[] = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star
                className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                key={`full-${i}`}
            />
        );
    }

    if (hasHalf) {
        stars.push(
            <Star
                className="w-3.5 h-3.5 fill-yellow-400/50 text-yellow-400"
                key="half"
            />
        );
    }

    return <span className="inline-flex items-center gap-0.5">{stars}</span>;
}
