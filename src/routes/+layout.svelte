<script lang="ts">
  import '../app.css';
  import { SignedIn, SignedOut, UserButton } from 'clerk-sveltekit/client';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/queryClient';

  // Props are automatically available in Svelte 5, no need for `export let data: LayoutData;`
  // if we are just using the components. The `user` and `session` are available via `data.user` and `data.session`
  // if loaded in +layout.ts, but Clerk components often handle this internally.
  let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
  <header class="bg-neutral text-neutral-content p-4">
    <nav class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-xl font-bold">SvelteKit Items App</a>
      <div>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <a href="/sign-in" class="btn btn-ghost">Sign In</a>
          <a href="/sign-up" class="btn btn-ghost">Sign Up</a>
        </SignedOut>
      </div>
    </nav>
  </header>

  <main class="container mx-auto p-4">
    {@render children()}
  </main>
</QueryClientProvider>
