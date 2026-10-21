import type { Config } from "payload";

import pkg from "../package.json";

type EmailChannelPluginConfig = {
    collectionSlug?: string;
    enabled?: boolean;
};

export const analyticsPlugin = (pluginConfig: EmailChannelPluginConfig) => {
    return (config: Config): Config => {
        if (pluginConfig.enabled === false) {
            return config;
        }
        if (pluginConfig.collectionSlug) {
            const selectedCollection = config.collections?.find(
                (collection) => collection.slug === pluginConfig.collectionSlug
            );
            if (!selectedCollection) {
                throw new Error(
                    `Collection ${pluginConfig.collectionSlug} not found`
                );
            }
            selectedCollection.admin = {
                ...(selectedCollection.admin ?? {}),
                components: {
                    ...(selectedCollection.admin?.components ?? {}),
                    views: {
                        ...(selectedCollection.admin?.components?.views ?? {}),
                        list: {
                            ...(selectedCollection.admin?.components?.views
                                ?.list ?? {}),
                            Component:
                                "@shopnex/analytics-plugin/rsc#Dashboard",
                        },
                    },
                },
            };

            return config;
        }

        config.admin = {
            ...(config.admin ?? {}),
            components: {
                ...(config.admin?.components ?? {}),
                views: {
                    ...(config.admin?.components?.views ?? {}),
                    dashboard: {
                        ...(config.admin?.components?.views?.dashboard ?? {}),
                        Component: "@shopnex/analytics-plugin/rsc#Dashboard",
                    },
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

export default analyticsPlugin;
