<script>
	import { createEventDispatcher, onDestroy } from 'svelte';

	/** @type {string} */
	export let title;
	/** @type {string} */
	export let content;
	/** @type {string} */
	export let targetId;
	/** @type {boolean} */
	export let isLast = false;

	const dispatch = createEventDispatcher();

	let top = 0;
	let left = 0;
	let highlight = { top: 0, left: 0, width: 0, height: 0 };
	let ready = false;

	function positionTooltip() {
		const target = document.getElementById(targetId);
		if (target) {
			const rect = target.getBoundingClientRect();
			top = rect.bottom + window.scrollY + 10;
			left = rect.left + window.scrollX;
			target.style.zIndex = '1001';
			target.style.position = 'relative';
			highlight = {
				top: rect.top + window.scrollY - 8,
				left: rect.left + window.scrollX - 8,
				width: rect.width + 16,
				height: rect.height + 16
			};
			ready = true;
		}
	}

	$: if (targetId) {
		positionTooltip();
	}

	if (typeof window !== 'undefined') {
		const rePos = () => positionTooltip();
		window.addEventListener('resize', rePos);
		window.addEventListener('scroll', rePos, { passive: true });
		// cleanup (Svelte will call return fn on destroy)
		onDestroy(() => {
			window.removeEventListener('resize', rePos);
			window.removeEventListener('scroll', rePos);
		});
	}
</script>
<div class="fixed inset-0 z-[1000]" aria-hidden="true">
	<!-- Click-catcher layer (button for accessibility) -->
	<button
		type="button"
		class="absolute inset-0 w-full h-full cursor-default focus:outline-none"
		aria-label="Skip onboarding"
		on:click={() => dispatch('skip')}
	></button>
	<!-- Spotlight highlight -->
	{#if ready}
		<div
			class="pointer-events-none absolute transition-all duration-200 rounded-xl"
			style="top:{highlight.top}px;left:{highlight.left}px;width:{highlight.width}px;height:{highlight.height}px;box-shadow:0 0 0 9999px rgba(0,0,0,0.35);border:2px solid #000;border-radius:12px;background:rgba(255,255,255,0.65);backdrop-filter:blur(2px);"
		></div>
	{/if}
</div>

<div
	class="absolute z-[1002] bg-white border-2 border-black p-4 shadow-lg max-w-xs rounded"
	style="top: {top}px; left: {left}px;"
>
	<h3 class="font-bold text-lg mb-2">{title}</h3>
	<p class="mb-4">{content}</p>
	<div class="flex justify-end space-x-2">
		<button on:click={() => dispatch('skip')} class="text-sm text-gray-600">Skip</button>
		{#if isLast}
			<button
				on:click={() => dispatch('complete')}
				class="px-3 py-1 font-bold text-white bg-green-600 border-2 border-black"
			>
				Finish
			</button>
		{:else}
			<button
				on:click={() => dispatch('next')}
				class="px-3 py-1 font-bold text-white bg-black border-2 border-black"
			>
				Next
			</button>
		{/if}
	</div>
</div>
