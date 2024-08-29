<script>
	import { afterNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';
	let open = false;

	afterNavigate(() => {
		open = false;
	});
</script>

<button
	class="flex h-full w-full items-center justify-center stroke-brand-blue stroke-2"
	class:open
	on:click={() => (open = !open)}
>
	<svg width="32" height="32" viewBox="0 0 32 32">
		<line id="top" x1="2" y1="9" x2="30" y2="9" />
		<line id="middle" x1="2" y1="16" x2="30" y2="16" />
		<line id="bottom" x1="2" y1="23" x2="30" y2="23" />
	</svg>
</button>

{#if open}
	<nav transition:slide class="fixed bottom-0 left-0 right-0 top-[--header-height] bg-brand-pink">
		<slot />
	</nav>
{/if}

<style>
	button > svg {
		@apply transition-transform;
	}

	button > svg > line {
		@apply transition-transform;
	}

	button.open svg {
		@apply scale-75;
	}

	button.open #top {
		transform: translate(11px, -2px) rotate(45deg);
		transform-origin: left top;
	}

	button.open #middle {
		opacity: 0;
	}

	button.open #bottom {
		transform: translate(11px, 1.5px) rotate(-45deg);
		transform-origin: left bottom;
	}

	/* Tablet - portrait - 1280px */
	@media only screen and (max-width: 1279px) {
	}
	/* Handheld - 768px */
	@media only screen and (max-width: 767px) {
	}
</style>
