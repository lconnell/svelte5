import { LoginApi } from '$lib/api/apis';
import { apiConfig } from './client';

const loginApi = new LoginApi(apiConfig);

export function loginUser(username: string, password: string) {
    return loginApi.loginLoginAccessToken({ username, password, grantType: 'password' });
}