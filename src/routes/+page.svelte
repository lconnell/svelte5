<script lang="ts">
  import { onMount } from 'svelte';
  import { UsersApi } from '$lib/api/apis';
  import { apiConfig } from '$lib/api/client';

  let user: { fullName?: string | null; email?: string } | null = null;
  let loading = true;
  let error: string | null = null;

  // Svelte 5: use:effect for fetching user info
  let userEffect = async () => {
    const usersApi = new UsersApi(apiConfig);
    try {
      user = await usersApi.usersReadUserMe();
    } catch (e: any) {
      error = 'Could not load user info. Please log in again.';
    } finally {
      loading = false;
    }
  };

</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 px-2">
  <div class="card w-full max-w-md shadow-2xl bg-base-100 p-8 space-y-6 rounded-xl border border-base-300 flex flex-col items-center">
    <span class="text-4xl mb-2">👋</span>
    <h2 class="text-2xl font-bold text-center mb-1">Welcome{user && user.fullName ? `, ${user.fullName}` : ''}!</h2>
    {#if loading}
      <div class="text-base-content/70">Loading your info...</div>
    {:else if error}
      <div class="alert alert-error shadow-sm">
        <span>{error}</span>
      </div>
    {:else if user}
      <div class="text-base-content/80 text-center">
        <div class="font-semibold">Email:</div>
        <div>{user.email}</div>
      </div>
    {/if}
  </div>
</div>
