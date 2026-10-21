import type {
    CollectionAdminOptions,
    CollectionConfig,
    UploadConfig,
} from "payload";

export type CollectionOverride = {
    admin: CollectionAdminOptions;
    upload: UploadConfig;
} & CollectionConfig;

type ImportColumn = {
    data_type?: "boolean" | "datetime" | "number" | "string";
    description: string;
    /**
     * The key of the field in the collection
     * @example variants[0].gallery[0].url
     */
    key: string;
    name: string;
    required?: boolean;
    suggested_mappings: string[];
};

export type ImportExportPluginConfig = {
    /**
     * Collections to include the Import/Export controls in
     * Defaults to all collections
     */
    collections?: string[];
    /**
     * Enable to force the export to run synchronously
     */
    disableJobsQueue?: boolean;
    /**
     * Collections to include in the import collection
     */
    importCollections?: {
        collectionSlug: string;
        columns?: ImportColumn[];
    }[];
    /**
     * This function takes the default export collection configured in the plugin and allows you to override it by modifying and returning it
     * @param collection
     * @returns collection
     */
    overrideExportCollection?: (
        collection: CollectionOverride
    ) => CollectionOverride;
};
