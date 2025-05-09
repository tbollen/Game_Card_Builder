<!-- src/routes/+error.svelte -->
<script>
	export let error;
</script>

<main>
	<h1>Error {error?.type ? `(${error.type})` : ''}</h1>
	<p>Oops! Something went wrong.</p>
	{#if error?.message}
		<p><strong>Error Message:</strong> {error.message}</p>
	{/if}
	<p>Please try again later or contact support.</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		text-align: center;
	}

	h1 {
		color: red;
	}
</style>
