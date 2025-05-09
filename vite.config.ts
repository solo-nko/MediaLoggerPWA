import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vuetify({ autoImport: true }), VitePWA({
		registerType: 'prompt',
		injectRegister: false,

		pwaAssets: {
			disabled: false,
			config: true
		},

		manifest: {
			name: 'Media Tracker Progressive',
			short_name: 'Media Tracker',
			description: 'A web app for logging media consumption',
			theme_color: '#ffffff'
		},

		workbox: {
			globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
			cleanupOutdatedCaches: true,
			clientsClaim: true
		},

		devOptions: {
			enabled: false,
			navigateFallback: 'index.html',
			suppressWarnings: true,
			type: 'module'
		}
	})],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	}
});