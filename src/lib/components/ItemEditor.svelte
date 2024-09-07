<script lang="ts">
	// Core Components
	import Button from '$lib/components/coreComponents/Button.svelte';
	import Accordion from '$lib/components/coreComponents/Accordion.svelte';
	import Input from '$lib/components/coreComponents/EditInput.svelte';

	// DEPRECATED
	import { editItem } from '$lib/stores/Items';

	// Load selected item
	import { items } from '$lib/stores/Items';

	// Popup & Tooltips
	import { tooltip } from '$lib/modules/tooltip';

	// Import card types for editing options
	import { cardTypes } from '$lib/modules/cardTypes';
	import Icon, { iconExists, loadIcon } from '@iconify/svelte';

	// Get charactersistics and skills
	import { skillList, characteristics } from '$lib/modules/skillCheckList';

	// Advanced Mode for more flexible editing
	export let advancedMode: boolean = true;

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

	async function printCards() {
		window.print();
	}

	function saveItem() {
		// Save Item
		items.save();
		// Turn off edit mode
		// editMode = false;
	}

	onMount(() => {
		loadIconFromIconify($editItem.icon);
	});
</script>

<div id="editFields">
	<div id="cardInfo" class="editorRow">
		{$editItem.name} - {$editItem.id}
	</div>
	<hr class="divider" />
	<!-- Editing Options -->
	<div id="editHeader" class="editorRow">
		<!-- Advanced -->
		<Button
			click={() => (advancedMode = !advancedMode)}
			stateOn={advancedMode}
			variant="flipped"
			color="weave"
			icon="memory:anvil"
		>
			Advanced
		</Button>
		<!-- Download -->
		<Button click={() => alert('Coming Soon!')} variant="filled" icon="memory:download">
			Download
		</Button>

		<!-- Save -->
		<Button click={saveItem} variant="filled" icon="memory:floppy-disk">Save</Button>
		<!-- Print -->
		<Button click={printCards} icon="mdi:printer">Print Card</Button>
	</div>
	<hr class="divider" />
	<!-- Editing -->
	<!-- Main Fields -->
	<Accordion>
		<h1 slot="head">Name and Type</h1>
		<div slot="content" class="inputGrid">
			<!-- Name -->
			<Input property="name" />
			<Input property="subtitle" />
			<!-- Type -->
			<label for="type">Type</label>
			<select
				id="type"
				bind:value={$editItem.type}
				on:change={() => items.itemSet({ type: $editItem.type })}
				placeholder="Type"
			>
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
		<h1 slot="head">Main Text</h1>
		<!-- Description -->
		<div slot="content" class="mainFields">
			<Input
				property="description"
				type="textarea"
				rows="5"
				placeholder="Edit the description here"
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
									click={() => items.removeField('aspects', i)}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/if}
			<Button icon="mdi:plus" size="small" click={() => items.addEmptyField('aspects')}>Add</Button>
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
									click={() => items.removeField('specials', i)}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/if}
			<Button icon="mdi:plus" size="small" click={() => items.addEmptyField('specials')}>Add</Button
			>
		</div>
	</Accordion>
	<!-- Fields -->
	<hr class="divider" />
	<Accordion>
		<h1 slot="head">Fields</h1>
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
									click={() => items.removeField('fields', i)}
								/>
							</div>
							<label for="special-{i}-description">Value</label>
							<input type="text" id="special-{i}-description" bind:value={field.description} />
						</div>
					{/each}
				{/if}
			</div>
			<label for="editorSpecials" class="category buttonLine">
				<Button icon="mdi:plus" size="small" click={() => items.addEmptyField('fields')}
					>Add Field</Button
				>
			</label>
		</div>
	</Accordion>
	<!-- Image -->
	<hr class="divider" />
	<Accordion>
		<h1 slot="head">Image</h1>
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
				click={() => items.resetImagePosition()}
			>
				Reset Position</Button
			>
		</div>
	</Accordion>
</div>

<style>
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

	h1 {
		font-weight: bold;
		font-size: 1em;
		margin: 0;
	}

	label {
		font-weight: bold;
		font-size: 0.8em;
		justify-self: start;
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

	option:not(.preferred) + .preferred {
		font-weight: thin;
		color: var(--color-text-2);
	}

	option.preferredOption {
		font-weight: bold;
	}

	input.warning {
		background-color: var(--color-threat-4) !important;
	}
</style>
