<script lang="ts">
	let count = $state(0);

	function increment(): void {
		count += 1;
	}
</script>

<h1 class="mb-4 text-3xl font-bold">Welcome to SvelteKit 2</h1>
<button class="btn btn-primary" onclick={increment}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
