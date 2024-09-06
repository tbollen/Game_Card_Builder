<script lang="ts">
	// Import Item Store
	import { activeItem } from '$lib/stores/Items';
	//
	export let item = $activeItem;
	export let print: boolean = true;

	// Card Components
	import Skill from './Skill.svelte';

	import '$lib/styles/cardStyle.css';

	import Icon, { iconExists } from '@iconify/svelte';
	import { updated } from '$app/stores';

	// import card type options and icons
	import { cardTypes } from '$lib/modules/cardTypes';

	// Get card type, if not found use default [0]
	$: cardType = cardTypes.find((type) => type.name === item.type) || cardTypes[0];

	// Update the item description for renderering
	import renderMarkdown from '$lib/modules/renderDiceIconsInText';
	import { skillList } from '$lib/modules/skillCheckList';
	$: renderedItemDescription = renderMarkdown(item.description);

	// Check for icon
	$: iconOverride = item?.icon && iconExists(item.icon) ? item.icon : undefined;
</script>

<div class="card" class:print>
	<div id="topbanner">
		<div class="typeIcon left-{cardType.iconOrientation}" style="color: {cardType.color}">
			<Icon icon={iconOverride || cardType.icon} />
		</div>
		<h1 class="name">
			{item.name}
		</h1>
		<div class="typeIcon right-{cardType.iconOrientation}" style="color: {cardType.color}">
			<Icon icon={iconOverride || cardType.icon} />
		</div>
		{#if item?.subtitle}
			<h3 class="subtitle">
				{item.subtitle}
			</h3>
		{/if}
	</div>
	<p class="description">
		{@html renderedItemDescription}
	</p>

	{#if item?.aspects}
		{#each item?.aspects as aspect}
			<div class="aspect">
				<div class="aspectDescription description">
					{#if aspect?.name && aspect?.description}
						<span class="aspectName inTextName">{aspect.name}</span>
						{@html renderMarkdown(aspect.description)}
					{/if}
				</div>
			</div>
		{/each}
	{/if}

	{#if item?.specials}
		{#each item?.specials as special}
			<div class="aspect">
				<div class="aspectDescription description">
					{#if special?.name && special?.description}
						<span class="aspectName inTextName">{special.name}</span>
						{@html renderMarkdown(special.description)}
					{/if}
				</div>
			</div>
		{/each}
	{/if}
	<div id="fields" data-field-number={item?.fields?.length} class:hasSkillCheck={item?.skillCheck}>
		{#if item?.fields}
			{#each item.fields as field, i}
				<div class="field" id="field-{i}">
					<div class="fieldName">{field.name}</div>
					<div class="fieldValue">{@html renderMarkdown(field.description)}</div>
				</div>
			{/each}
			<!-- <div class="fieldDivider" /> -->
		{/if}
		{#if item?.skillCheck}
			<div id="skillcheck">
				<Skill card={item} />
			</div>
		{/if}
	</div>
</div>

<style>
	/* Card */
	.card {
		/* Layout */
		display: flex;
		flex-direction: column;
		/* Bring last child to bottom */
		& > :last-child {
			margin-top: auto;
		}
	}

	.card:not(.print) {
		background-color: var(--pearl);
	}

	.description {
		flex: 1 1 0;
		overflow: hidden;
		margin-bottom: 0.5em;
	}

	.editInCardField {
		all: unset;
		/* Sizing */
		display: block;
		width: 100%;
		height: fit-content;
	}

	.editInCardField.editing {
		border: solid 1px var(--weave);
	}

	.editInCardField.editing:hover,
	.editInCardField.editing:focus {
		background-color: var(--color-text-3);
	}

	#topbanner {
		display: grid;
		grid-template-columns: var(--icon-size) auto var(--icon-size);
		grid-template-rows: auto auto;
		align-items: center;
		justify-items: center;
		font-size: var(--icon-size);
	}

	.name {
		/* Font */
		text-align: center;
		font-weight: bold;
		font-size: var(--name-size);
		/* Position */
		grid-column: 2;
		/* Clear margins */
		margin: 0;
	}

	.inTextName {
		font-weight: 700;
	}
	.inTextName::after {
		content: ': ';
	}

	.typeIcon {
		grid-row: span 2;
	}

	.subtitle {
		/* Font */
		text-align: center;
		font-weight: 400;
		font-size: var(--subname-size);
		color: var(--obsidian);
		/* Position */
		grid-column: 2;
		/* Clear margins */
		margin: 0;
	}

	.description {
		font-size: 8pt;
	}

	.dice {
		color: red;
	}

	/* Fields */
	#fields {
		display: grid;
		grid-template-rows: repeat(auto, 1fr);
		gap: 4pt;
		grid-auto-flow: dense;
		grid-template-columns: 1fr 1fr 1fr;
	}

	#fields[data-field-number='1']:not(.hasSkillCheck) {
		grid-template-columns: 1fr;
	}
	#fields[data-field-number='2'] {
		grid-template-columns: 1fr 1fr;
	}

	#fields[data-field-number='4']:not(.hasSkillCheck) {
		grid-template-columns: 1fr 1fr;
	}

	/* Puts the last skill check field at the end, when skillcheck is present */
	#fields.hasSkillCheck > :nth-last-child(2) {
		grid-column-end: -1;
	}

	.fieldDivider {
		grid-column: span 3;
		border-top: 1px solid var(--obsidian);
	}

	.field {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.fieldName {
		font-size: 8pt;
		color: var(--color-text-2);
	}

	.fieldValue {
		font-size: 9pt;
	}

	#skillcheck {
		align-items: flex-start;
		grid-column: 1/3;
	}
</style>
