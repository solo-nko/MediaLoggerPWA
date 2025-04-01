import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useTheme } from 'vuetify';

export const settingsStore = reactive({
	defaultDBScreen: 'game',
	defaultEntryScreen: 'game'
});

export const useSetupStore = defineStore('setup-private', () => {
	const testMessage = ref('Hello, World');
	return { testMessage };
});

export const useThemeStore = defineStore('theme', () => {
	const localStorageTheme = localStorage.getItem('theme');
	const lightTheme = ref(false);
	const themeInstance = useTheme();

	function loadTheme() {
		themeInstance.global.name.value = localStorageTheme;
		if (themeInstance.global.current.value.dark) lightTheme.value = false;
		else lightTheme.value = true;
	}

	function toggleTheme() {
		themeInstance.global.name.value = themeInstance.global.current.value.dark ? 'light1' : 'dark1';
		if (themeInstance.global.current.value.dark) lightTheme.value = false;
		else lightTheme.value = true;
		localStorage.setItem('theme', themeInstance.global.name.value);
	}

	return { localStorageTheme, lightTheme, loadTheme, themeInstance, toggleTheme };
});
