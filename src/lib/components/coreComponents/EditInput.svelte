<script lang="ts">
	// Import Item Store
	import { Item } from '$lib/methods/Item';
	import { items } from '$lib/stores/Items';
	//
	// Import Iconify for loading icons
	import { iconExists, loadIcon } from '@iconify/svelte';
	type Options = { name: string; value: string }[];
	//

	export let property: keyof Item;
	export let noLabel: boolean = false;
	export let label = property as string;
	export let type:
		| 'number'
		| 'text'
		| 'range'
		| 'checkbox'
		| 'radio'
		| 'textarea'
		| 'select'
		| undefined = setType();
	export let placeholder: string = `Input ${property} here...`;
	export let options: Options | string[] = [];
	export let datalist: string[] = [];
	export let isValid: boolean = true;
	export let rows: string | number = 3;

	// if options is an array of strings, convert to the object
	var _options: Options = [];
	if (options.length > 0 && typeof options[0] === 'string') {
		_options = options.map((n) => ({ name: n, value: n })) as Options;
	} else {
		_options = options as Options;
	}

	function setType(): typeof type {
		switch (typeof property as string) {
			case 'string':
				return 'text';
			case 'number':
				return 'number';
			case 'boolean':
				return 'checkbox';
			default:
				return 'text';
		}
	}
	let value = items.itemGetProperty(property);

	// Iconify
	function loadIconFromIconify(icon: string | undefined) {
		//wait for mount
		if (icon == undefined) return;
		if (iconExists(icon)) return;
		loadIcon(icon);
	}

	function handleInput(_value?: (typeof property)[keyof typeof property]) {
		// Load icon
		if (property === 'icon') loadIconFromIconify(_value as string);
		// Set value
		let val = _value ? _value : value;
		console.log(`Setting ${property}: `, val);
		items.itemSet({ [property]: val });
		//
	}
</script>

<!-- Label -->
{#if !noLabel}
	<label class="editInput_label" for="editor_{property}">{label}</label>
{/if}

<!-- Select Type -->
{#if options.length > 0 && type === 'select'}
	<select
		class="editInput"
		name={property}
		id="editor_{property}"
		bind:value
		on:input={() => handleInput()}
		{placeholder}
	>
		{#each _options as option}
			<option value={option.value}>{option.name}</option>
		{/each}
	</select>
{:else if type === 'textarea'}
	<textarea
		class="inputTextArea"
		bind:value
		on:input={() => handleInput()}
		name={property}
		id="editor_{property}"
		{placeholder}
		{rows}
	/>
{:else if type === 'text'}
	<input
		class="editInput"
		type="text"
		bind:value
		on:input={() => handleInput()}
		name={property}
		id="editor_{property}"
		{placeholder}
	/>
{:else if type === 'range'}
	<input
		class="editInput"
		bind:value
		on:input={() => handleInput()}
		name={property}
		id="editor_{property}"
		{placeholder}
	/>
{/if}
<!-- Set Datalist (if applicable) -->
{#if datalist.length > 0}
	<datalist>
		{#each datalist as option}
			<option value={option} />
		{/each}
	</datalist>
{/if}

<style>
	/* Styles */
	label {
		font-weight: bold;
		font-size: 0.8em;
		justify-self: start;
	}
</style>
