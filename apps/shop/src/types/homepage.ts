export interface Brand {
    id: number;
    logoUrl: string;
    name: string;
    productCount: number;
    slug: string;
}

export interface Banner {
    id: number;
    link: string;
    image: { url: string; alt: string };
    sortOrder: number;
}

export interface BlogArticle {
    brand?: string;
    content?: string;
    createdAt: string;
    excerpt?: string;
    id: number;
    publishedAt?: string;
    slug: string;
    thumbnail?: { url?: string; alt?: string };
    thumbnailUrl?: string;
    title: string;
    updatedAt: string;
}

export interface SEOArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnailUrl: string;
    publishedAt: string;
    pageType: "store" | "brand" | "collection";
    collectionHandle: string | null;
    brandSlug: string | null;
}

export interface StoreLocation {
    address: string;
    district: string;
    hours: string;
    id: number;
    mapsUrl: string;
    name: string;
    phone: string;
}

export interface FAQItem {
    answer: string;
    answer_en?: string;
    id: number;
    question: string;
    question_en?: string;
}

export interface TopbarItem {
    id: number;
    icon: string;
    text: string;
    text_en: string;
    link: string | null;
    sortOrder: number;
}

export interface TrustBadge {
    description: string;
    description_en?: string;
    icon: string;
    id: number;
    title: string;
    title_en?: string;
}

export interface TrendingTerm {
    href: string;
    id: number;
    term: string;
}

export interface HomepageData {
    banners: Banner[];
    bestSellers: any[];
    blogArticles: BlogArticle[];
    brands: Brand[];
    faqs: FAQItem[];
    newArrivals: any[];
    recommended: any[];
    storeLocations: StoreLocation[];
    trendingTerms: TrendingTerm[];
    trustBadges: TrustBadge[];
}
