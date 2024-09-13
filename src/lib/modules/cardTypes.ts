type CardType = {
	name: string;
	icon: string;
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
	},
	{
		name: 'Spell',
		icon: 'mdi:sparkles'
	},
	{
		name: 'Talisman',
		icon: 'mdi:ring'
	}
];

// Fill with default values for undefined properties
export const cardTypes: CardType[] = _cardTypes.map((cardType) => ({
	...cardType,
	iconOrientation: cardType.iconOrientation ?? 'default'
}));

export type IsCardType = (typeof _cardTypes)[number]['name'];
