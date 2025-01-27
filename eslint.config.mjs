import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import vueEslint from 'eslint-plugin-vue';
import prettierEslint from 'eslint-config-prettier';

export default tsEslint.config(
	{ ignores: ['*.d.ts', '**/coverage', '**/dist'] },
	{
		extends: [
			eslint.configs.recommended,
			...tsEslint.configs.recommended,
			...vueEslint.configs['flat/recommended']
		],
		files: ['**/*.{ts,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				parser: tsEslint.parser
			}
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ['off'],
			"no-unused-vars": ['warn'],
			"vue/v-slot-style": ["warn", {
				"named": "longform"
			}],
		}
	},
	prettierEslint
);