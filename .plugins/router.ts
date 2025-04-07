import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../src/views/HomeView.vue';
import NewEntryView from '../src/views/NewEntryView.vue';
import DatabaseView from '../src/views/DatabaseView.vue';
import SettingsView from '../src/views/SettingsView.vue';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/home',
			name: 'Home',
			component: HomeView
		},
		{
			path: '/entry',
			name: 'Entry',
			component: NewEntryView
		},
		{
			path: '/database',
			name: 'Database',
			component: DatabaseView
		},
		{
			path: '/settings',
			name: 'Settings',
			component: SettingsView
		},
		{
			path: '/:other(.*)',
			redirect: '/home'
		}
	]
});
