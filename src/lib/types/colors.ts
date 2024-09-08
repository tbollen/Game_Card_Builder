import { type AvailableFonts } from './fonts';

// Color Types
export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;
export type HSL = `hsl(${number}, ${number}%, ${number}%)`;
export type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;
export type Color = RGB | RGBA | HEX | HSL | HSLA;
export type cssVariable = `var(--${string})`;

// Arcane Rift Colors
export const arcaneRiftColorOptions: string[] = [
	'weave',
	'blossom',
	'threat',
	'success',
	'obsidian',
	'pearl'
];
export type ArcaneRiftColors = (typeof arcaneRiftColorOptions)[number];

export type CardStyleOptions = {
	color: {
		accent: Color | cssVariable;
		icon: Color | cssVariable;
		text: Color | cssVariable;
		background: Color | cssVariable;
		cardBorder: Color | cssVariable;
	};
	font: {
		name: AvailableFonts | cssVariable;
		accents: AvailableFonts | cssVariable;
		text: AvailableFonts | cssVariable;
	};
	fontsize: {
		text: number;
		name: number;
		subtitle: number;
		check: number;
		icon: number;
	};
};

// Style Presets
export const defaultCardStyle: CardStyleOptions = {
	color: {
		accent: 'var(--threat)',
		icon: 'var(--threat)',
		text: '#000000',
		background: '#ffffff',
		cardBorder: 'var(--obsidian)'
	},
	font: {
		name: 'default',
		accents: 'default',
		text: 'default'
	},
	fontsize: {
		text: 9,
		name: 13,
		subtitle: 10,
		check: 14,
		icon: 14
	}
};
export const cardStylePresets: Record<string, Partial<CardStyleOptions>> = {
	default: defaultCardStyle,
	enchanted: {
		color: {
			accent: 'var(--weave)',
			icon: 'var(--weave)',
			text: '#000000',
			background: '#ffffff',
			cardBorder: 'var(--weave)'
		},
		font: {
			name: 'default',
			accents: 'default',
			text: 'default'
		}
	}
};

export type CardStylePreset = keyof typeof cardStylePresets;
