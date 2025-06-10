import { fn } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/vue3';

import RestoreConfirmDialog from '../../src/components/RestoreConfirmDialog.vue';

const meta: Meta = {
	title: 'Logger/CloudRestoreConfirm',
	component: RestoreConfirmDialog,
	render: (args: any) => ({
		components: { RestoreConfirmDialog },
		setup() {
			return { args };
		},
		template: '<RestoreConfirmDialog :message="args.message" :dry-run="args.dryRun" :sync-code="args.syncCode" :trigger-snack-bar="args.triggerSnackBar" />'
	}),
	tags: ['autodocs']
} satisfies Meta<typeof RestoreConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		dryRun: true,

	}
};
