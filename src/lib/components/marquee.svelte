<script lang="ts">
	export let theme: 'blue' | 'red' | 'yellow' = 'blue';
</script>

<div
	class="marquee"
	class:text-brand-pink={theme === 'blue' || theme === 'red'}
	class:text-brand-red={theme === 'yellow'}
	class:bg-brand-blue={theme === 'blue'}
	class:bg-brand-red={theme === 'red'}
	class:bg-brand-yellow={theme === 'yellow'}
>
	<p class="content">
		<slot />
	</p>
	<p class="content">
		<slot />
	</p>
</div>

<style>
	.marquee {
		--gap: 0.7rem;
		@apply flex h-[6.25rem] w-full select-none items-center gap-[--gap] overflow-hidden border-y border-y-black text-xl font-bold lg:h-[19.375rem] lg:text-[7.5rem];
	}

	.content {
		@apply flex min-w-full flex-shrink-0 justify-around gap-[--gap];
	}

	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(-100% - var(--gap)));
		}
	}

	/* Pause animation when reduced-motion is set */
	@media (prefers-reduced-motion: reduce) {
		.content {
			animation-play-state: paused;
		}
	}

	/* Enable animation */
	.content {
		animation: scroll 30s linear infinite;
	}
</style>
