<!-- About -->
<script lang="ts">
	import Navbar from '$lib/partials/Navbar.svelte';

	// Test with modals
	import Dialog from '$lib/components/dialog/Dialog.Core.svelte';
	import Button from '$lib/components/coreComponents/Button.svelte';

	import dialog from '$lib/components/dialog/dialogs';

	// Version info
	const lastUpdated = import.meta.env.LAST_UPDATED;
</script>

<section id="header">
	<Navbar />
</section>

<section id="content">
	<h1 class="text-3xl font-bold underline">About this app</h1>
	{lastUpdated}
</section>

<style>
	section {
		padding: var(--padding);
	}
</style>
