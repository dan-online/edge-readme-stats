import type { Theme } from "../types/index.ts";

export const themeNames = [
	"default",
	"dark",
	"radical",
	"tokyonight",
	"dracula",
	"gruvbox",
	"nord",
	"catppuccin",
	"onedark",
	"github",
] as const;

export type ThemeName = (typeof themeNames)[number];

export const themes: Record<ThemeName, Theme> = {
	default: {
		bg: "#ffffff",
		title: "#2f80ed",
		text: "#333333",
		icon: "#4c71f2",
		border: "#e4e2e2",
	},
	dark: {
		bg: "#0d1117",
		title: "#58a6ff",
		text: "#c9d1d9",
		icon: "#58a6ff",
		border: "#30363d",
	},
	radical: {
		bg: "#141321",
		title: "#fe428e",
		text: "#a9fef7",
		icon: "#f8d847",
		border: "#fe428e",
	},
	tokyonight: {
		bg: "#1a1b27",
		title: "#70a5fd",
		text: "#38bdae",
		icon: "#bf91f3",
		border: "#70a5fd",
	},
	dracula: {
		bg: "#282a36",
		title: "#ff79c6",
		text: "#f8f8f2",
		icon: "#bd93f9",
		border: "#6272a4",
	},
	gruvbox: {
		bg: "#282828",
		title: "#fabd2f",
		text: "#ebdbb2",
		icon: "#fe8019",
		border: "#d65d0e",
	},
	nord: {
		bg: "#2e3440",
		title: "#88c0d0",
		text: "#d8dee9",
		icon: "#81a1c1",
		border: "#4c566a",
	},
	catppuccin: {
		bg: "#1e1e2e",
		title: "#cba6f7",
		text: "#cdd6f4",
		icon: "#f5c2e7",
		border: "#6c7086",
	},
	onedark: {
		bg: "#282c34",
		title: "#61afef",
		text: "#abb2bf",
		icon: "#e06c75",
		border: "#4b5263",
	},
	github: {
		bg: "#ffffff",
		title: "#0969da",
		text: "#1f2328",
		icon: "#0969da",
		border: "#d0d7de",
	},
};

export function getTheme(name: ThemeName | string): Theme {
	return name in themes ? themes[name as ThemeName] : themes.default;
}

function normalizeHex(hex: string): string {
	const clean = hex.replace(/^#/, "");
	if (clean.length === 3) {
		return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
	}
	return `#${clean}`;
}

export interface CustomColors {
	bg_color?: string;
	title_color?: string;
	text_color?: string;
	icon_color?: string;
	border_color?: string;
}

export function resolveTheme(
	themeName: ThemeName | string,
	custom: CustomColors,
): Theme {
	const base = getTheme(themeName);
	return {
		bg: custom.bg_color ? normalizeHex(custom.bg_color) : base.bg,
		title: custom.title_color ? normalizeHex(custom.title_color) : base.title,
		text: custom.text_color ? normalizeHex(custom.text_color) : base.text,
		icon: custom.icon_color ? normalizeHex(custom.icon_color) : base.icon,
		border: custom.border_color
			? normalizeHex(custom.border_color)
			: base.border,
	};
}
