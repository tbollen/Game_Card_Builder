<script lang="ts">
	// Core Components
	import Button from '$lib/components/coreComponents/Button.svelte';
	// Import Components
	import Gamecard from '$lib/components/Gamecard.svelte';
	import GamecardBack from '$lib/components/GamecardBack.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import DiceIcon from '$lib/components/coreComponents/DiceIcon.svelte';

	// Import Item Store
	import { editItem } from '$lib/stores/Items';
	import ItemEditor from '$lib/components/ItemEditor.svelte';

	// Import selected Cards store
	import { selectedItems } from '$lib/stores/selectedItems';

	import { items } from '$lib/stores/Items';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let editMode = true;

	function newEmptyItem() {
		const saveFirst = window.confirm('Do you want to save before creating a New Card?');
		if (saveFirst) {
			items.save();
		}
		items.addNewItem();
		$editItem = items.getActiveItem();
	}
	function toggleEditMode() {
		editMode = !editMode;
	}

	onMount(() => {
		// Load configs
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.getItem('advancedMode');
		}
	});
</script>

<main id="main">
	<!-- Header -->
	<section id="header">
		<Navbar />
	</section>
	<!-- Editor Pane -->
	{#if editMode}
		<section id="editor" transition:slide={{ duration: 200 }}>
			<div class="displayText editorTitle">Card Editor</div>
			<ItemEditor />
		</section>
	{/if}

	<!-- Card Pane -->
	<section id="cardView">
		<div class="buttonRow">
			<Button click={toggleEditMode} icon={editMode ? 'mdi:eye' : 'mdi:pencil'}
				>{editMode ? 'Viewing Mode' : 'Edit Card'}</Button
			>
			<Button click={newEmptyItem} icon="mdi:plus">New Card</Button>

			<a class="mobileOnly" href="#editor">Go to editor</a>
		</div>
		<div id="cardArea">
			<Gamecard item={$editItem} />
			<GamecardBack item={$editItem} />
		</div>
	</section>
</main>

<!-- Styles -->
<style>
	:global(body) {
		margin: 0;
	}
	#main {
		display: grid;
		/* Section with scroll */
		height: 100dvh;
		overflow-y: hidden;
		grid-template-areas: 'header header' 'cardView editor';
		grid-template-columns: fit-content max(2fr, fit-content);
		grid-template-rows: min-content 1fr;
	}

	/* Changed layout for mobile */
	.mobileOnly {
		display: none;
	}

	@media screen and (max-width: 750px) {
		#main {
			grid-template-areas: 'header' 'cardView' 'editor';
			grid-template-rows: min-content min-content min-content;
			grid-template-columns: 1fr;
			height: fit-content;
		}

		.mobileOnly {
			display: initial;
		}
	}

	section {
		padding: var(--padding);
		/* Size and scroll */
		overflow-y: auto;
	}

	section#header {
		grid-area: header;
	}

	section#editor {
		grid-area: editor;
		/* Styling */
		background-color: var(--color-surface-4);
		border-top-left-radius: 1em;
		/* Layout */
		display: flex;
		flex-direction: column;
		/* Size */
		min-width: 20em;
		box-sizing: border-box;
		/* Scrollbar */
		overflow-y: auto;
		scroll-behavior: auto;
	}

	section#editor > #editorFooter {
		margin-top: auto;
		padding-top: var(--padding);
		border-top: solid 1px black;
	}

	section#cardView {
		/* Nothing to see here */
	}

	div#cardArea {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		/* Gap */
		gap: 5mm;
		padding: 5mm;
	}

	.buttonRow {
		display: flex;
		gap: var(--padding);
	}

	.editorTitle {
		text-align: center;
		font-size: 2em;
	}
</style>
