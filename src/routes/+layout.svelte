<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';

	let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
