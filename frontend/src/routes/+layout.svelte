<script lang="ts">
  import '../app.css';
  import { authStore } from '$lib/stores/authStore.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/queryClient';

  const { children } = $props();

  onMount(() => {
    let cleanup: (() => void) | undefined;
    
    authStore.initialize().then((cleanupFn) => {
      cleanup = cleanupFn;
    });
    
    return () => {
      cleanup?.();
    };
  });

  async function handleSignOut() {
    await authStore.signOut();
    goto('/login');
  }

  $effect(() => {
    // Redirect to login if not authenticated and not on public pages
    const publicPaths = ['/login', '/register', '/auth'];
    const isPublicPath = publicPaths.some(path => $page.url.pathname.startsWith(path));
    
    if (authStore.initialized && !authStore.isAuthenticated && !isPublicPath) {
      goto('/login');
    }
  });
</script>

<div class="min-h-screen bg-base-200">
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/workorders" class="btn btn-ghost text-xl">Work Orders</a>
    </div>
    <div class="flex-none">
      {#if authStore.isAuthenticated}
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <div class="bg-primary text-primary-content w-full h-full flex items-center justify-center">
                {authStore.user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
          <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li class="menu-title">
              <span>{authStore.user?.email}</span>
            </li>
            <li><a href="/workorders">Work Orders</a></li>
            <li><button onclick={handleSignOut}>Logout</button></li>
          </ul>
        </div>
      {:else if authStore.initialized}
        <a href="/login" class="btn btn-primary">Sign In</a>
      {/if}
    </div>
  </div>

  <main class="container mx-auto p-4">
    <QueryClientProvider client={queryClient}>
      {#if authStore.loading && !authStore.initialized}
        <div class="flex justify-center items-center min-h-[50vh]">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      {:else}
        {@render children()}
      {/if}
    </QueryClientProvider>
  </main>
</div>