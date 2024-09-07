import { Item } from '$lib/methods/Item';
export const defaultTemplates: Item[] = [
	new Item({
		name: '_Sword_',
		subtitle: 'Fine Melee Weapon',
		type: 'Melee',
		description: 'A fine sword',
		fields: [
			{
				name: 'to Hit',
				description: '+[di][di]'
			},
			{
				name: 'Use',
				description: 'Action'
			}
		],
		image: {
			url: 'https://static.wikia.nocookie.net/finalfantasy/images/b/ba/RW_Anastasia.jpg/revision/latest/scale-to-width-down/362?cb=20180223160156',
			scale: 100,
			x_offset: 0,
			y_offset: 0,
			rotation: 0
		}
	})
];
