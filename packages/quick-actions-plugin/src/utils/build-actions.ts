import type { Config} from "payload";
import type { JSX } from "react";

import { formatLabels } from "payload";

import type { QuickAction } from "../types";

import { defaultActions as getDefaultActions } from "../default-actions";

interface BuildActionsParams {
    config: Config;
    defaultCreateActions: boolean;
    enableDefaultActions: boolean;
    excludeCollections: string[];
    excludeGlobals: string[];
    iconMap: Record<string, JSX.Element>;
}

export const buildActions = ({
    config,
    defaultCreateActions,
    enableDefaultActions,
    excludeCollections,
    excludeGlobals,
    iconMap
}: BuildActionsParams): QuickAction[] => {
    const collections = config.collections || [];
    const globals = config.globals || [];
    const actions: QuickAction[] = [];
    const createActions: QuickAction[] = [];
    const adminRoute = config.routes?.admin || "/admin";
    
    // Build collection actions
    for (const collection of collections) {
        if (collection.admin?.hidden || excludeCollections.includes(collection.slug)) {
            continue;
        }
        
        const { plural, singular } = formatLabels(collection.slug);

        actions.push({
            id: `${collection.slug}-quick-actions`,
            name: plural,
            group: "collections",
            icon: iconMap[collection.slug],
            keywords: `${collection.slug} ${plural}`,
            link: `${adminRoute}/collections/${collection.slug}`,
            priority: 80
        });
        
        if (defaultCreateActions) {
            createActions.push({
                id: `${collection.slug}-quick-actions-create`,
                name: `Create ${singular}`,
                group: "create",
                icon: iconMap[collection.slug],
                keywords: `create ${collection.slug} ${singular}`,
                link: `${adminRoute}/collections/${collection.slug}/create`,
                priority: 20
            });
        }
    }

    // Build global actions
    for (const global of globals) {
        if (global.admin?.hidden || excludeGlobals.includes(global.slug)) {
            continue;
        }
        
        const { plural } = formatLabels(global.slug);
        actions.push({
            id: `${global.slug}-quick-actions`,
            name: plural,
            group: "globals",
            icon: iconMap[global.slug],
            keywords: `${global.slug} ${plural}`,
            link: `${adminRoute}/globals/${global.slug}`,
            priority: 80
        });
    }
    
    const defaultActions = enableDefaultActions ? getDefaultActions({ adminRoute }) : [];
    return [...defaultActions, ...actions, ...createActions];
};
