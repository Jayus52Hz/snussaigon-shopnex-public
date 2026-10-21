import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";

import * as LucideIcons from "lucide-react";
import {
    Blocks,
    ChartSpline,
    Image,
    Palette,
    Settings,
    Settings2,
    ShoppingCart,
    Tag,
    Target,
    UserRound,
} from "lucide-react";

const navIconMap: Record<string, ExoticComponent<LucideProps>> = {
    analytics: ChartSpline,
    campaigns: Target,
    content: Image,
    customers: UserRound,
    design: Palette,
    orders: ShoppingCart,
    platform: Settings2,
    plugins: Blocks,
    products: Tag,
    settings: Settings,
};

export const getNavIcon = (
    slug: string,
    groupsConfig?: Record<string, { icon: string; name: string }>
): ExoticComponent<LucideProps> | undefined => {
    if (groupsConfig?.[slug]) {
        const iconName = groupsConfig[slug].icon;
        const IconComponent = (LucideIcons as unknown as Record<string, ExoticComponent<LucideProps>>)[iconName];
        if (IconComponent) {
            return IconComponent;
        }
    }

    return navIconMap[slug];
};
