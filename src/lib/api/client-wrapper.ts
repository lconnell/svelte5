import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { getAccessToken } from '$lib/auth';

const baseUrl = PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Arguments for the clientWrapper function
interface ClientWrapperArgs {
	url: string;
	method: string;
	body?: unknown;
	data?: unknown;
	headers?: Record<string, string>;
	signal?: AbortSignal;
	params?: Record<string, unknown>;
}

// Helper function to convert non-string values to string
const normalizeParams = (params: Record<string, unknown>): Record<string, string> => {
	const result: Record<string, string> = {};
	for (const key in params) {
		const value = params[key];
		if (value !== undefined && value !== null) {
			result[key] = String(value);
		}
	}
	return result;
};

// Enhanced clientWrapper to support both 'data' and 'body' as POST payloads for Orval compatibility
export const clientWrapper = async <T = unknown>({
	url,
	method,
	body,
	data,
	headers,
	signal,
	params
}: ClientWrapperArgs): Promise<T> => {
	const token = getAccessToken();

	// Normalize URL: append to base if not already full (http or https)
	let fullUrl = /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`;
	if (params) {
		const query = new URLSearchParams(normalizeParams(params)).toString();
		if (query) fullUrl += `?${query}`;
	}

	// Use 'data' if present (Orval convention), otherwise fallback to 'body'
	const payload = data !== undefined ? data : body;

	// Type guard for URLSearchParams
	const isFormData = payload instanceof URLSearchParams;
	
	// Build headers: only set Content-Type to application/json if not already set and not form data
	const finalHeaders: Record<string, string> = {
		Authorization: token ? `Bearer ${token}` : '',
		...headers as Record<string, string>
	};
	if (!isFormData && !finalHeaders['Content-Type']) {
		finalHeaders['Content-Type'] = 'application/json';
	}

	const res = await fetch(fullUrl, {
		method,
		headers: finalHeaders,
		body: isFormData ? payload : (payload ? JSON.stringify(payload) : undefined),
		signal,
	});

	const responseData = await res.json();
	if (!res.ok) throw responseData;
	return responseData;
};
