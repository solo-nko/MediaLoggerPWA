import { type ThemeDefinition } from 'vuetify';

export const standardLightTheme: ThemeDefinition = {
	dark: false,
	colors: {
		background: '#ffffff',
		surface: '#FFFFFF',
		primary: '#3793e1',
		secondary: '#03DAC6',
		accent: '#eccb5b',
		text: '#08275d',
		textOnColor: '#f6f9ff',
		error: '#B00020',
		info: '#2196F3',
		success: '#4CAF50',
		warning: '#FB8C00'
	}
};

export const standardDarkTheme: ThemeDefinition = {
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
