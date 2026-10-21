import payloadEsLintConfig from "@payloadcms/eslint-config";

export const defaultESLintIgnores = [
    "**/.temp",
    "**/.*", // ignore all dotfiles
    "**/.git",
    "**/.hg",
    "**/.pnp.*",
    "**/.svn",
    "**/playwright.config.ts",
    "**/jest.config.js",
    "**/tsconfig.tsbuildinfo",
    "**/README.md",
    "**/eslint.config.js",
    "**/payload-types.ts",
    "**/dist/",
    "**/.yarn/",
    "**/build/",
    "**/node_modules/",
    "**/temp/",
    "plugins/*",
    "src/app/(frontend)/_components/checkout/*",
    "src/app/(frontend)/(checkout)/checkout/*",
    "src/app/(frontend)/_templates/checkout-form.tsx",
    "src/app/(frontend)/*",
];

export const rootParserOptions = {
    sourceType: "module",
    ecmaVersion: "latest",
    projectService: {
        maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 40,
        allowDefaultProject: [
            "scripts/*.ts",
            "*.js",
            "*.mjs",
            "*.spec.ts",
            "*.d.ts",
        ],
    },
};

export const rootEslintConfig = [
    ...payloadEsLintConfig,
    {
        ignores: defaultESLintIgnores,
    },
    {
        rules: {
            "no-restricted-exports": "off",
        },
    },
    {
        files: ["apps/shop/src/**"],
        rules: {
            "no-empty-pattern": "off",
            "no-duplicate-case": "off",
            "perfectionist/sort-objects": "off",
            "perfectionist/sort-named-imports": "off",
            "perfectionist/sort-imports": "off",
            "perfectionist/sort-interfaces": "off",
            "perfectionist/sort-union-types": "off",
            "perfectionist/sort-jsx-props": "off",
            "perfectionist/sort-object-types": "off",
            "perfectionist/sort-switch-case": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/await-thenable": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "jsx-a11y/img-redundant-alt": "off",
        },
    },
];

export default [
    ...rootEslintConfig,
    {
        languageOptions: {
            parserOptions: {
                ...rootParserOptions,
                // projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];
