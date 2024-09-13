type CardType = {
	name: string;
	icon: string;
	unique?: boolean;
	colorTheme?: 'normal' | 'night';
	color?: string;
	iconOrientation?: 'default' | 'outward' | 'inward';
};

const _cardTypes: CardType[] = [
	{
		name: 'Item',
		icon: 'mdi:sack'
	},
	{
		name: 'Ranged',
		icon: 'radix-icons:crosshair-2'
	},
	{
		name: 'Melee',
		icon: 'mdi:sword-cross'
	}
];

// Fill with default values for undefined properties
export const cardTypes: CardType[] = _cardTypes.map((cardType) => ({
	...cardType,
	color: cardType.color ?? 'var(--threat)',
	iconOrientation: cardType.iconOrientation ?? 'default'
}));

export type IsCardType = (typeof _cardTypes)[number]['name'];
