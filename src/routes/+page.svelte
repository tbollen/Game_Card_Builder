<script lang="ts">
	// Core Components
	import Button from '$lib/components/coreComponents/Button.svelte';
	// Import Components
	import Gamecard from '$lib/components/Gamecard.svelte';
	import GamecardBack from '$lib/components/GamecardBack.svelte';
	import DiceIcon from '$lib/components/coreComponents/DiceIcon.svelte';

	// Import Item Store
	import { activeItem } from '$lib/stores/Items';
	import ItemEditor from '$lib/components/ItemEditor.svelte';

	import { items } from '$lib/stores/Items';

	// Export to PDF section
	var cardSection: HTMLElement;
	async function printCards() {
		window.print();
	}

	function newEmptyItem() {}
</script>

<main id="main">
	<!-- Header -->
	<section id="header" class="hideOnPrint">
		<h1>Game Card Builder</h1>
		<Button click={newEmptyItem} icon="mdi:plus">New Card</Button>
	</section>
	<!-- Editor Pane -->
	<section id="editor" class="hideOnPrint">
		<h2>Card Editor</h2>
		<ItemEditor />
		<div id="editorFooter">
			<Button click={printCards} icon="mdi:printer">Print Card</Button>
		</div>
	</section>

	<!-- Card Pane -->
	<section id="cardView">
		<div id="cardArea" bind:this={cardSection}>
			<Gamecard item={$activeItem} />
			<GamecardBack item={$activeItem} />
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
		grid-template-areas: 'header editor' 'cardView editor';
		grid-template-columns: fit-content max(2fr, fit-content);
		grid-template-rows: min-content 1fr;
	}
	@media print {
		.hideOnPrint {
			display: none !important;
			visibility: hidden !important;
			position: absolute;
			top: 0;
			left: 0;
		}
		.showOnPrint {
			display: block;
		}
	}

	section {
		padding: var(--padding);
		/* Size and scroll */
		overflow-y: auto;
	}

	section#editor {
		grid-area: editor;
		background-color: aliceblue;
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
	}
</style>
