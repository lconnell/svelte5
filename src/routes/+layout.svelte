<script lang="ts">
  import '../app.css';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/queryClient';
  import { page } from '$app/stores';
  let { children } = $props();

  const navLinks = [
    { label: 'Dashboard', icon: '🏠', href: '/welcome' },
    { label: 'My Courses', icon: '📚', href: '/dashboard' },
    { label: 'Messages', icon: '💬', href: '#' },
    { label: 'Invoices', icon: '🧾', href: '#' },
    { label: 'Payments', icon: '💳', href: '#' },
    { label: 'Analytics', icon: '📊', href: '#' },
  ];
</script>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen flex bg-gradient-to-br from-[#181c2f] via-[#23274a] to-[#3c2e4f]">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 h-screen sticky top-0 left-0 z-30 bg-black/60 backdrop-blur-lg border-r border-white/10 shadow-xl px-6 py-8 space-y-4">
      <div class="flex items-center gap-2 mb-10">
        <span class="text-2xl">💻</span>
        <span class="font-bold text-xl tracking-wider text-white">Core Developer</span>
      </div>
      <nav class="flex-1">
        <ul class="space-y-2">
          {#each navLinks as link}
            <li>
              <a href={link.href} class="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-white/10 text-white/80 hover:text-white {($page.url.pathname === link.href) ? 'bg-white/10 text-white' : ''}">
                <span class="text-xl">{link.icon}</span>
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
      <div class="mt-auto space-y-2">
        <a href="/settings" class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200">
          <span class="text-lg">⚙️</span> Settings
        </a>
        <a href="/account" class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200">
          <span class="text-lg">👤</span> Account
        </a>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen">
      <div class="flex-1 flex flex-col justify-center items-center">
        {@render children()}
      </div>
    </main>
  </div>
</QueryClientProvider>