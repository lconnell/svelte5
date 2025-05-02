import { Configuration } from '$lib/api/runtime';
import { browser } from '$app/environment';

const basePath =
  import.meta.env.MODE === 'production'
    ? 'https://api.yourdomain.com'
    : 'http://localhost:8000';

// Only access localStorage in the browser
export const apiConfig = new Configuration({
  basePath,
  accessToken: browser ? localStorage.getItem('access_token') ?? '' : '',
});