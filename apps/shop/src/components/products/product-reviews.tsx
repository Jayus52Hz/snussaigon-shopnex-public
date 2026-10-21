"use client";

import { useLocale } from "@/i18n/locale-provider";
import SectionHeading from "@/components/section-heading";
import { Star, X, Send, MessageSquarePlus } from "lucide-react";
import { cn } from "@/utils";
import { useState, useEffect } from "react";

type Review = {
    id: number | string;
    author: string;
    rating: number;
    date: string;
    content: string;
    verified?: boolean;
};

type ProductReviewsProps = {
    rating?: number;
    reviewCount?: number;
    productHandle?: string;
    cmsReviews?: any[];
};

// Map review từ CMS (collection `reviews`) sang shape hiển thị.
function mapCmsReviews(docs: any[] = []): Review[] {
    return docs.map((r: any) => ({
        id: r.id,
        author: r.author || "—",
        rating: typeof r.rating === "number" ? r.rating : 5,
        date: String(r.reviewDate || r.createdAt || "").slice(0, 10),
        content: r.content || "",
        verified: !!r.verifiedBuyer,
    }));
}

const INITIAL_SHOWN = 3;

export default function ProductReviews({ rating = 0, reviewCount = 0, productHandle = "", cmsReviews = [] }: ProductReviewsProps) {
    const { dict, locale } = useLocale();
    const isEn = locale === "en";

    const baseReviews = mapCmsReviews(cmsReviews);
    const [reviews, setReviews] = useState<Review[]>(baseReviews);
    const [showAll, setShowAll] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Review form state
    const [formName, setFormName] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formRating, setFormRating] = useState(5);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    // Reviews hiển thị = review khách tự thêm (localStorage) + review từ CMS.
    useEffect(() => {
        const cms = mapCmsReviews(cmsReviews);
        let userReviews: Review[] = [];
        if (productHandle) {
            try {
                const stored = localStorage.getItem(`reviews-${productHandle}`);
                if (stored) userReviews = JSON.parse(stored) as Review[];
            } catch { /* localStorage not available */ }
        }
        setReviews([...userReviews, ...cms].slice(0, 200));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productHandle, cmsReviews]);

    const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_SHOWN);
    const hasMore = reviews.length > INITIAL_SHOWN;
    const avgRating = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : rating;

    const handleSubmitReview = () => {
        if (!formName.trim() || !formContent.trim()) return;
        setFormSubmitting(true);

        const newReview: Review = {
            id: Date.now(),
            author: formName.trim(),
            rating: formRating,
            date: new Date().toISOString().slice(0, 10),
            content: formContent.trim(),
        };

        // Save to localStorage (simulates CMS persistence)
        try {
            const stored = localStorage.getItem(`reviews-${productHandle}`);
            const userReviews = stored ? JSON.parse(stored) as Review[] : [];
            userReviews.unshift(newReview);
            localStorage.setItem(`reviews-${productHandle}`, JSON.stringify(userReviews));
        } catch { /* localStorage not available */ }

        setReviews((prev) => [newReview, ...prev]);
        setFormName("");
        setFormContent("");
        setFormRating(5);
        setFormSubmitting(false);
        setFormSuccess(true);
        setTimeout(() => {
            setFormSuccess(false);
            setShowForm(false);
        }, 1500);
    };

    return (
        <section id="product-reviews">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <SectionHeading
                    subtitle={isEn
                        ? `${reviews.length} reviews from verified buyers`
                        : `${reviews.length} đánh giá từ khách hàng đã mua`}
                    title={dict.product.reviews}
                />
                <button
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setShowForm(true)}
                    type="button"
                >
                    <MessageSquarePlus className="h-4 w-4" />
                    {isEn ? "Write a Review" : "Viết đánh giá"}
                </button>
            </div>

            {/* Rating summary */}
            {avgRating > 0 && (
                <div className="flex items-center gap-3 mb-6 mt-4">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                className={cn(
                                    "h-5 w-5",
                                    star <= Math.round(avgRating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-gray-200 text-gray-200"
                                )}
                                key={star}
                            />
                        ))}
                    </div>
                    <span className="text-lg font-bold">{avgRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">
                        ({reviews.length} {dict.product.reviews.toLowerCase()})
                    </span>
                </div>
            )}

            {/* Reviews list */}
            <div className="space-y-4 mt-4">
                {visibleReviews.map((review) => (
                    <div className="border border-gray-200 rounded-xl p-4" key={review.id}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{review.author}</span>
                            <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    className={cn(
                                        "h-3.5 w-3.5",
                                        star <= review.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-gray-200 text-gray-200"
                                    )}
                                    key={star}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                    </div>
                ))}
            </div>

            {/* Show more / less toggle */}
            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setShowAll(!showAll)}
                        type="button"
                    >
                        {showAll
                            ? (isEn ? "Show Less ▲" : "Thu gọn ▲")
                            : (isEn ? `Show All ${reviews.length} Reviews ▼` : `Xem tất cả ${reviews.length} đánh giá ▼`)}
                    </button>
                </div>
            )}

            {/* Write Review Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <button
                        aria-label="Close review form"
                        className="fixed inset-0 bg-black/40 cursor-default"
                        onClick={() => setShowForm(false)}
                        onKeyDown={(e) => { if (e.key === "Escape") setShowForm(false); }}
                        type="button"
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 z-10 animate-slide-down">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold">
                                {isEn ? "Write a Review" : "Viết đánh giá"}
                            </h3>
                            <button
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={() => setShowForm(false)}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Star rating */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {isEn ? "Rating" : "Đánh giá"}
                                </label>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            className="p-0.5 hover:scale-110 transition-transform"
                                            key={star}
                                            onClick={() => setFormRating(star)}
                                            type="button"
                                        >
                                            <Star
                                                className={cn(
                                                    "h-7 w-7",
                                                    star <= formRating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "fill-gray-200 text-gray-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="review-name">
                                    {isEn ? "Your Name" : "Tên của bạn"}
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                                    id="review-name"
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder={isEn ? "Enter your name" : "Nhập tên của bạn"}
                                    type="text"
                                    value={formName}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="review-content">
                                    {isEn ? "Your Review" : "Nội dung đánh giá"}
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 min-h-[120px] resize-y"
                                    id="review-content"
                                    onChange={(e) => setFormContent(e.target.value)}
                                    placeholder={isEn ? "Share your experience..." : "Chia sẻ trải nghiệm của bạn..."}
                                    value={formContent}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={formSubmitting || formSuccess || !formName.trim() || !formContent.trim()}
                                onClick={handleSubmitReview}
                                type="button"
                            >
                                {formSubmitting ? (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : formSuccess ? (
                                    isEn ? "Submitted!" : "Đã gửi!"
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        {isEn ? "Submit Review" : "Gửi đánh giá"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}
