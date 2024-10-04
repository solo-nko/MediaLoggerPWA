import { type ThemeDefinition } from 'vuetify';

const normalLightTheme: ThemeDefinition = {
	dark: false,
	colors: {
		background: '#051842',
		surface: '#FFFFFF',
		primary: '#0a81ce',
		secondary: '#03DAC6',
		accent: '#00BCD4',
		text: '#000000',
		error: '#B00020',
		info: '#2196F3',
		success: '#4CAF50',
		warning: '#FB8C00'
	}
};

const normalDarkTheme: ThemeDefinition = {
	dark: true,
	colors: {
		background: '#051842',
		surface: '#FFFFFF',
		primary: '#0a81ce',
		secondary: '#03DAC6',
		accent: '#00BCD4',
		text: '#000000',
		error: '#B00020',
		info: '#2196F3',
		success: '#4CAF50',
		warning: '#FB8C00'
	}
};

export const Themes: ThemeDefinition[] = [normalDarkTheme, normalLightTheme];
