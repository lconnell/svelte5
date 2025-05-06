export function getAccessToken(): string | null {
	return localStorage.getItem('access_token'); // or use memory store fallback
}

export function setAccessToken(token: string): void {
	localStorage.setItem('access_token', token);
}
