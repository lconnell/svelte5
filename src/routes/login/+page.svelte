<script lang="ts">
	import { extractApiError } from '$lib/api/error';
	import { api } from '$lib/api/client-wrapper';
	import { goto } from '$app/navigation';

	// Form state
	let username = '';
	let password = '';
	let loading = false;
	let error: string | null = null;

	/**
	 * Handle login form submission
	 * Authenticates to backend and stores access token
	 */
	async function handleLogin(event: Event) {
		event.preventDefault();
		loading = true;
		error = null;
		try {
			// Authenticate using the API client
			const response = await api['login-login_access_token']({
				username,
				password
			});
			// Store token (for demo: localStorage, use secure storage in production)
			localStorage.setItem('access_token', response.access_token);
			// Redirect to home or dashboard
			goto('/');
		} catch (e: unknown) {
			error = extractApiError(e, 'Login failed. Please check your credentials.');
		} finally {
			loading = false;
		}
	}
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center">
	<form
		class="bg-base-100 flex w-full max-w-sm flex-col gap-6 rounded-lg p-8 shadow-lg"
		on:submit={handleLogin}
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
			<!--
        Style adjustment: focus:ring-primary and focus:border-primary ensure the blue highlight matches the button and aligns with the input.
      -->
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
			<!--
        Style adjustment: focus:ring-primary and focus:border-primary ensure the blue highlight matches the button and aligns with the input.
      -->
		</div>
		{#if error}
			<div class="alert alert-error shadow-sm">{error}</div>
		{/if}
		<button class="btn btn-primary w-full" type="submit" disabled={loading}>
			{#if loading}
				<span class="loading loading-spinner"></span>
				Signing in...
			{:else}
				Sign In
			{/if}
		</button>
	</form>
</div>
