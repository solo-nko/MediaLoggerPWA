import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import {
	mdiChevronDoubleLeft,
	mdiChevronDoubleRight,
	mdiCog,
	mdiDelete,
	mdiHome,
	mdiPencil,
	mdiPlus,
	mdiTable
} from '@mdi/js';
import { standardDarkTheme, standardLightTheme } from '../src/style/Themes';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';


const vuetify = createVuetify({
	defaults: {
		VTextField: {
			variant: 'outlined'
		},
		VAutocomplete: {
			variant: 'outlined'
		},
		VTextarea: {
			variant: 'outlined'
		}
	},
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
			chevronRight: mdiChevronDoubleRight
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

export default vuetify