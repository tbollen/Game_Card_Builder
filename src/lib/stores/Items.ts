import { writable } from 'svelte/store';
import { Item } from '$lib/methods/Item';

// Env variables
const replaceString = 'replaceMe';
const defaultUser = 'Guest';

export let testItem = new Item({
	name: 'Card name',
	type: 'Item',
	description:
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident soluta repellendus omnis excepturi? Esse obcaecati, harum iure fugit eaque earum.',

	skillCheck: {
		characteristic: 'Agility',
		skill: 'Acrobatics'
	},

	fields: [
		{
			name: 'Defense',
			description: 'Reflex'
		},
		{
			name: 'Use',
			description: 'Action'
		}
	]
});

export type FieldTypes = 'aspects' | 'specials' | 'fields';

// Generate a random ID, used for new items
function generateShortID(length: number = 8, prefix: string = ''): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = prefix;
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * chars.length);
		result += chars[randomIndex];
	}
	return result;
}

class StoredItem extends Item {
	id: string;
	isActive: boolean = false;
	isSelected: boolean = false;
	creator: string;
	dateCreated: Date;

	constructor(_storedItem?: Partial<StoredItem>, _id?: string) {
		// Apply values from Item
		super(_storedItem as Partial<Item>);
		// Set ID
		this.id = _id || _storedItem?.id || replaceString;
		// Set Creator (placeholder for now)
		this.creator = _storedItem?.creator || defaultUser;
		// Set Date Created to now
		this.dateCreated = _storedItem?.dateCreated || new Date();
	}
}
class ItemStore {
	items: StoredItem[] = [];
	idSet: Set<string> = new Set();
	idSettings = {
		idLength: 8,
		setName: 'c'
	};
	activeItem: StoredItem;

	constructor(_items?: StoredItem[]) {
		// Set Items
		this.items = _items || [];
		if (this.items.length == 0) this.addNewItem();
		if (this.items.length > 0) this.setActiveItem(this.items[0].id);

		// Make the idSet
		this.idSet = new Set(this.items.map((item) => item.id));
		this.activeItem = this.getActiveItem();
	}

	// Item Management
	addNewItem(_item?: Item) {
		let _items = this.items;
		let _idSet = this.idSet;
		const newItemId = this.generateUniqueId();
		const newItem = new StoredItem(_item, newItemId);
		// Add to items
		_items = [..._items, newItem];
		// Add id to idSet
		_idSet.add(newItemId);
		// Trigger reactivity
		this.items = _items;
		this.idSet = _idSet;
		// Set Active Item
		this.setActiveItem(newItemId);
		// Logging
		console.log(`New${_item ? '' : ' empty'} item added to database:`, newItem);
	}

	duplicateItem(_id: string) {
		const _item = this.getItem(_id);
		this.addNewItem(_item);
	}

	destroy(_id: string) {
		let _idSet = this.idSet;
		let _items = this.items;
		if (!_items.find((item) => item.id === _id))
			return console.error(`Item with id: ${_id} not found in items`);
		if (!_idSet.has(_id)) return console.error(`ID (${_id}) not found in idSet`);
		const itemName = this.itemGetProperty('name', _id);
		// Ask for confirmation
		const confirmed = window.confirm(
			`Are you sure you want to delete the card "${itemName}?" (id: ${_id})`
		);
		if (!confirmed) return;
		// Remove from items
		_items = _items.filter((item) => item.id !== _id);
		_idSet.delete(_id);
		// Update Items
		this.items = _items;
		this.idSet = _idSet;
	}

	getItem(_id?: string): StoredItem {
		return this.items.find((item) => item.id === _id) || this.items[0];
	}

	setItem(_id: string, updates: StoredItem) {
		const _item = this.items.find((item) => item.id === _id);
		if (!_item) return console.error(`Item with id: ${_id} not found in items`);
		Object.assign(_item, updates);
		this.items = [...this.items];
		// Update items
		this.updateItems();
	}

	// Active Item Stuff
	getActiveItem(): StoredItem {
		let _activeItem = this.items.find((item) => item.isActive) as StoredItem;
		if (!_activeItem) _activeItem = this.items[0];
		return _activeItem;
	}

	setActiveItem(id: string) {
		this.items.forEach((item) => {
			if (item.id === id) {
				item.isActive = true;
			} else {
				item.isActive = false;
			}
		});
	}

	// Item editing
	itemGetProperty(property: keyof Item, id?: string) {
		let _item = this.getActiveItem();
		if (id) _item = this.items.find((item) => item.id === id) as StoredItem;
		return _item[property];
	}

	itemSet(updates: Partial<Item>) {
		Object.assign(this.getActiveItem(), updates);
		this.activeItem = this.getActiveItem();
		this.items = [...this.items];
		// Update items
		this.updateItems();
	}

	itemSetSuper(updates: Partial<StoredItem>) {
		Object.assign(this.getActiveItem(), updates);
	}

	// Field editing
	addEmptyField(fieldType: FieldTypes = 'fields') {
		const _item = this.getActiveItem();
		const emptyField = { name: fieldType, description: 'text' };
		if (_item[fieldType]) _item[fieldType].push(emptyField);
		else _item[fieldType] = [emptyField];
		this.itemSet({ [fieldType]: _item[fieldType] });
		this.updateItems();
	}

	removeField(fieldType: FieldTypes = 'fields', index: number) {
		const _item = this.getActiveItem();
		if (_item == undefined || _item[fieldType] == undefined) return;
		if (index > _item[fieldType].length - 1) return;
		if (_item[fieldType]) _item[fieldType].splice(index, 1);
		this.itemSet({ [fieldType]: _item[fieldType] });
	}

	// Image editing
	resetImagePosition(property?: 'x_offset' | 'y_offset' | 'rotation' | 'scale') {
		const _item = this.getActiveItem();
		if (_item.image == undefined) return;
		if (property) _item.image[property] = property == 'scale' ? 100 : 0;
		_item.image.x_offset = 0;
		_item.image.y_offset = 0;
		_item.image.rotation = 0;
		_item.image.scale = 100;
		this.itemSet({ image: _item.image });
	}

	// DB Editing

	// ID Stuff
	private generateUniqueId(): string {
		let _itemId = generateShortID(this.idSettings.idLength, this.idSettings.setName);
		while (this.idSet.has(_itemId)) {
			_itemId = generateShortID(this.idSettings.idLength, this.idSettings.setName);
		}
		return _itemId;
	}

	private idIsUnique(_id: string): boolean {
		return !this.idSet.has(_id);
	}

	private updateItems() {
		editItem.update(() => this.getActiveItem());
		this.items = [...this.items];
	}

	save() {
		const stringifiedItems = JSON.stringify(this.items);
		console.error(this.items);
		localStorage.setItem('items', stringifiedItems);

		// Check
		const localStoreItems = localStorage.getItem('items');
		if (!localStoreItems) return;
		console.log('Items saved to local storage:', localStoreItems);
	}
}

// Get items from local storage
let localStoreItems = undefined;
if (typeof window !== 'undefined' && window.localStorage) {
	localStoreItems = localStorage.getItem('items');
	if (localStoreItems) {
		localStoreItems = new ItemStore(JSON.parse(localStoreItems));
		console.log('Items loaded from local storage:', localStoreItems);
	}
}

// Init store
// export let items = new ItemStore();
export let items = localStoreItems instanceof ItemStore ? localStoreItems : new ItemStore();
export let editItem = writable<StoredItem>(items.getItem());
