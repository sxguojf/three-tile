module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './packages/*/tsconfig.json'],
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': ['warn', {
			ignoreRestArgs: true,
			fixToUnknown: true,
		}],
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/no-this-alias': 'off',
		'no-console': 'off',
		'max-len': ['warn', { 'code': 120 }],
		'comma-dangle': ['error', {
			'arrays': 'always-multiline',
			'objects': 'always-multiline',
			'imports': 'always-multiline',
			'exports': 'always-multiline',
			'functions': 'never'
		}],
		'arrow-parens': ['error', 'as-needed'],
		'object-curly-spacing': ['error', 'always']
	},
	ignorePatterns: ['dist', 'node_modules', '**/*.d.ts']
};
