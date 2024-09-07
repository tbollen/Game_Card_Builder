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

	// Methods for adding new fields and editing
	addEmptyField(fieldType: FieldTypes) {
		const emptyField = { name: fieldType, description: 'text' };
		let _fields = this[fieldType];
		if (_fields) {
			// If there are already fields, push
			_fields.push(emptyField);
		} else {
			// Otherwise, create a new array
			_fields = [emptyField];
		}
		// Update to match
		this[fieldType] = [..._fields];
		this.update();
	}

	removeField(fieldType: FieldTypes, index: number) {
		let _fields = this[fieldType];
		if (!_fields) throw new Error(`Field type ${fieldType} not found in ${this.name} (${this.id})`);
		// If there are already fields, remove
		_fields.splice(index, 1);
		// Update to match
		this[fieldType] = [..._fields];
		this.update();
	}

	// Image editing
	resetImagePosition(property?: 'x_offset' | 'y_offset' | 'rotation' | 'scale') {
		if (this.image == undefined) return;
		if (property) this.image[property] = property == 'scale' ? 100 : 0;
		this.image.x_offset = 0;
		this.image.y_offset = 0;
		this.image.rotation = 0;
		this.image.scale = 100;
		this.update();
	}

	private update() {
		// Trigger reactivity (hacky, but effective)
		editItem.update(() => this);
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
	// Basic Methods

	getItem(_target: string | StoredItem): StoredItem {
		if (_target instanceof StoredItem) return _target;
		const _item = this.items.find((item) => item.id === _target);
		if (!_item) throw new Error(`Item with id: ${_target} not found in items`);
		return _item;
	}

	getFirstItem(): StoredItem {
		if (this.items.length == 0) this.addNewItem();
		return this.items[0];
	}

	getItemId(_item: StoredItem): string {
		if (!this.items.includes(_item)) throw new Error(`Given Item not found in items`);
		return _item.id;
	}

	setItem(_id: string, itemUpdate: Partial<Item>) {
		// Get the items and update	the selected item
		let _items = this.items;
		_items = _items.map((item) => {
			if (item.id === _id) {
				return { ...item, ...itemUpdate } as StoredItem; //Override given properties from itemUpdate
			} else {
				return item;
			}
		});
		// Update the itemstore
		this.items = _items;
	}

	//
	// DEPRECATED
	//

	// Item Management
	addNewItem(_item?: Partial<StoredItem>) {
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

	duplicateItem(_base: string | StoredItem) {
		const _item = this.getItem(_base);
		// Extract only the properties that should be duplicated
		const _newItem = { ..._item };
		this.addNewItem(_newItem);
	}

	destroy(_id: string) {
		let _idSet = this.idSet;
		let _items = this.items;
		if (this.items.length < 2) {
			alert('Cannot destroy last item');
			throw new Error('Cannot destroy last item');
		}
		try {
			// Remove item from Items
			const _targetItem = this.getItem(_id);
			const confirmed = window.confirm(
				`Are you sure you want to delete the card "${_targetItem.name}?" (id: ${_id})`
			);
			// If confirmed, remove item
			if (!confirmed) return;
			_items = _items.filter((item) => item.id !== _targetItem.id);
			// Update idSet
			if (!_idSet.has(_id)) return console.error(`ID (${_id}) not found in idSet`);
			_idSet.delete(_id);
			// Update Items
			this.items = _items;
			this.idSet = _idSet;
		} catch (error) {
			// If item not found, re-throw error
			console.error(error);
		}
	}

	// Active Item Stuff
	getActiveItem(): StoredItem {
		if (!this.activeItem) this.activeItem = this.items[0];
		return this.activeItem;
	}

	setActiveItem(_target: string | StoredItem) {
		if (_target instanceof StoredItem) this.activeItem = _target;
		else this.activeItem = this.getItem(_target);
	}

	// Item editing
	itemSetSuper(updates: Partial<StoredItem>) {
		Object.assign(this.getActiveItem(), updates);
	}

	// Field editing
	addEmptyField(_target: string | StoredItem, fieldType: FieldTypes = 'fields') {
		let _item = this.getItem(_target);
		_item.addEmptyField(fieldType);
		this.setItem(_item.id, _item);
	}

	removeField(_target: string | StoredItem, fieldType: FieldTypes = 'fields', index: number) {
		let _item = this.getItem(_target);
		_item.removeField(fieldType, index);
		this.setItem(_item.id, _item);
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

	private updateItems() {
		// editItem.update(() => this.getActiveItem());
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
// export let items = localStoreItems instanceof ItemStore ? localStoreItems : new ItemStore();
export let items = new ItemStore();
export let editItem = writable<StoredItem>(items.getFirstItem());
