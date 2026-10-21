const SITE_URL = "https://snussaigon.com";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: `${SITE_URL}${item.url}`,
      name: item.name,
      position: index + 1,
    })),
  };
}

export function generateProductSchema(product: {
  brand: string;
  currency?: string;
  description: string;
  image: string;
  inStock: boolean;
  name: string;
  /** "Chưa kinh doanh" — giá CMS là 0đ (bắt buộc nhập), không phát Offer */
  notForSale?: boolean;
  price: number;
  rating?: number;
  reviewCount?: number;
  sku: string;
  url: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`,
    sku: product.sku,
    url: `${SITE_URL}${product.url}`,
    brand: { "@type": "Brand", name: product.brand },
  };

  if (!product.notForSale) {
    schema.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "VND",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}${product.url}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
  }

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export interface BrandSchemaItem {
  description?: string;
  logo?: string;
  name: string;
  url: string;
}

function brandNode(brand: BrandSchemaItem) {
  return {
    "@type": "Brand",
    name: brand.name,
    url: absoluteUrl(brand.url),
    ...(brand.logo ? { logo: absoluteUrl(brand.logo) } : {}),
    ...(brand.description ? { description: brand.description } : {}),
  };
}

/** Trang /brands: CollectionPage chứa ItemList các Brand. */
export function generateBrandListSchema(page: {
  brands: BrandSchemaItem[];
  description: string;
  name: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.url),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: page.brands.length,
      itemListElement: page.brands.map((brand, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: brandNode(brand),
      })),
    },
  };
}

/** Trang /snus-{slug}: một Brand. */
export function generateBrandSchema(brand: BrandSchemaItem) {
  return { "@context": "https://schema.org", ...brandNode(brand) };
}
