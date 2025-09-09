<script>
// @ts-nocheck

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
</script>

<main class="container mx-auto p-4 font-mono">
	<h1 class="text-4xl font-bold mb-6 text-center">Framework EOL Checker</h1>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		<div class="md:col-span-1">
			<form method="GET" class="mb-4">
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

			{#if cycles && user}
				<form action="?/addFramework" method="POST" class="space-y-4">
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
				<p class="text-red-500 mt-4">{error}</p>
			{/if}

			{#if cycles}
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
										cycle.eol && new Date(cycle.eol) < new Date()
											? 'bg-red-100 text-red-700 font-bold'
											: ''
									}`}
								>
									<td class="px-4 py-2">{cycle.cycle}</td>
									<td class="px-4 py-2"
										>{cycle.eol ? new Date(cycle.eol).toLocaleDateString() : 'N/A'}</td
									>
									<td class="px-4 py-2">{cycle.latest}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<div class="md:col-span-2">
			{#if user}
				<h2 class="text-2xl font-bold mb-4">My Tracked Frameworks</h2>
				{#if trackedFrameworks && trackedFrameworks.length > 0}
					<div class="overflow-x-auto border-2 border-black shadow-[8px_8px_0_#000]">
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
					<p>You are not tracking any frameworks yet.</p>
				{/if}
			{:else}
				<div class="border-2 border-black p-8 text-center shadow-[8px_8px_0_#000]">
					<h2 class="text-2xl font-bold mb-4">Log in to create your list</h2>
					<p>
						Once logged in, you can search for frameworks on the left and add your version to your
						personalized tracking list.
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>



