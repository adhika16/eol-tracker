<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	export let data;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<header class="flex justify-between items-center px-8 py-4 bg-white border-b-4 border-black">
		<nav class="flex gap-6">
			<a href="/" class="font-bold text-lg text-black hover:-translate-y-0.5 transition-all relative after:absolute after:w-full after:h-0.5 after:-bottom-1 after:left-0 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform">Home</a>
			<a href="/about" class="font-bold text-lg text-black hover:-translate-y-0.5 transition-all relative after:absolute after:w-full after:h-0.5 after:-bottom-1 after:left-0 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform">About</a>
			<a href="/contact" class="font-bold text-lg text-black hover:-translate-y-0.5 transition-all relative after:absolute after:w-full after:h-0.5 after:-bottom-1 after:left-0 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform">Contact</a>
		</nav>
		<div class="flex items-center gap-4">
			{#if data.user}
				<a href="/account" class="font-bold text-lg text-black hover:-translate-y-0.5 transition-all">Profile</a>
				<form action="/logout" method="post">
					<button type="submit" class="px-4 py-2 font-bold text-black bg-white border-4 border-black shadow-[4px_4px_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">Logout</button>
				</form>
			{:else}
				<a href="/login" class="px-4 py-2 font-bold text-black bg-white border-4 border-black shadow-[4px_4px_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">Login</a>
			{/if}
		</div>
	</header>

	<main class="p-4 flex-grow">
		<slot />
	</main>

	<footer class="px-8 py-4 bg-white border-t-4 border-black text-center font-bold">
		<p>
			EOL Tracker is an open source project. View the code on 
			<a href="#" target="_blank" class="underline text-blue-600 hover:text-blue-800">GitHub</a>.
		</p>
	</footer>
</div>

<!-- {@render children?.()} -->
