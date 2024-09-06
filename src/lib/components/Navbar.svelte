<script lang="ts">
	// Set Routes
	const routes: Record<string, { path: string; icon: string; hidden?: boolean }> = {
		Home: {
			path: '/',
			icon: 'mdi:home',
			hidden: true
		},
		Editor: {
			path: '/edit',
			icon: 'mdi:pencil'
		},
		Collection: {
			path: '/collection',
			icon: 'mdi:book-outline'
		},
		About: {
			path: '/about',
			icon: 'mdi:information-outline'
		}
	};
	const routeNames = Object.keys(routes);

	let currentRoute: string;
	$: currentRoute = window.location.pathname;

	// Imports
	import Icon from '@iconify/svelte';
</script>

<nav>
	{#each routeNames as routeName}
		<div class="navItem" class:active={currentRoute === routes[routeName].path}>
			<a href={routes[routeName].path}>
				<!-- <Icon icon={routes[routeName].icon} /> -->
				{routeName}
			</a>
		</div>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
	}

	.navItem {
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.navItem::after {
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
		background-color: var(--color-threat-3);
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

	.navItem:hover::after {
		--width: 50%;
		background-color: var(--color-threat-3);
	}
</style>
