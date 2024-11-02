import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style/style.scss'


// vuetify
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { standardDarkTheme, standardLightTheme } from './style/Themes.ts';

//icons
import {
	mdiHome,
	mdiPlus,
	mdiTable,
	mdiCog,
	mdiPencil,
	mdiDelete,
	mdiChevronDoubleLeft,
	mdiChevronDoubleRight,
} from '@mdi/js';

import { router } from './router.ts';

const pinia = createPinia();
const vuetify = createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases: {
			...aliases,
			home: mdiHome,
			add: mdiPlus,
			table: mdiTable,
			settings: mdiCog,
			pencil: mdiPencil,
			trash: mdiDelete,
			chevronLeft: mdiChevronDoubleLeft,
			chevronRight: mdiChevronDoubleRight,
		},
		sets: {
			mdi
		}
	},
	theme: {
		defaultTheme: 'light1',
		themes: {
			light1: standardLightTheme,
			dark1: standardDarkTheme
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
