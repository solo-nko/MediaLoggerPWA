import { type ThemeDefinition } from "vuetify";

export const standardLightTheme: ThemeDefinition = {
	dark: false,
	colors: {
		background: "#ffffff",
		surface: "#FFFFFF",
		primary: "#3793e1",
		secondary: "#03DAC6",
		error: "#B00020",
		info: "#2196F3",
		success: "#4CAF50",
		warning: "#FB8C00",
		// extras
		accent: "#eccb5b",
		text: "#1e1e1e",
		placeholderText: "#565656"
	}
};

export const standardDarkTheme: ThemeDefinition = {
	dark: true,
	colors: {
		background: "#08275d",
		surface: "#26427e",
		primary: "#26427e",
		secondary: "#eccb5b",
		error: "#B00020",
		info: "#2196F3",
		success: "#4CAF50",
		warning: "#FB8C00",
		// extras
		accent: "#eccb5b",
		text: "#fbfcff",
		placeholderText: "#f2f8ff"
	}
};
