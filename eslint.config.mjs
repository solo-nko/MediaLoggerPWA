import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{ ignores: ['*.d.ts', '**/coverage', '**/dist'] },
	{
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...pluginVue.configs['flat/recommended']
		],
		files: ['**/*.{ts,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ["warn"],
			"no-unused-vars": ['warn']
		}
	},
	eslintConfigPrettier
);