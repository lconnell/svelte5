import { createMutation } from '@tanstack/svelte-query';
import { loginUser } from '$lib/api/login';
import type { Token } from '$lib/api/models/Token';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Custom hook to perform login mutation using Svelte Query's createMutation
// Exports both the mutation store and a store for the user-friendly error message
export function useLogin() {
  // Store for a user-friendly error message
  const errorMessage = writable<string | null>(null);

  const mutation = createMutation<Token, unknown, { username: string; password: string }>({
    // Mutation function to perform the login request
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUser(username, password),
    // Handle successful login response
    onSuccess: (data: Token, variables: { username: string; password: string }) => {
      if (browser && data && 'access_token' in data) {
        localStorage.setItem('access_token', (data as any).access_token);
        // Store username for display on welcome page
        localStorage.setItem('current_username', variables.username);
      }
      errorMessage.set(null); // Clear error message on success
      // Redirect to welcome page on successful login
      if (browser) {
        window.location.href = '/welcome';
      }
    },
    // Handle login error and extract backend error message
    onError: async (error: any) => {
      let msg = 'Login failed. Please try again.';
      // Try to extract error message from the backend response
      if (error?.response) {
        try {
          const data = await error.response.json();
          // Prefer string error messages for user display
          if (typeof data.detail === 'string') {
            msg = data.detail;
          } else if (typeof data.detail === 'object' && data.detail !== null) {
            // Try to extract a user-friendly field from the object
            msg = data.detail.error || data.detail.message || JSON.stringify(data.detail);
          } else if (data.message) {
            msg = data.message;
          }
        } catch {
          // fallback to generic message
        }
      }
      errorMessage.set(msg); // Always set a string
      // Optionally keep this for dev, remove for production:
      // console.error('Login error:', error);
    }
  });

  return { mutation, errorMessage };
}