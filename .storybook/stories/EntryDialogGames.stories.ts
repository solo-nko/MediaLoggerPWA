import { fn } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/vue3';

import EntryDialogGames from '../../src/components/entry_dialogs/EntryDialogGames.vue';

const meta: Meta = {
	title: 'Logger/GamesEntry',
	component: EntryDialogGames,
	tags: ['autodocs']
} satisfies Meta<typeof EntryDialogGames>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		primary: true,
		label: 'Primary'
	}
};

