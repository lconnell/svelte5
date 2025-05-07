<script lang="ts">
	import { createLoginLoginAccessToken } from '$lib/api/client';
	import { extractApiError } from '$lib/api/error';
	import { goto } from '$app/navigation';
	import { setAccessToken } from '$lib/auth';

	// Form state
	let username = '';
	let password = '';

	// Use svelte-query mutation for login
	const loginMutation = createLoginLoginAccessToken();

	/**
	 * Handle login form submission using svelte-query mutation
	 * Authenticates to backend and stores access token
	 * @param event - Form submit event
	 */
	async function handleLogin(event: Event) {
		event.preventDefault();
		try {
			// FastAPI OAuth2 expects scope (even if empty)
			const payload = {
				username: username.trim(),
				password: password,
				grant_type: 'password',
				scope: ''
			};
			const response = await $loginMutation.mutateAsync({ data: payload });
			setAccessToken(response.access_token);
			goto('/');
		} catch (e: unknown) {
			// Error is handled by mutation.error and UI
			console.error(e);
		}
	}
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center">
	<form
		class="bg-base-100 flex w-full max-w-sm flex-col gap-6 rounded-lg p-8 shadow-lg"
		onsubmit={handleLogin}
	>
		<h2 class="text-center text-2xl font-bold">Sign in to your account</h2>
		<div class="form-control">
			<label class="label" for="username">
				<span class="label-text">Username</span>
			</label>
			<input
				id="username"
				type="text"
				class="input input-bordered focus:ring-primary focus:border-primary focus:ring-2 focus:outline-none"
				bind:value={username}
				required
				autocomplete="username"
				placeholder="Enter your username"
			/>
		</div>
		<div class="form-control">
			<label class="label" for="password">
				<span class="label-text">Password</span>
			</label>
			<input
				id="password"
				type="password"
				class="input input-bordered focus:ring-primary focus:border-primary focus:ring-2 focus:outline-none"
				bind:value={password}
				required
				autocomplete="current-password"
				placeholder="Enter your password"
			/>
		</div>
		{#if $loginMutation.isPending}
			<div class="flex justify-center">
				<span class="loading loading-spinner"></span> Signing in...
			</div>
		{/if}
		{#if $loginMutation.error}
			<div class="alert alert-error shadow-sm">
				{extractApiError($loginMutation.error, 'Login failed. Please check your credentials.')}
			</div>
		{/if}
		<button class="btn btn-primary w-full" type="submit" disabled={$loginMutation.isPending}>
			Sign In
		</button>
	</form>
</div>
