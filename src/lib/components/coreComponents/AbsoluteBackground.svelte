<!-- Component that adds a background to any div by placing it behind it -->

<script lang="ts">
	import { type ImageAttribution } from '$lib/types/imageAttribution';
	export let image: ImageAttribution | undefined = undefined;
	export let classModifier: string | undefined = undefined;
	export let background: string = 'transparent';
	export let colorOpacity: number = 0.5;
	export let opacity: number = 0.5;
	export let imagePosition: string = 'initial';
	export let blendMode:
		| 'normal'
		| 'multiply'
		| 'screen'
		| 'overlay'
		| 'darken'
		| 'lighten'
		| 'color-dodge'
		| 'color-burn'
		| 'hard-light'
		| 'soft-light'
		| 'difference'
		| 'exclusion'
		| 'hue'
		| 'saturation'
		| 'color'
		| 'luminosity' = 'normal';

	const imageList: any = import.meta.glob(['$lib/images/*'], { as: 'url', eager: true });
	const imagePath = '/src/lib/images/' + image?.fileUrl;
</script>

<div class="absoluteBackground {classModifier}" style:opacity>
	<div
		class="absoluteBackground_bg"
		style:mix-blend-mode={blendMode}
		style:background
		style:opacity={colorOpacity}
	/>
	{#if image}
		<img
			class="absoluteBackground_img"
			style:object-position={imagePosition}
			src={imageList[imagePath]}
			alt={image.name}
		/>
	{/if}
</div>

<style>
	.absoluteBackground {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	.absoluteBackground_bg {
		position: absolute;
		inset: 0;
		height: 100%;
		width: 100%;
		z-index: -2;
	}

	.absoluteBackground_img {
		position: absolute;
		inset: 0;
		z-index: -3;
		/* Image settings and sizing */
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
</style>
