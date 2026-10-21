import { Gift } from "lucide-react";

import { type Promotion, tierLabel } from "@/utils/quantity-promotion";

/** Khối chương trình khuyến mãi theo số lượng — hiện dưới nút mua ở trang sản phẩm. */
const PromotionInfo = ({ promotion, locale }: { promotion?: Promotion | null; locale: string }) => {
    const tiers = [...(promotion?.tiers ?? [])]
        .filter((t) => t.minQuantity > 0)
        .sort((a, b) => a.minQuantity - b.minQuantity);
    if (!promotion || tiers.length === 0) return null;

    return (
        <div
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm"
            data-component="product-promotion"
        >
            <p className="flex items-center gap-2 font-semibold text-emerald-800">
                <Gift className="size-4 flex-shrink-0" />
                {promotion.name}
            </p>
            <ul className="mt-2 space-y-1 pl-6 list-disc marker:text-emerald-500 text-gray-700">
                {tiers.map((tier) => (
                    <li key={`${tier.minQuantity}-${tier.type}`}>{tierLabel(tier, locale)}</li>
                ))}
            </ul>
            {promotion.note && (
                <p className="mt-2 text-xs italic text-gray-500">{promotion.note}</p>
            )}
        </div>
    );
};

export default PromotionInfo;
