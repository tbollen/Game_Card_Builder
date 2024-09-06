<!-- Collection -->
<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/coreComponents/Button.svelte';
	import Gamecard from '$lib/components/Gamecard.svelte';
	import GamecardBack from '$lib/components/GamecardBack.svelte';

	import { items } from '$lib/stores/Items';

	// Svelte stuff
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	//
	$: cards = items.items;

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
		items.destroy(id);
	}

	function editCard(id: string) {
		items.setActiveItem(id);
		// Navigate to editor
		// window.location.href = '/editor';
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
		controls - {selectedCards.size} cards selected
	</section>
	{#if renderCards}
		<section
			id="viewer"
			transition:fly={{ delay: 200, duration: 1200, opacity: 0, y: 40, easing: expoOut }}
		>
			{#each cards as card}
				<button
					class="cardInViewer"
					class:isSelected={selectedCards.has(card.id)}
					id={card.id}
					on:click={() => toggleCardSelection(card.id)}
				>
					<!-- Edit Options -->
					{#if selectedCards.size < 2}
						<div class="editOptions">
							<Button icon="mdi:zoom-in" />
							<Button icon="mdi:pencil" click={() => editCard(card.id)} />
							<Button icon="mdi:content-copy" />
							<Button icon="mdi:trash-can" color="threat" click={() => deleteCard(card.id)} />
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

	.editOptions {
		/* Placement */
		position: absolute;
		bottom: 5%;
		left: 70%;
		z-index: 1;
		/* Layout */
		display: flex;
		gap: 3px;
		justify-content: center;
		align-items: center;
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

	.cardInViewer:focus .frontSideCard,
	.cardInViewer:hover .frontSideCard {
		box-shadow: 10px 10px 15px var(--color-text-1);
		transform: rotate(-5deg);
	}

	.cardInViewer:focus .backSideCard,
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
