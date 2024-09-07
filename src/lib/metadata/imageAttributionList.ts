// Import the type from lib/types (hacky but works)
import { type ImageAttribution } from '$lib/types/imageAttribution';

export const imageAttributionList: ImageAttribution[] = [
	{
		name: 'Pixel Art Village',
		fileUrl: '$lib/images/Pixel_Art_Village.png',
		webUrl: 'https://www.flickr.com/photos/deathhell/53711571492',
		creator: 'deathhell',
		date: new Date(2024, 4, 10),
		alt: 'Pixel Art Village'
	}
];
