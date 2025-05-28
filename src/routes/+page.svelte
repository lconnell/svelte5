<script lang="ts">
	import { onMount } from 'svelte';
	import { getAccessToken } from '$lib/auth';
	import MapForm from '$lib/components/MapForm.svelte';
	import { createUsersReadUserMe } from '$lib/api/client'; // Assuming this is the correct Orval-generated hook
	// queryClient might not be needed here if relying on global instance via QueryClientProvider
	import { extractApiError } from '$lib/api/error';

	let count = $state<number>(0);
	let token = $state<string | null>(null);

	function increment(): void {
		count += 1;
	}

	onMount(() => {
		token = getAccessToken();
	});

	// Fetch the current user's details if logged in using Svelte Query
	const userQuery = createUsersReadUserMe(
		{ // Options object is the first argument
			query: { // Svelte Query's CreateQueryOptions nested under 'query'
				enabled: () => !!token // Make enabled reactive to token changes
				// Orval typically handles queryKey and queryFn automatically within the generated hook
			}
		}
		// Optional: queryClient instance as a second argument if needed
	);
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-3xl font-bold">Welcome to SvelteKit 2</h1>

	{#if $userQuery.isPending && token}
		<p class="text-lg"><span class="loading loading-dots loading-md"></span> Loading user...</p>
	{:else if $userQuery.error}
		<p class="text-error">Error loading user: {extractApiError($userQuery.error, 'Could not fetch user details.')}</p>
	{:else if $userQuery.data}
		<p class="text-lg">Logged in as <span class="font-semibold">{$userQuery.data.full_name || 'User'}</span></p>
	{:else if !token && !$userQuery.isPending}
		<p class="text-lg">Please <a href="/login" class="link link-primary">log in</a> to see your details.</p>
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
