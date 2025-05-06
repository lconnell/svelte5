import { createApiClient } from './client';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { ZodiosPlugin } from '@zodios/core';
import { getAccessToken } from '$lib/auth';

const baseUrl = PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Correct API instance with base URL and patched types
const apiInstance = createApiClient(baseUrl);
console.log('[api/client-wrapper] Zodios apiInstance created:', { baseUrl, apiInstance });

// Automatically attach Authorization header if access_token is present in localStorage
const authHeaderPlugin: ZodiosPlugin = {
	name: 'auth-header',
	request: async (api, config) => {
		const token = typeof window !== 'undefined' ? getAccessToken() : null;
		if (token) {
			return {
				...config,
				headers: {
					...config.headers,
					Authorization: `Bearer ${token}`
				}
			};
		}
		return config;
	}
};

apiInstance.use(authHeaderPlugin);

export const api = apiInstance;
