import type { Config } from "payload";

import type { QuickAction, QuickActionsPluginConfig } from "./types";

import pkg from "../package.json";
import { buildActions } from "./utils/build-actions";
import { iconMap } from "./utils/icon-map";
import { validateConfig } from "./utils/validate-config";

export type {
    PluginHooks,
    QuickAction,
    QuickActionsPluginConfig,
} from "./types";
export { createAction, QuickActionBuilder } from "./utils/action-builder";
export {
    filterActions,
    groupActionsByCategory,
    sortActionsByPriority,
} from "./utils/action-filters";
export { iconMap } from "./utils/icon-map";

export const quickActionsPlugin = (
    pluginConfig: QuickActionsPluginConfig = {}
) => {
    return (config: Config): Config => {
        const validatedConfig = validateConfig(pluginConfig);

        const {
            defaultCreateActions = true,
            enableDefaultActions = true,
            excludeCollections = [],
            excludeGlobals = [],
            hooks,
            overrideIconsMap = iconMap,
            position = "actions",
        } = validatedConfig;

        hooks?.beforeActionsGenerated?.(config);

        let actions: QuickAction[];

        if (validatedConfig.overrideActions) {
            actions = validatedConfig.overrideActions;
        } else if (validatedConfig.customActionBuilder) {
            actions = validatedConfig.customActionBuilder(config);
        } else {
            actions = buildActions({
                config,
                defaultCreateActions,
                enableDefaultActions,
                excludeCollections,
                excludeGlobals,
                iconMap: overrideIconsMap,
            });
        }

        if (validatedConfig.additionalActions) {
            actions = [...actions, ...validatedConfig.additionalActions];
        }

        if (hooks?.afterActionsGenerated) {
            actions = hooks.afterActionsGenerated(actions);
        }

        const ensureComponentsExist = (config: Config) => {
            config.admin = config.admin || {};
            config.admin.components = config.admin.components || {};
            config.admin.components.providers =
                config.admin.components.providers || [];
            config.admin.components.actions =
                config.admin.components.actions || [];
            config.admin.components.beforeNavLinks =
                config.admin.components.beforeNavLinks || [];
            config.admin.components.afterNavLinks =
                config.admin.components.afterNavLinks || [];
        };

        ensureComponentsExist(config);

        config.admin!.components!.providers!.push({
            clientProps: {
                actions,
                hooks,
                kbarOptions: validatedConfig.kbarOptions,
            },
            path: "@shopnex/quick-actions-plugin/client#CommandBar",
        });

        const quickActionsClientProps = {
            kbarOptions: validatedConfig.kbarOptions,
            position,
        };

        switch (position) {
            case "actions":
                config.admin!.components!.actions!.push({
                    clientProps: quickActionsClientProps,
                    path: "@shopnex/quick-actions-plugin/client#QuickActions",
                });
                break;
            case "after-nav-links":
                config.admin!.components!.afterNavLinks!.push({
                    clientProps: quickActionsClientProps,
                    path: "@shopnex/quick-actions-plugin/client#QuickActions",
                });
                break;
            case "before-nav-links":
                config.admin!.components!.beforeNavLinks!.unshift({
                    clientProps: quickActionsClientProps,
                    path: "@shopnex/quick-actions-plugin/client#QuickActions",
                });
                break;
        }

        const incomingOnInit = config.onInit;

        config.onInit = async (payload) => {
            if (incomingOnInit) {
                await incomingOnInit(payload);
            }
            await config.custom?.syncPlugin?.(payload, {
                name: pkg.name,
                author: pkg.author,
                category: pkg.category,
                description: pkg.description,
                icon: pkg.icon,
                license: pkg.license,
                version: pkg.version,
            });
        };

        return config;
    };
};

export default quickActionsPlugin;
