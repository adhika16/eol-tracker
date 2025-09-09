<script>
  import { page } from '$app/state';
</script>

<main class="min-h-screen flex flex-col items-center justify-center">
  <div class="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-8 max-w-lg text-center">
    <h1 class="text-4xl font-extrabold text-black mb-4 tracking-tight font-mono">
      {page.status}
    </h1>
    <h2 class="text-2xl font-bold text-red-600 mb-2 font-mono">
      {page.error?.message || 'Something went wrong'}
    </h2>
    <p class="text-lg text-gray-800 mb-6 font-mono">
      Sorry, an unexpected error occurred.<br>
      Please try again or contact support.
    </p>
    <a href="/" class="inline-block px-6 py-3 bg-yellow-300 border-2 border-black text-black font-bold shadow-[4px_4px_0_0_#000] hover:bg-yellow-400 transition-all font-mono">
      Go Home
    </a>
  </div>
</main> 