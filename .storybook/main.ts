import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
	'stories': [
		'./stories/*.stories.@(js|jsx|mjs|ts|tsx)',
		'./stories/*.mdx'
	],
	'addons': [
		'@storybook/addon-essentials',
		'@storybook/addon-onboarding',
		'@chromatic-com/storybook',
		'@storybook/experimental-addon-test'
	],
	'framework': {
		'name': '@storybook/vue3-vite',
		'options': {
			'docgen': 'vue-component-meta'
		}
	}
};
export default config;