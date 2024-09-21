<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';

	type Option = {
		name: string;
		onClick?: () => void;
		autofocus?: boolean;
		response?: undefined | boolean | string;
	};

	// Props
	export let show: boolean;
	export let type: 'slot' | 'warning' | 'alert' | 'options' | 'confirm' | 'prompt' = 'slot';
	export let response: Option['response'] = undefined;
	export let message: string;
	export let options: Option[] | string[] = [
		{ name: 'Ok', autofocus: true, response: true },
		{ name: 'Cancel', response: false }
	];
	// Open and Close
	export function open() {
		show = true;
	}

	export function close() {
		dialog.close();
	}

	// Remap options
	const _options = (
		typeof options[0] === 'string' ? options.map((opt) => ({ name: opt })) : options
	) as Option[];

	switch (type) {
		case 'slot':
			break;
		case 'warning':
			message = 'Warning';
			break;
		case 'alert':
			message = 'Alert';
			break;
		case 'options':
			message = 'Are you sure?';
			break;
		case 'prompt':
			break;
	}

	let dialog: HTMLDialogElement;
	$: if (dialog && show) dialog.showModal();

	// Options
	function handleOption(option: Option) {
		if (option.onClick) option.onClick();
		if (option.response !== undefined) response = option.response;
		else response = option.name;
		console.log('Dialog responed with:', response);
		dialog.close();
	}

	function dismiss() {
		dialog.close();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (show = false)} on:click|self={dismiss} transition:fly>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<section id="head">
			{#if $$slots.header}
				<slot name="header" />
			{:else if $$slots.default}
				<slot />
			{:else if message !== undefined}
				<span class="message">{message}</span>
			{/if}
			<div class="closeButton">
				<Button click={dismiss} color="threat" icon="mdi:close" />
			</div>
		</section>
		{#if type === 'slot'}
			<slot />
		{:else if type === 'options'}
			<div id="options" class="buttons">
				{#each _options as option}
					<Button click={() => handleOption(option)}>{option.name}</Button>
				{/each}
			</div>
		{:else if type === 'warning'}
			<div id="warning" class="buttons">
				<Button click={dismiss}>Dismiss</Button>
			</div>
		{/if}
		<!-- svelte-ignore a11y-autofocus -->
	</div>
</dialog>

<style>
	/* Dialog Styles */
	dialog {
		max-width: 32em;
		min-width: 16em;
		border-radius: var(--border-radius);
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* HEAD */

	#head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 10px;
	}

	#head > .closeButton {
		margin-left: auto;
	}

	/* OPTIONS */

	.buttons {
		display: flex;
		justify-content: center;
		flex-direction: row;
		gap: 8px;
	}
</style>
