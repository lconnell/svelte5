import { browser } from '$app/environment';

export function getAccessToken(): string | null {
	if (browser) {
		return localStorage.getItem('access_token');
	}
	return null; // Return null on server-side
}

export function setAccessToken(token: string): void {
	if (browser) {
		localStorage.setItem('access_token', token);
	}
}

export function removeAccessToken(): void {
	if (browser) {
		localStorage.removeItem('access_token');
	}
}
