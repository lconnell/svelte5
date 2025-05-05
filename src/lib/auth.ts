export function getAccessToken(): string | null {
    return localStorage.getItem('access_token'); // or use memory store fallback
}