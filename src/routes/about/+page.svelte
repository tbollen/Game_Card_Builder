<!-- About -->
<script lang="ts">
	import Navbar from '$lib/partials/Navbar.svelte';

	// Test with modals
	import Dialog from '$lib/components/dialog/Dialog.Core.svelte';
	import Button from '$lib/components/coreComponents/Button.svelte';

	import dialog from '$lib/components/dialog/dialogs';

	function openDialog() {
		dialog.choose(['a', 'b']).then((response) => {
			alert(response);
		});
	}
</script>

<Navbar />

<h1 class="text-3xl font-bold underline">About this app</h1>

<button on:click={openDialog}> show modal </button>
