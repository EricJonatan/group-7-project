import axios from 'axios';
import type { AxiosResponse } from 'axios';
export type ApiEnvelope<T> = { data: T };
export function unwrap<T = unknown>(response: AxiosResponse<unknown>): T {
  const body = response.data;
  return body && typeof body === 'object' && 'data' in body ? (body.data as T) : (body as T);
}
interface ApiClientOptions {
  baseURL?: string;
  getToken?: () => string | null | undefined | Promise<string | null | undefined>;
  onUnauthorized?: () => void;
}
export function createApiClient({ baseURL, getToken, onUnauthorized }: ApiClientOptions = {}) {
  const api = axios.create({ baseURL, timeout: 15000 });
  api.interceptors.request.use(async (config) => {
    const token = await getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) onUnauthorized?.();
      return Promise.reject(error);
    },
  );
  return api;
}
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message)
    return error.response.data.message;
  if (error instanceof Error && 'issues' in error && Array.isArray(error.issues)) {
    const issue: unknown = error.issues[0];
    if (
      issue &&
      typeof issue === 'object' &&
      'message' in issue &&
      typeof issue.message === 'string'
    )
      return issue.message;
  }
  return fallback;
}
