import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createApiClient } from '@labuibu/api-client';
import { apiURL } from './config.js';
export { apiEnabled } from './config.js';

// Browser preview keeps its token in memory; native builds use the OS credential store.
let previewToken = null;
export const tokenStore =
  Platform.OS === 'web'
    ? {
        get: async () => previewToken,
        set: async (value) => {
          previewToken = value;
        },
        remove: async () => {
          previewToken = null;
        },
      }
    : {
        get: () => SecureStore.getItemAsync('labuibu-token'),
        set: (value) => SecureStore.setItemAsync('labuibu-token', value),
        remove: () => SecureStore.deleteItemAsync('labuibu-token'),
      };
export const api = createApiClient({ baseURL: apiURL, getToken: () => tokenStore.get() });
