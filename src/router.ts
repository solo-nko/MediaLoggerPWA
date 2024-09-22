import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import NewEntryView from '../views/NewEntryView.vue';
import DatabaseView from '../views/DatabaseView.vue';

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
		}
		// {
		// 	path: '/:other(.*)',
		// 	redirect: '/home'
		// }
	]
});
