<script lang="ts">
	// Core Components
	import Button from '$lib/components/coreComponents/Button.svelte';
	import Accordion from '$lib/components/coreComponents/Accordion.svelte';

	// DEPRECATED
	import { editItem } from '$lib/stores/Items';

	// Load selected item
	import { items } from '$lib/stores/Items';

	// Popup & Tooltips
	import { tooltip } from '$lib/modules/tooltip';

	// Import card types for editing options
	import { cardTypes } from '$lib/modules/cardTypes';
	import Icon, { iconExists, loadIcon } from '@iconify/svelte';
	import { cardStylePresets, defaultCardStyle } from '$lib/types/colors';
	import { suggestedColors } from '$lib/styles/colorScheme';
	import { availableFonts } from '$lib/types/fonts';

	// Get charactersistics and skills
	import { skillList, characteristics } from '$lib/modules/skillCheckList';

	// Advanced Mode for more flexible editing
	export let advancedMode: boolean = false;

	// Iconify
	function loadIconFromIconify(icon: string | undefined) {
		//wait for mount
		if (icon == undefined) return;
		if (iconExists(icon)) return;
		loadIcon(icon);
	}

	//

	let selectedSkill: (typeof characteristics)[number] | undefined = $editItem.skillCheck?.skill;
	let selectedChar: keyof typeof skillList | undefined = $editItem.skillCheck?.characteristic;
	$: selectedChar && updateSkill('char');
	$: selectedSkill && updateSkill('skill');

	function updateSkill(priority?: 'char' | 'skill') {
		if (selectedChar == undefined && selectedSkill == undefined) {
			$editItem.skillCheck = undefined;
			return;
		}
		if (
			priority == 'char' &&
			selectedChar != undefined &&
			//the selected skill is not part of the selected characteristic
			skillList[selectedChar].some((skill) => skill != selectedSkill)
		) {
			selectedSkill = skillList[selectedChar][0];
		} else if (
			priority == 'skill' &&
			selectedSkill != undefined &&
			//the selected characteristic matches the selected skill
			Object.values(skillList).some((charSkills) =>
				charSkills.some((skill) => skill == selectedSkill)
			)
		) {
			selectedChar = Object.keys(skillList).find((char) =>
				skillList[char as keyof typeof skillList].some((skill) => skill == selectedSkill)
			) as keyof typeof skillList;
		}
		$editItem.skillCheck = { characteristic: selectedChar, skill: selectedSkill };
	}

	function resetSkill() {
		$editItem.skillCheck = undefined;
		selectedSkill = undefined;
		selectedChar = undefined;
	}

	// Button to add new fields
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	async function printCards() {
		window.print();
	}

	function downloadItem() {
		// find if the item already exists
		items.download();
	}

	let showSaved: boolean = false;

	function saveItem() {
		items.setItem($editItem.id, $editItem);
		items.save();
		showSaved = true;
		setTimeout(() => (showSaved = false), 2000);
	}

	function toggleAdvancedMode() {
		advancedMode = !advancedMode;
		// Set configs
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.setItem('advancedMode', advancedMode ? 'true' : 'false');
		}
	}

	function presetToCustom() {
		// $editItem.stylePreset = 'custom';
		$editItem.useStylePreset('custom');
	}

	// Style components for looping
	const availableColorOptions = Object.keys(
		$editItem.style.color
	) as (keyof typeof $editItem.style.color)[];
	const availableFontOptions = Object.keys(
		$editItem.style.font
	) as (keyof typeof $editItem.style.font)[];
	const availableFontSizeOptions = Object.keys(
		$editItem.style.fontsize
	) as (keyof typeof $editItem.style.fontsize)[];

	$: console.debug('Logging the editItem', $editItem);

	let localDate: string = '';
	let mounted = false;
	onMount(() => {
		loadIconFromIconify($editItem.icon);
		mounted = true;

		// Load configs
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.getItem('advancedMode');
			advancedMode = localStorage.getItem('advancedMode') == 'true';
		}
	});

	$: if (mounted) {
		localDate = new Date($editItem.dateCreated).toLocaleDateString();
	}
</script>

<div id="editFields">
	<div id="cardInfo" class="editorRow">
		<div class="cardInfoBlock">
			<div id="cardName" class="infoBlockMajor">
				{$editItem?.name}
			</div>
			<div id="cardId" class="infoBlockMinor">
				id: {$editItem?.id}
			</div>
		</div>

		<div class="cardInfoBlock">
			<div id="cardCreator" class="infoBlockMajor">
				{$editItem?.creator}
			</div>
			<div id="cardDate" class="infoBlockMinor">
				{localDate}
			</div>
		</div>
	</div>
	<hr class="divider" />
	<!-- Editing Options -->
	<div id="editHeader" class="editorRow">
		<!-- Advanced -->
		<Button
			click={toggleAdvancedMode}
			stateOn={advancedMode}
			variant="flipped"
			color="weave"
			icon="memory:anvil"
		>
			Advanced
		</Button>
		<!-- Download -->
		<Button click={downloadItem} variant="filled" icon="memory:download">Download</Button>

		<!-- Save -->
		<Button
			click={saveItem}
			color={showSaved ? 'success' : 'blossom'}
			variant="filled"
			icon={showSaved ? 'mdi:check' : 'memory:floppy-disk'}>Save</Button
		>
		<!-- Print -->
		<Button click={printCards} icon="mdi:printer">Print Card</Button>
	</div>
	<hr class="divider" />
	<!-- Editing -->
	<!-- Main Fields -->
	<Accordion>
		<div slot="head">Name and Type</div>
		<div slot="content" class="inputGrid">
			<!-- Name -->
			<label for="name">Name</label>
			<input type="text" id="name" bind:value={$editItem.name} placeholder="Name" />
			<!-- Subtitle -->
			<label for="subtitle">Subtitle</label>
			<input type="text" id="subtitle" bind:value={$editItem.subtitle} placeholder="Subtitle" />

			<!-- Type -->
			<label for="type">Type</label>
			<select id="type" bind:value={$editItem.type} placeholder="Type">
				{#each cardTypes as cardType}
					<option value={cardType.name}>{cardType.name}</option>
				{/each}
			</select>
			<!-- Icon Override -->
			{#if advancedMode}
				<label for="iconOverride">
					Icon
					<Icon class="advancedIcon" icon="memory:anvil" />
				</label>
				<input
					type="text"
					id="iconOverride"
					class:warning={!iconExists($editItem?.icon || 'mdi:sack')}
					bind:value={$editItem.icon}
					on:input={() => loadIconFromIconify($editItem.icon)}
					placeholder={cardTypes.find((type) => type.name == $editItem.type)?.icon ||
						'Icon from Iconify'}
				/>
			{/if}
		</div>
	</Accordion>
	<!-- END -->
	<hr class="divider" />
	<Accordion>
		<div slot="head">Main Text</div>
		<!-- Description -->
		<div slot="content" class="mainFields">
			<label for="description">Description</label>
			<textarea
				name="description"
				id="description"
				rows="3"
				placeholder="Edit the description here"
				bind:value={$editItem.description}
			/>
			<!-- Aspects -->
			<label for="editorAspects" class="category buttonLine"> Aspects </label>
			{#if $editItem.aspects?.length}
				<div class="fieldList">
					{#each $editItem.aspects as aspect, i}
						<div class="fieldItem">
							<label for="aspect-{i}-name">Name</label>
							<input type="text" id="aspect-{i}-name" bind:value={aspect.name} />
							<label for="aspect-{i}-description">Description</label>
							<textarea
								name="description"
								id="editorAspects"
								rows="2"
								placeholder="Edit the description here"
								bind:value={aspect.description}
							/>
							<div class="fieldButtons">
								<Button
									color="plain"
									icon="mdi:trash"
									size="small"
									click={() => $editItem.removeField('aspects', i)}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/if}
			<Button icon="mdi:plus" size="small" click={() => $editItem.addEmptyField('aspects')}
				>Add</Button
			>
			<hr class="divider" />
			<!-- Specials -->
			<label for="editorSpecials" class="category buttonLine"> Specials </label>
			{#if $editItem.specials?.length}
				<div class="fieldList">
					{#each $editItem.specials as special, i}
						<div class="fieldItem">
							<label for="special-{i}-name">Name</label>
							<input type="text" id="special-{i}-name" bind:value={special.name} />
							<label for="special-{i}-description">Description</label>
							<textarea
								name="description"
								id="editorAspects"
								rows="2"
								placeholder="Edit the description here"
								bind:value={special.description}
							/>
							<div class="fieldButtons">
								<Button
									color="plain"
									icon="mdi:trash"
									size="small"
									click={() => $editItem.removeField('specials', i)}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/if}
			<Button icon="mdi:plus" size="small" click={() => $editItem.addEmptyField('specials')}
				>Add</Button
			>
		</div>
	</Accordion>
	<!-- Fields -->
	<hr class="divider" />
	<Accordion>
		<div slot="head">Fields</div>
		<div slot="content" class="mainFields">
			<!-- Fields -->
			<div class="fieldList">
				<div class="fieldItem">
					<label for="characteristic">Characteristic</label>
					<select id="characteristic" bind:value={selectedChar}>
						{#each characteristics as characteristic}
							<option value={characteristic}>{characteristic}</option>{/each}
					</select>
					<label for="skill">Skill</label>
					<select id="skill" bind:value={selectedSkill}>
						{#each Object.entries(skillList) as [charName, skills]}
							{#each skills as skill}
								<option
									class:preferredOption={selectedChar != undefined &&
										skillList[selectedChar].includes(skill)}
									value={skill}>[{charName}]: {skill}</option
								>
							{/each}
						{/each}
					</select>
					<div class="fieldButtons">
						<Button color="plain" icon="mdi:trash" size="small" click={resetSkill} />
					</div>
				</div>
				<hr class="divider" />
				{#if $editItem.fields?.length}
					{#each $editItem.fields as field, i}
						<div class="fieldItem">
							<label for="special-{i}-name">Name</label>
							<input type="text" id="special-{i}-name" bind:value={field.name} />
							<div class="fieldButtons">
								<Button
									color="plain"
									icon="mdi:trash"
									size="small"
									click={() => $editItem.removeField('fields', i)}
								/>
							</div>
							<label for="special-{i}-description">Value</label>
							<input type="text" id="special-{i}-description" bind:value={field.description} />
						</div>
					{/each}
				{/if}
			</div>
			<label for="editorSpecials" class="category buttonLine">
				<Button icon="mdi:plus" size="small" click={() => $editItem.addEmptyField('fields')}
					>Add Field</Button
				>
			</label>
		</div>
	</Accordion>
	<!-- Image -->
	<hr class="divider" />
	<Accordion>
		<div slot="head">Image</div>
		<div slot="content" class="inputGrid">
			{#if advancedMode}
				<!-- Image Name -->
				<label for="imgName">
					Name
					<Icon class="advancedIcon" icon="memory:anvil" />
				</label>
				<input
					type="text"
					id="imgName"
					bind:value={$editItem.image.name}
					placeholder={$editItem.name}
				/>
			{/if}

			<!-- URL -->
			<label for="url">URL</label>
			<input
				type="text"
				id="url"
				bind:value={$editItem.image.url}
				placeholder="Paste image URL here"
			/>

			<!-- Position X -->
			<label for="xPosition">X Offset: {Math.round($editItem.image.x_offset || 0)}</label>
			<input
				type="range"
				name="xPosition"
				id="xPosition"
				bind:value={$editItem.image.x_offset}
				min="-50"
				max="50"
				list="positions"
			/>
			<!-- Position Y -->
			<label for="yPosition">Y Offset: {Math.round($editItem.image.y_offset || 0)}</label>
			<input
				type="range"
				name="yPosition"
				id="yPosition"
				bind:value={$editItem.image.y_offset}
				min="-50"
				max="50"
				list="positions"
			/>
			<datalist id="positions">
				<option value="0" />
				<option value="-10" />
				<option value="10" />
			</datalist>
			<!-- Rotation -->
			<label for="rotation">Rotation: {Math.round($editItem.image.rotation || 0)}°</label>
			<input
				type="range"
				name="rotation"
				id="rotation"
				bind:value={$editItem.image.rotation}
				min="-180"
				max="180"
				list="rotations"
			/>
			<!-- Scale -->
			<label for="scale">Scale: {$editItem.image.scale}%</label>
			<input
				type="range"
				name="scale"
				id="scale"
				list="scales"
				bind:value={$editItem.image.scale}
				min="25"
				max="300"
			/>
			<datalist id="scales">
				<option value="50" />
				<option value="100" />
				<option value="150" />
				<option value="200" />
				<option value="250" />
			</datalist>
			<datalist id="rotations">
				<option value="0" />
				<option value="90" />
				<option value="-90" />
			</datalist>
			<Button
				color="plain"
				icon="mdi:refresh"
				size="small"
				click={() => $editItem.resetImagePosition()}
			>
				Reset Position</Button
			>
		</div>
	</Accordion>
	<!-- Styling -->
	<hr class="divider" />
	<Accordion>
		<div slot="head">Styling</div>
		<div slot="content" class="inputGridButton">
			<!-- Preset -->
			<label for="preset"> Style Preset </label>
			<select
				style="height: 2em;"
				id="preset"
				bind:value={$editItem.stylePreset}
				on:change={(e) => $editItem.useStylePreset($editItem.stylePreset || 'custom')}
				placeholder="Preset"
			>
				{#each Object.keys(cardStylePresets) as preset}
					<option value={preset}>{preset}</option>
				{/each}
			</select>
			<div class="buttonLine">
				{#if $editItem.stylePreset !== 'default'}
					<Button
						color="plain"
						icon="mdi:backup-restore"
						size="small"
						click={() => $editItem.useStylePreset('default')}
					/>
				{:else}
					<Button
						color="plain"
						icon="mdi:dice"
						size="small"
						click={() => {
							$editItem.useStylePreset('random');
						}}
					/>
				{/if}
			</div>
			<div />
			{#if advancedMode}
				<div class="fullLine headerLine">
					<Icon class="advancedIcon" icon="memory:anvil" />
					Custom Styling Options
				</div>

				<!-- Color Options -->
				<div class="fullLine headerLine">Color</div>
				{#each availableColorOptions as colorType}
					<label for="color-{colorType}">{colorType}</label>
					<div class="colorPickerLine">
						<input
							type="color"
							id="color-{colorType}"
							bind:value={$editItem.style.color[colorType]}
							on:change={presetToCustom}
							list="colorSuggestions"
						/>
						<span>{$editItem.style.color[colorType]}</span>
					</div>
					<div class="buttonLine">
						{#if $editItem.stylePreset === 'custom'}
							<Button
								color="plain"
								icon="mdi:restore"
								size="small"
								click={() => {
									$editItem.style.color[colorType] = defaultCardStyle.color[colorType];
									presetToCustom();
								}}
							/>
						{/if}
						<Button
							color="plain"
							icon="mdi:dice"
							size="small"
							click={() => {
								presetToCustom();
								const randomHex = Math.floor(Math.random() * 16777215).toString(16);
								$editItem.style.color[colorType] = `#${randomHex}`;
							}}
						/>
					</div>
				{/each}

				<!-- Color Suggestions -->
				<datalist id="colorSuggestions">
					<option value="#ffffff" />
					{#each suggestedColors as c}
						<option value={c} />
					{/each}
				</datalist>

				<!-- Font Size Options -->
				<div class="fullLine headerLine">Text Size</div>
				{#each availableFontSizeOptions as fontSizeOption}
					<label for="fontSize-{fontSizeOption}">{fontSizeOption}</label>
					<input
						type="number"
						id="fontSize-{fontSizeOption}"
						bind:value={$editItem.style.fontsize[fontSizeOption]}
					/>
					<div>...</div>
				{/each}
			{/if}

			<!-- Font Options -->
			<div class="fullLine headerLine">Fonts</div>
			{#each availableFontOptions as fontOption}
				<label for="font-{fontOption}">{fontOption}</label>
				<select id="font-{fontOption}" bind:value={$editItem.style.font[fontOption]}>
					{#each availableFonts as font}
						<option value={font}>{font}</option>
					{/each}
				</select>
				<div>...</div>
			{/each}
		</div>
	</Accordion>
</div>

<style>
	/* Card Info */
	#cardInfo {
		display: flex;
		gap: 0.5em;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.cardInfoBlock {
		display: flex;
		flex-direction: column;
		gap: 0;
		font-size: 0.8rem;
		text-align: center;
	}

	.cardInfoBlock:first-child {
		text-align: left;
	}

	.cardInfoBlock:last-child {
		text-align: right;
	}

	.infoBlockMinor {
		color: var(--color-text-2);
	}

	.infoBlockMajor {
		font-weight: 500;
		font-size: 1rem;
	}

	/*  */
	.editorRow {
		display: flex;
		align-items: center;
		gap: 0.5em;
		flex-wrap: wrap;
	}
	.inputGrid {
		display: grid;
		grid-template-columns: 6em 1fr;
		align-items: center;
		gap: 0.2em;
	}

	.inputGridButton {
		display: grid;
		grid-template-columns: 6em 2fr min-content;
		align-items: center;
		gap: 0.2em;
	}

	.fullLine {
		grid-column: 1 / -1;
	}

	.headerLine {
		font-weight: 500;
		font-size: 0.9rem;
		padding: 0.6em 0 0.2em 0;
		margin-bottom: 0.2em;
		border-bottom: 1px solid currentColor;
	}

	.fieldList {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.fieldItem {
		display: grid;
		gap: 0.2em;
		grid-template-columns: 6em 1fr min-content;
		grid-template-areas:
			'name nameInput fieldButtons'
			'desc descInput fieldButtons';
	}

	.fieldItem > .fieldButtons {
		grid-area: 'fieldButtons';
		grid-row: 1 / 3;
		grid-column: 3;
		justify-content: space-evenly;
		display: flex;
		flex-direction: column;
	}

	.mainFields {
		display: flex;
		flex-direction: column;
		gap: 0.2em;
	}

	.category {
		margin-top: 0.5em;
	}

	.buttonLine {
		display: flex;
		gap: 1em;
		align-items: center;
	}

	label {
		font-weight: 600;
		font-size: 0.8em;
		justify-self: start;
		/* Overlfow Fix */
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.divider {
		width: 100%;
		border-top: 1px solid var(--obsidian);
	}

	/* Specific Styles */

	:global(.advancedIcon) {
		color: var(--color-weave-2);
		vertical-align: text-bottom;
		font-size: 1.2em;
	}

	option.preferredOption {
		font-weight: 600;
	}

	input.warning {
		background-color: var(--color-threat-4) !important;
	}

	.colorPickerLine {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}

	.colorPickerLine > span {
		font-size: 0.8em;
		color: var(--color-text-1);

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
