import type { Config } from "payload";

import pkg from "../package.json";

type SidebarPluginConfig = {
    enabled?: boolean;
    groups?: Record<string, { icon: string; name: string }>;
};

export const sidebarPlugin = (pluginConfig: SidebarPluginConfig = {}) => {
    return (config: Config): Config => {
        if (pluginConfig.enabled === false) {
            return config;
        }

        config.admin = {
            ...(config.admin ?? {}),
            components: {
                ...(config.admin?.components ?? {}),
                Nav: {
                    clientProps: {
                        groupsConfig: pluginConfig.groups,
                    },
                    path: "@shopnex/sidebar-plugin/rsc#NavWithGroups",
                },
            },
        };

        const onInit = config.onInit;
        config.onInit = async (payload) => {
            if (onInit) {
                await onInit(payload);
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

export default sidebarPlugin;
