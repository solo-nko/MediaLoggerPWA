import { fn } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/vue3';

import HomeView from '../../src/views/HomeView.vue';
import App from '../../src/App.vue'

const meta: Meta = {
	title: 'Logger/HomeView',
	component: App,
	tags: ['autodocs']
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		primary: true,
		label: 'Default'
	}
};