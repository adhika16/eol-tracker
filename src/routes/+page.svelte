<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import OnboardingStep from '$lib/components/OnboardingStep.svelte';

	/** @type {import('./$types').PageData} */
	// @ts-ignore
	export let data;
	/** @type {import('./$types').ActionData} */
	export let form;

	// @ts-ignore
	$: cycles = data.cycles || form?.cycles;
	// @ts-ignore
	$: error = data.error || form?.error;
	$: user = data.user;
	$: trackedFrameworks = data.trackedFrameworks;

	let frameworkInput = '';
	let versionInput = '';

	// Onboarding state
	let showOnboarding = false;
	let onboardingStep = 0;
	const tourSteps = [
		{
			title: 'Search for a Framework',
			content: 'Use this search bar to find any framework, library, or language.',
			targetId: 'search-bar'
		},
		{
			title: 'Add to Your List',
			content:
				'After searching, enter your version and click on \'add to your list\' button to add it to your personal tracking list.',
			targetId: 'add-framework-form'
		},
		{
			title: 'View Your List',
			content: 'All your tracked frameworks will appear here, with their EOL status.',
			targetId: 'tracked-frameworks-list'
		}
	];

	onMount(() => {
		if (user && !user.prefs?.onboarded) {
			// A small delay to ensure the page is rendered
			setTimeout(() => {
				showOnboarding = true;

			}, 500);
		}
	});

	function handleNext() {
		if (onboardingStep < tourSteps.length - 1) {
			onboardingStep++;
		}
	}
</script>

{#if showOnboarding}
	<OnboardingStep
		{...tourSteps[onboardingStep]}
		isLast={onboardingStep === tourSteps.length - 1}
		on:next={handleNext}
		on:skip={() => (showOnboarding = false)}
		on:complete={() => {
			document.getElementById('onboarding-form')?.requestSubmit();
			showOnboarding = false;
		}}
	/>
	<form
		id="onboarding-form"
		action="?/completeOnboarding"
		method="POST"
		use:enhance
		class="hidden"
	/>
{/if}

<main class="container mx-auto p-4 font-mono">
	<h1 class="text-4xl font-bold mb-6 text-center">Framework EOL Tracker</h1>

	<div class="max-w-4xl mx-auto">
		<form method="GET" class="mb-4" id="search-bar">
			<div class="flex">
				<input
					type="search"
					name="framework"
					placeholder="Enter a framework (e.g., python)"
					class="w-full px-3 py-2 text-black bg-white border-2 border-black focus:outline-none"
					bind:value={frameworkInput}
				/>
				<button
					type="submit"
					class="px-4 py-2 font-bold text-white bg-black border-y-2 border-r-2 border-black transform hover:translate-x-1 hover:translate-y-1 transition-transform"
				>
					Search
				</button>
			</div>
		</form>

		{#if cycles && cycles.length > 0 && user}
			<form
				action="?/addFramework"
				method="POST"
				class="space-y-4 mb-4"
				id="add-framework-form"
			>
				<input type="hidden" name="framework" value={frameworkInput} />
				<div>
					<label for="version" class="block text-sm font-bold text-gray-700">Version</label>
					<input
						id="version"
						name="version"
						type="text"
						required
						class="w-full px-3 py-2 mt-1 text-black bg-white border-2 border-black focus:outline-none"
						placeholder="Enter your version (e.g., 3.9)"
						bind:value={versionInput}
					/>
				</div>
				<button
					type="submit"
					class="w-full px-4 py-2 font-bold text-white bg-green-600 border-2 border-black transform hover:translate-x-1 hover:translate-y-1 transition-transform"
				>
					Add "{frameworkInput}" to your list
				</button>
			</form>
		{/if}

		{#if error}
			<div
				class="border-2 border-black bg-red-100 text-red-700 font-bold shadow-[8px_8px_0_#000] p-4 mt-4 text-center tracking-wide"
			>
				{error}
			</div>
		{/if}

		{#if cycles && cycles.length > 0}
			<div class="overflow-x-auto border-2 border-black shadow-[8px_8px_0_#000] mt-4">
				<h3 class="text-lg font-bold p-2 bg-black text-white">
					Available Cycles for {frameworkInput}
				</h3>
				<table class="table-auto w-full bg-white">
					<thead>
						<tr class="border-b-2 border-black">
							<th class="px-4 py-2 text-left">Cycle</th>
							<th class="px-4 py-2 text-left">EOL</th>
							<th class="px-4 py-2 text-left">Latest</th>
						</tr>
					</thead>
					<tbody>
						{#each cycles as cycle, i}
							<tr
								class={`${i < cycles.length - 1 ? 'border-b-2 border-black' : ''} ${
									cycle.isEol ? 'bg-red-100 text-red-700 font-bold' : ''
								}`}
							>
								<td class="px-4 py-2">{cycle.name}</td>
								<td class="px-4 py-2"
									>{cycle.eolFrom ? new Date(cycle.eolFrom).toLocaleDateString() : 'N/A'}</td
								>
								<td class="px-4 py-2">{cycle.latest.name}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<div class="mt-8" id="tracked-frameworks-list">
		{#if user}
			<h2 class="text-2xl font-bold mb-4 text-center">My Tracked Frameworks</h2>
			{#if trackedFrameworks && trackedFrameworks.length > 0}
				<div class="overflow-x-auto border-2 border-black shadow-[8px_8px_0_#000] max-w-4xl mx-auto">
					<table class="table-auto w-full bg-white">
						<thead>
							<tr class="border-b-2 border-black">
								<th class="px-4 py-2 text-left">Framework</th>
								<th class="px-4 py-2 text-left">Your Version</th>
								<th class="px-4 py-2 text-left">Status</th>
								<th class="px-4 py-2 text-left">EOL Date</th>
								<th class="px-4 py-2 text-left"></th>
							</tr>
						</thead>
						<tbody>
							{#each trackedFrameworks as fw, i}
								<tr
									class={`${i < trackedFrameworks.length - 1 ? 'border-b-2 border-black' : ''} ${
										fw.status === 'End of Life' ? 'bg-red-100 text-red-700 font-bold' : ''
									}`}
								>
									<td class="px-4 py-2">{fw.framework_slug}</td>
									<td class="px-4 py-2">{fw.version}</td>
									<td class="px-4 py-2">{fw.status}</td>
									<td class="px-4 py-2"
										>{fw.eol ? new Date(fw.eol).toLocaleDateString() : 'N/A'}</td
									>
									<td class="px-4 py-2">
										<form action="?/removeFramework" method="POST">
											<input type="hidden" name="docId" value={fw.$id} />
											<button
												type="submit"
												class="px-2 py-1 font-bold text-white bg-red-600 border-2 border-black"
											>
												Remove
											</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="text-center">You are not tracking any frameworks yet.</p>
			{/if}
		{:else}
			<div class="border-2 border-black p-8 text-center shadow-[8px_8px_0_#000] max-w-md mx-auto">
				<h2 class="text-2xl font-bold mb-4">Log in to create your list</h2>
				<p>
					Once logged in, you can search for frameworks on the above and add your version to your
					personalized tracking list.
				</p>
			</div>
		{/if}
	</div>
</main>



