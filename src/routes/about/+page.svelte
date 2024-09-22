<!-- About -->
<script lang="ts">
	import Navbar from '$lib/partials/Navbar.svelte';

	// Test with modals
	import Dialog from '$lib/components/dialog/Dialog.Core.svelte';
	import Button from '$lib/components/coreComponents/Button.svelte';

	import dialog from '$lib/components/dialog/dialogs';
</script>

<section id="header" style="padding: var(--padding);">
	<Navbar />
</section>

<h1 class="text-3xl font-bold underline">About this app</h1>
