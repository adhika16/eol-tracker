<script>
	export let data;

	const { user } = data;
</script>

<div class="container mx-auto p-8 font-mono">
	<div class="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
		<h1 class="text-4xl font-bold mb-6">Account</h1>
		<div class="space-y-4">
			<div>
				<strong class="font-bold block">Email:</strong>
				<span>{user.email}</span>
			</div>
			<div>
				<strong class="font-bold block">Name:</strong>
				<span>{user.name}</span>
			</div>
			<div>
				<strong class="font-bold block">ID:</strong>
				<span class="break-all">{user.$id}</span>
			</div>
		</div>

		<form action="/logout" method="post" class="mt-8">
			<button
				type="submit"
				class="w-full bg-white text-black font-bold py-3 px-6 border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-px hover:translate-y-px active:shadow-[0px_0px_0_0_#000] active:translate-x-1 active:translate-y-1 transition-all"
			>
				Log out
			</button>
		</form>
	</div>
</div>

