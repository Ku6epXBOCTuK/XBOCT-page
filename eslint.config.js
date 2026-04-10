import tseslint from "typescript-eslint";
import eslintPluginSvelte from "eslint-plugin-svelte";

export default [
	...tseslint.configs.recommended,
	...eslintPluginSvelte.configs["flat/recommended"],
	{
		rules: {
			"svelte/block-lang": ["error", { script: ["ts"] }],
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	{
		files: ["**/*.svelte.ts"],
		languageOptions: {
			parser: eslintPluginSvelte.languageOptions.parser,
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
];
