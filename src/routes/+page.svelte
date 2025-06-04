<script lang="ts">
import { goto } from "$app/navigation";
import { createUsersReadUserMe } from "$lib/api/client";
import { extractApiError } from "$lib/api/error";
import { getAccessToken } from "$lib/auth";
import MapForm from "$lib/components/MapForm.svelte";
import { onMount } from "svelte";

let count = $state<number>(0);
let token = $state<string | null>(null);
let initialRefetchDone = false; // Non-reactive flag

function increment(): void {
	count += 1;
}

onMount(() => {
	const accessToken = getAccessToken();
	if (!accessToken) {
		goto("/login");
	} else {
		token = accessToken;
	}
});

const userQuery = createUsersReadUserMe({
	query: {
		enabled: () => !!token,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
	},
});

// Effect to refetch user when token becomes available
$effect(() => {
	const currentToken = token;
	const query = $userQuery;

	if (
		!initialRefetchDone &&
		currentToken &&
		query.status === "pending" &&
		!query.isFetching
	) {
		query.refetch();
		initialRefetchDone = true;
	}
});
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-3xl font-bold">Welcome to SvelteKit 2</h1>

	<!-- Display logic based on Svelte Query state -->
	{#if $userQuery.data?.full_name}
		<p class="text-lg">Logged in as <span class="font-semibold">{$userQuery.data.full_name}</span></p>
	{:else if token && ($userQuery.isLoading || ($userQuery.isPending && !$userQuery.data)) && !$userQuery.isError}
		<p class="text-lg"><span class="loading loading-dots loading-md"></span> Loading user...</p>
	{:else if $userQuery.isError}
		<p class="text-error">Error loading user: {extractApiError($userQuery.error, 'Could not fetch user details.')}</p>
	<!-- If not logged in, onMount will redirect. If token exists but data is not yet loaded and not an error, nothing specific is shown here, relying on the loading message or eventual data. -->
	{/if}

	<button class="btn btn-primary" onclick={increment}>count is {count}</button>
	<MapForm />
	<p>
		Visit <a href="https://svelte.dev/docs/kit" class="link link-accent">svelte.dev/docs/kit</a> to read the documentation.
	</p>
</div>
