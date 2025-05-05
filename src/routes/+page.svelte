<script lang="ts">
	import { extractApiError } from '$lib/api/error';
	import { onMount } from 'svelte';
	import { api } from '$lib/api/client-wrapper';
	import { getAccessToken } from '$lib/auth';

	let count = $state(0);
	let userFullName = $state<string | null>(null);
	let userError = $state<string | null>(null);

	function increment(): void {
		count += 1;
	}

	// Fetch the current user's details if logged in
	onMount(async () => {
		const token = getAccessToken();
		if (!token) return;
		try {
			const user = await api['users-read_user_me']();
			userFullName = user.full_name ?? '';
		} catch (e: unknown) {
			userError = extractApiError(e, 'Failed to load user.');
		}
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
</div>
