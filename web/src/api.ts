import { createApiClient } from '@labuibu/api-client';
export { unwrap } from '@labuibu/api-client';
export const apiEnabled = Boolean(import.meta.env.VITE_API_URL?.trim());
export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL?.trim(),
  getToken: () => sessionStorage.getItem('labuibu-token'),
});
export function track(name: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', name, params);
}
export function initAnalytics() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id) || document.getElementById('ga-script')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (..._args: unknown[]) {
    window.dataLayer?.push(arguments);
  };
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
