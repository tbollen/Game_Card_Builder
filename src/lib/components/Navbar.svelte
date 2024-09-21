<script lang="ts">
	// Set Routes
	import { base } from '$app/paths';
	const routes: Record<string, { path: string; icon: string; hidden?: boolean }> = {
		Home: {
			path: '/',
			icon: 'mdi:home',
			hidden: true
		},
		Editor: {
			path: 'edit',
			icon: 'mdi:pencil'
		},
		Collection: {
			path: 'collection',
			icon: 'mdi:book-outline'
		},
		About: {
			path: 'about',
			icon: 'mdi:information-outline'
		}
	};
	const routeNames = Object.keys(routes);

	let currentRoute: string;
	$: currentRoute = $page.url.pathname;

	// Imports
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
</script>

<section id="navigation" class="navbar">
	<a href="{base}/" id="logo" class="displayText websiteLogo">Card Builder</a>
	<nav class="links">
		{#each routeNames as routeName}
			{#if !routes[routeName].hidden}
				<div class="navItem navUnderline" class:active={currentRoute === routes[routeName].path}>
					<a href="{base}/{routes[routeName].path}">
						<!-- <Icon icon={routes[routeName].icon} /> -->
						{routeName}
					</a>
				</div>
			{/if}
		{/each}
	</nav>
	<div class="badges">
		<a class="badge" href="https://github.com/tbollen/Game_Card_Builder" target="_blank">
			<Icon icon="mdi:github" />
		</a>
	</div>
</section>

<style>
	#navigation {
		display: grid;
		/* Keep it centered */
		grid-template-columns: 1fr min-content 1fr;
		padding: 5px;
		/* Areas */
		grid-template-areas: 'logo links badges';
	}

	@media screen and (max-width: 750px) {
		#navigation {
			grid-template-columns: 1fr;
			grid-template-areas: 'logo badges' 'links links';
		}
	}

	.links {
		/* Placement */
		grid-area: links;
		/* Layout */
		display: flex;
		gap: 1.5rem;
		justify-content: center;
	}

	.navItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: min-content;
		/* For active state */
		position: relative;
		padding: 2px 4px;
		transition:
			color,
			font-weight 0.2s ease-in-out;
	}

	.navItem a {
		color: unset;
		text-decoration: unset;
	}

	.navUnderline::after {
		content: ' ';
		/* Placement */
		position: absolute;
		z-index: -1;
		bottom: 0;
		/* effect */
		--width: 0;
		left: calc(50% - var(--width) / 2);
		width: var(--width);
		/* Styling */
		height: 2px;
		background-color: var(--color-threat-2);
		/* Transition */
		transition: all 0.2s ease-in-out;
	}

	.active {
		font-weight: bold;
	}

	.active::after {
		--width: 100%;
	}

	.navItem:hover {
		font-weight: bold;
	}

	.navUnderline:hover::after {
		--width: 50%;
		background-color: var(--color-threat-2);
	}

	.websiteLogo {
		/* Grid Placement */
		grid-area: logo;
		/* Reset href properties */
		color: unset;
		text-decoration: unset;
		/* Styling */
		position: relative;
		font-size: 2rem;
		/* Add bg clipping */
		background: black;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		transition: all 0.2s ease-in-out;
	}

	.websiteLogo::before {
		content: 'Card Builder';
		position: absolute;
		z-index: -1;
		inset: 0;
		background: linear-gradient(90deg, var(--color-threat-2), var(--color-weave-2));
		background-clip: inherit;
	}

	.websiteLogo:hover {
		background: transparent;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.badges {
		/* Placement */
		grid-area: badges;
		/* Layout */
		display: flex;
		justify-content: end;
		align-items: center;
	}

	.badge {
		font-size: 1.5em;
		transition: all 0.2s ease-in-out;
		color: var(--color-text-2);
	}

	.badge:hover {
		color: var(--color-threat-2);
	}
</style>
