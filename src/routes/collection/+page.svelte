<!-- Collection -->
<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/coreComponents/Button.svelte';
	import Gamecard from '$lib/components/Gamecard.svelte';
	import GamecardBack from '$lib/components/GamecardBack.svelte';

	import { editItem } from '$lib/stores/Items';
	import { items } from '$lib/stores/Items';
	$: _items = items;

	// Svelte stuff
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let selectedCards = new Set();

	function toggleCardSelection(id: string) {
		console.debug(`${!selectedCards.has(id) ? 'added' : 'removed'} card selection: ${id}`);
		if (selectedCards.has(id)) {
			selectedCards.delete(id);
		} else {
			selectedCards.add(id);
		}
		// Force svelte to recognise changes
		selectedCards = selectedCards;
	}

	function deleteCard(id: string) {
		// Confirmation
		console.error(items.items);
		items.destroy(id);
		// Remove from selected cards
		selectedCards.delete(id);
		selectedCards = selectedCards;
	}

	function removeUnavailableCardsFromSelection() {
		// if the ID's in the set are not in items anymore, remove them
		for (const id of selectedCards as Set<string>) {
			if (!items.idSet.has(id)) {
				selectedCards.delete(id);
			}
		}
	}

	function editCard(id: string) {
		items.setActiveItem(id);
		$editItem = items.getActiveItem();
		// Navigate to editor
		goto(`${base}/edit`);
	}

	function duplicateCard(id: string) {
		items.duplicateItem(id);
	}

	function addNew() {
		items.addNewItem();
		// goto editor
		updateItems();
	}

	function updateItems() {
		_items = items;
	}

	let renderCards = false;
	onMount(() => {
		renderCards = true;
	});
</script>

<main>
	<section id="header">
		<Navbar />
	</section>
	<section id="controls">
		<Button icon="mdi:plus" click={addNew}>New Card</Button>
		controls - {selectedCards.size} cards selected
	</section>
	{#if renderCards}
		<section
			id="viewer"
			transition:fly={{ delay: 200, duration: 1200, opacity: 0, y: 40, easing: expoOut }}
		>
			{#each _items.items as card}
				<button
					class="cardInViewer"
					class:isSelected={selectedCards.has(card.id)}
					id={card.id}
					on:click={() => toggleCardSelection(card.id)}
				>
					<!-- Edit Options -->
					{#if selectedCards.size < 2}
						<div class="editOptions">
							<Button icon="mdi:zoom-in" stopPropagation />
							<Button icon="mdi:pencil" stopPropagation click={() => editCard(card.id)} />
							<Button
								icon="mdi:content-copy"
								stopPropagation
								click={() => duplicateCard(card.id)}
							/>
							<Button
								icon="mdi:trash-can"
								color="threat"
								stopPropagation
								click={() => deleteCard(card.id)}
							/>
						</div>
					{/if}
					<div class="frontSideCard">
						<Gamecard item={card} />
					</div>
					<div class="backSideCard">
						<GamecardBack item={card} />
					</div>
				</button>
			{/each}
		</section>
	{/if}
</main>

<style>
	.cardInViewer {
		/* Reset button stuff */
		all: unset;
		/* Positioning */
		position: relative;
		/* Scaling down */
		height: fit-content;
		width: fit-content;
		transform: scale(0.8);
		margin: 5mm;
		/* Click */
		cursor: pointer;
	}

	.cardInViewer:hover,
	.cardInViewer:focus-visible {
		z-index: 100;
	}

	.editOptions {
		/* Placement */
		position: absolute;
		bottom: -20px;
		width: 100%;
		z-index: 1;
		/* Layout */
		display: flex;
		gap: 3px;
		justify-content: center;
		align-items: center;
		padding: 10px;
		/* Styling */
		font-size: 2em;
		/* Effect */
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.2s ease-in-out;
	}

	.cardInViewer:hover .editOptions,
	.editOptions:focus-within {
		transform: translateY(0px);
		opacity: 1;
	}

	.frontSideCard {
		/* Positioning */
		position: relative;
		transition: all 0.4s ease-in-out;
		box-sizing: content-box;
	}

	.backSideCard {
		/* Positioning */
		position: absolute;
		top: 0%;
		left: 0%;
		z-index: -1;
		transition: all 0.4s ease-in-out;
	}

	.cardInViewer:focus-visible .frontSideCard,
	.cardInViewer:hover .frontSideCard {
		box-shadow: 10px 10px 15px var(--color-text-1);
		transform: rotate(-5deg);
		/* Move effect for other cards */
		margin-right: 25px;
	}

	.cardInViewer:focus-visible .backSideCard,
	.cardInViewer:hover .backSideCard {
		left: 60%;
		transform: rotate(5deg);
		box-shadow: 10px 10px 15px var(--color-text-3);
	}

	.cardInViewer.isSelected .frontSideCard::after,
	.cardInViewer.isSelected .backSideCard::after {
		content: '';
		position: absolute;
		inset: -5px;
		background-color: var(--color-blossom-2);
		opacity: 1;
		z-index: -1;
	}
</style>
