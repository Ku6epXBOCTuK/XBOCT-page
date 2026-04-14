import eslintPluginSvelte from "eslint-plugin-svelte";
import tseslint from "typescript-eslint";

export default [
	...tseslint.configs.recommended,
	...eslintPluginSvelte.configs["flat/recommended"],
	{
		rules: {
			"svelte/block-lang": ["error", { script: ["ts"] }],
		},
	},
	{
		files: ["**/*.svelte", "**/*.svelte.ts", "**/*.ts"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
		rules: {
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: ["property", "variable"],
					filter: { regex: "^on", match: true },
					format: null,
					custom: {
						// Проверяем, что после 'on' идут только строчные буквы
						regex: "^on[a-z]+$",
						match: true,
					},
				},
			],
		},
	},
];
