import axios from 'axios';
export const unwrap = (response) => response.data.data ?? response.data;
export function createApiClient({ baseURL, getToken, onUnauthorized } = {}) {
  const api = axios.create({ baseURL, timeout: 15000 });
  api.interceptors.request.use(async (config) => {
    const token = await getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) onUnauthorized?.();
      return Promise.reject(error);
    },
  );
  return api;
}
