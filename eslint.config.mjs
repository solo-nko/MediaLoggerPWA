import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import vueEslint from 'eslint-plugin-vue';
import prettierEslint from 'eslint-config-prettier';
import importJs from 'eslint-plugin-import';

export default tsEslint.config(
	{ ignores: ['*.d.ts', '**/coverage', '**/dist'] },
	{
		extends: [
			eslint.configs.recommended,
			...tsEslint.configs.recommended,
			...vueEslint.configs['flat/recommended'],
			importJs.flatConfigs.recommended
		],
		files: ['**/*.{ts,vue}'],
		ignores: ['**/.storybook/stories/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				parser: tsEslint.parser
			}
		},
		rules: {
			'import/named': 'off',
			'import/no-unresolved': 'off',
			'import/order': 'warn',
			'@typescript-eslint/no-unused-vars': ['off'],
			'no-unused-vars': ['warn', { argsIgnorePattern: 'which' }],
			'vue/v-slot-style': [
				'warn',
				{
					named: 'longform'
				}
			]
		}
	},
	prettierEslint
);
