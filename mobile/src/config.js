export const apiURL = process.env.EXPO_PUBLIC_API_URL?.trim();
export const apiEnabled = Boolean(apiURL);
const webURL = process.env.EXPO_PUBLIC_WEB_URL?.trim().replace(/\/$/, '') || '';
export const imageURL = (path) => (path?.startsWith('https://') ? path : `${webURL}${path}`);
