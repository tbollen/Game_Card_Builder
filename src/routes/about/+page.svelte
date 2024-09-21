<!-- About -->
<script lang="ts">
	import Navbar from '$lib/partials/Navbar.svelte';

	// Test with modals
	import Dialog from '$lib/components/coreComponents/Dialog.svelte';
	import Button from '$lib/components/coreComponents/Button.svelte';
	let showDialog = false;
</script>

<Navbar />

<h1 class="text-3xl font-bold underline">About this app</h1>

<button on:click={() => (showDialog = true)}> show modal </button>
<Dialog type="options" bind:show={showDialog} />
