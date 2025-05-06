import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { getAccessToken } from '$lib/auth';

const baseUrl = PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Arguments for the clientWrapper function
interface ClientWrapperArgs {
	url: string;
	method: string;
	body?: unknown;
	headers?: Record<string, string>;
}

// Enhanced clientWrapper to support both 'data' and 'body' as POST payloads for Orval compatibility
export const clientWrapper = async <T = unknown>({
	url,
	method,
	body,
	data,
	headers
}: ClientWrapperArgs & { data?: unknown }): Promise<T> => {
	const token = getAccessToken();

	// Normalize URL: append to base if not already full (http or https)
	const fullUrl = /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`;

	// Use 'data' if present (Orval convention), otherwise fallback to 'body'
	const payload = data !== undefined ? data : body;

	const res = await fetch(fullUrl, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: token ? `Bearer ${token}` : '',
			...headers
		},
		body: payload ? JSON.stringify(payload) : undefined
	});

	const responseData = await res.json();
	if (!res.ok) throw responseData;
	return responseData;
};
