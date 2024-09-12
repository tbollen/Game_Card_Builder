<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';
	import { base } from '$app/paths';
	// Svelte Components
	import Gamecard from '$lib/components/Gamecard.svelte';
	import GamecardBack from '$lib/components/GamecardBack.svelte';
	// Stores
	import { items } from '$lib/stores/Items';
	import { selectedItems } from '$lib/stores/selectedItems';
	//
	let cards = $selectedItems;
	let cardSet: typeof items.items = [];
	// Set Cards
	cardSet = items.items.filter((item) => cards.has(item.id));

	const cardHeight = 88;
	const cardWidth = 63;
	const pageHeight = 210;
	const pageWidth = 297;
	const pageMargin = 6;
	const cardGap = 5;

	const spaceY = (pageHeight - pageMargin) % cardHeight;
	const spaceX = (pageWidth - pageMargin) % cardWidth;
	const cardAmountY = Math.floor(pageHeight / cardHeight);
	const cardAmountX = Math.floor(pageWidth / cardWidth);
	const printMarginX = (pageWidth - cardWidth * cardAmountX - cardGap * (cardAmountX - 1)) / 2;
	const printMarginY = (pageHeight - cardHeight * cardAmountY - cardGap * (cardAmountY - 1)) / 2;

	const cardsPerPage = (cardAmountX * cardAmountY) / 2;

	// Create multiple sets from cardSet, each split by the amount of cards per page
	const cardSetSplit = Array.from({ length: Math.ceil(cardSet.length / cardsPerPage) }, (_, i) =>
		cardSet.slice(i * cardsPerPage, (i + 1) * cardsPerPage)
	);

	onMount(() => {
		console.debug('printing cards...', cards);
		// print
		window.print();
		window.onafterprint = () => {
			// go back
			goto(`${base}/collection`);
		};
		// go back
		goto(`${base}/collection`);
	});
</script>

{#each cardSetSplit as _cardSet, i}
	<div
		class="printArea"
		style="--borderX: solid {printMarginX}mm transparent; --borderY: solid {printMarginY}mm transparent;"
	>
		<div class="pageMarker">{i + 1}/{cardSetSplit.length}</div>
		{#each _cardSet as card, i}
			<Gamecard item={card} />
			<GamecardBack item={card} />
		{/each}
	</div>
{/each}

<style>
	@media print {
		@page {
			margin: 0;
			size: A4 landscape;
		}
		div.printArea {
			/* Page */
			--page-width: 297mm;
			--page-height: 209mm;
			width: var(--page-width) !important;
			height: var(--page-height) !important;
			box-sizing: border-box;
			padding: 0;
			position: relative;

			/* Card Layout */
			display: grid;
			grid-template-columns: repeat(auto-fill, 60mm);
			grid-template-rows: repeat(auto-fill, 90mm);
			justify-content: space-between;
			justify-items: center;

			/* Print Color Adjust */
			-webkit-print-color-adjust: exact; /* For WebKit browsers */
			print-color-adjust: exact; /* For WebKit browsers */
			color-adjust: exact; /* Standard property */
			border-top: var(--borderY);
			border-left: var(--borderX);
			border-right: var(--borderX);
			border-bottom: var(--borderY);
		}

		div.pageMarker {
			position: absolute;
			top: -8mm;
			left: -8mm;
		}
	}
</style>
