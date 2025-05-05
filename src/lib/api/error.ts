// Centralized API error extraction helper for type-safe, DRY error handling
// Returns the most user-friendly error message possible from API error responses

export function extractApiError(e: unknown, fallback: string): string {
	if (
		e &&
		typeof e === 'object' &&
		'response' in e &&
		e.response &&
		typeof e.response === 'object' &&
		'data' in e.response &&
		e.response.data &&
		typeof e.response.data === 'object' &&
		'detail' in e.response.data
	) {
		return (e.response.data as { detail?: string }).detail || fallback;
	}
	if (e instanceof Error) return e.message;
	return fallback;
}
