import { skillList } from '$lib/modules/skillCheckList';
const characteristics = Object.values(skillList).flat();

// Styling Types
import { type Color } from '$lib/types/colors';
import { type ArcaneRiftColors } from '$lib/types/colors';
import { type AvailableFonts } from '$lib/types/fonts';

export type ItemFields = {
	name?: string;
	description?: string;
};

export type SkillCheck = {
	characteristic?: keyof typeof skillList;
	skill?: (typeof characteristics)[number];
};

// Class for the Item
export class Item {
	// Initialise
	name: string = 'New Item';
	type: string = 'Item';
	subtitle?: string;
	icon?: string;
	description: string = 'Item Description';
	aspects?: ItemFields[];
	specials?: ItemFields[];
	skillCheck?: SkillCheck;
	fields?: ItemFields[];
	image: {
		url?: string;
		encodedImage?: string;
		name?: string;
		alt?: string;
		rotation: number;
		scale: number;
		x_offset: number;
		y_offset: number;
	} = {
		// Defaults for image
		rotation: 0,
		scale: 100,
		x_offset: 0,
		y_offset: 0
	};
	style: {
		// Changeable colors
		colorAccent: ArcaneRiftColors | Color;
		colorIcon?: ArcaneRiftColors | Color;
		colorText?: ArcaneRiftColors | Color;
		colorBackground?: ArcaneRiftColors | Color;
		colorCardBorder?: ArcaneRiftColors | Color;
		// Changeable fonts
		fontName?: AvailableFonts;
		fontAccents?: AvailableFonts;
		fontText?: AvailableFonts;
		// Font Sizes
		fontsizeName?: number;
		fontsizeSubtitle?: number;
		fontsizeText?: number;
		fontsizeCheck?: number;
	} = {
		// Defaults for style
		colorAccent: 'threat'
	};

	constructor(_item?: Partial<Item>) {
		// for each given property, assign it to the item
		if (_item) Object.assign(this, _item);
	}
	// Methods
}

export type ItemType = typeof Item;
