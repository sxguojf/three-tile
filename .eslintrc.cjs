module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"no-console": "off",
		"max-len": ["warn", { code: 120 }],
		"comma-dangle": [
			"error",
			{
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				exports: "always-multiline",
				functions: "never",
			},
		],
		"object-curly-spacing": ["error", "always"],
		"@typescript-eslint/no-unused-vars": ["warn", { 
			argsIgnorePattern: "^_",
			varsIgnorePattern: "^_",
		}],
	},
	ignorePatterns: ["dist", "node_modules", "**/*.d.ts"],
};
