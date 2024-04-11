module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:@typescript-eslint/recommended"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
            "off",
            { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-this-alias": "off",
    },
    ignorePatterns: ["node_modules/"],
};
