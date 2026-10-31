import { isOrderReceipt } from '@labuibu/contracts/commerce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreCart } from '@labuibu/contracts/catalog';

function parse(value: string | null | undefined, fallback: unknown): unknown {
  try {
    return JSON.parse(value || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export async function readSavedShop() {
  const entries = await AsyncStorage.multiGet([
    'labuibu-cart',
    'labuibu-favorites',
    'labuibu-last-order',
  ]);
  const saved = Object.fromEntries(entries);
  const favorites = parse(saved['labuibu-favorites'], []);
  const order = parse(saved['labuibu-last-order'], null);
  return {
    cart: restoreCart(parse(saved['labuibu-cart'], [])),
    favorites: Array.isArray(favorites) ? favorites.filter((id) => typeof id === 'string') : [],
    lastOrder: isOrderReceipt(order) ? order : null,
  };
}

export const saveJSON = (key: string, value: unknown) =>
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
export const removeSavedOrder = () => AsyncStorage.removeItem('labuibu-last-order');
