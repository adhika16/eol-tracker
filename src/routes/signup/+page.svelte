<script>
	export let form;
</script>

<!-- src/routes/signup/+page.svelte -->
<main class="flex flex-col items-center justify-center min-h-screen font-mono p-4">
	<div class="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black shadow-[8px_8px_0_#000]">
		<h2 class="text-3xl font-bold text-center">Sign Up</h2>
		<form action="?/signup" method="post" class="space-y-6">
			<div>
				<label for="name" class="block text-sm font-bold text-gray-700">NAME</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					class="w-full px-3 py-2 mt-1 text-black bg-white border-2 border-black focus:outline-none"
					placeholder="Your Name"
				/>
			</div>
			<div>
				<label for="email" class="block text-sm font-bold text-gray-700">EMAIL</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="w-full px-3 py-2 mt-1 text-black bg-white border-2 border-black focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-bold text-gray-700">PASSWORD</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full px-3 py-2 mt-1 text-black bg-white border-2 border-black focus:outline-none"
					placeholder="••••••••"
				/>
			</div>
			<div>
				<button
					type="submit"
					class="w-full px-4 py-2 font-bold text-white bg-black border-2 border-black transform hover:translate-x-1 hover:translate-y-1 transition-transform"
				>
					Sign Up
				</button>
			</div>
		</form>
		<p class="text-center text-sm text-gray-600">
			Already have an account? <a href="/login" class="font-bold hover:underline">Log in</a>
		</p>
	</div>
	{#if form?.error}
		<div class="w-full max-w-md p-4 mt-4 border-2 border-black bg-red-100 text-red-700 font-bold shadow-[8px_8px_0_#000]">
			<p class="text-center">{form.error}</p>
		</div>
	{/if}
</main>

