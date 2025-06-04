<script lang="ts">
import "../app.css";
import { queryClient } from "$lib/queryClient";
import { QueryClientProvider } from "@tanstack/svelte-query";

const { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
