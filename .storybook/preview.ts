import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3';
import { createPinia } from "pinia";
import vuetify from '../.plugins/vuetify';
import { withVuetifyTheme } from './stories/withVuetifyTheme.decorator';

setup((app) => {
  app.use(vuetify);
	app.use(createPinia())
})

const preview: Preview = {
  parameters: {
    decorators: {withVuetifyTheme},
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;