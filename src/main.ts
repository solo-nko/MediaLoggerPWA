import { createApp } from 'vue';
import { createPinia } from 'pinia';
// import './style.css';
import App from './App.vue';

// vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { router } from './router.ts';

const pinia = createPinia();
const vuetify = createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi
		}
	},
	components,
	directives
});

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(pinia);

app.mount('#app');
