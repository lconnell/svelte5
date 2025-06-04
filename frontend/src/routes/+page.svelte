<script lang="ts">
  import { authStore } from '$lib/stores/authStore.svelte';
  import MapForm from '$lib/components/MapForm.svelte';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
  <h1 class="text-3xl font-bold">Work Order Management</h1>
  
  {#if authStore.isAuthenticated && authStore.user}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center">Welcome back!</h2>
        <p class="text-lg">
          Logged in as <span class="font-semibold">{authStore.user.email}</span>
        </p>
        <div class="card-actions justify-center mt-4">
          <a href="/workorders" class="btn btn-primary btn-wide">
            View Work Orders
          </a>
        </div>
      </div>
    </div>
  {:else if authStore.loading}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body text-center">
        <span class="loading loading-dots loading-md"></span>
        <p>Loading...</p>
      </div>
    </div>
  {:else}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center">Get Started</h2>
        <p class="text-center">Sign in to access and manage work orders</p>
        <div class="card-actions justify-center mt-4">
          <a href="/login" class="btn btn-primary btn-wide">Sign In</a>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Map Component -->
  <div class="w-full max-w-4xl mt-8">
    <MapForm />
  </div>
  
  <div class="mt-8 text-sm opacity-60">
    <p>Manage work orders, track progress, and collaborate with your team</p>
  </div>
</div>