<script lang="ts">
	import { onMount } from 'svelte';
	import { getAccessToken } from '$lib/auth';
	import MapForm from '$lib/components/MapForm.svelte';

	let count = $state<number>(0);
	let userFullName = $state<string | null>(null);
	let userError = $state<string | null>(null);

	function increment(): void {
		count += 1;
	}

	// Fetch the current user's details if logged in
	onMount(async () => {
		const token = getAccessToken();
		if (!token) return;
		// TODO: Replace with proper user fetch using Orval-generated client, e.g. usersReadUserMe()
		// const user = await usersReadUserMe();
		// userFullName = user.full_name ?? '';
		// For now, just clear error
		userError = null;
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-3xl font-bold">Welcome to SvelteKit 2</h1>
	{#if userFullName}
		<p class="text-lg">Logged in as <span class="font-semibold">{userFullName}</span></p>
	{:else if userError}
		<p class="text-error">{userError}</p>
	{/if}
	<button class="btn btn-primary" onclick={increment}>
		Clicked {count}
		{count === 1 ? 'time' : 'times'}
	</button>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>

	<MapForm />
</div>
