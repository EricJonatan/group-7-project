import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreCart } from '@labuibu/contracts/catalog';

function parse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
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
    lastOrder: order?.id && Array.isArray(order.items) ? order : null,
  };
}

export const saveJSON = (key, value) =>
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
export const removeSavedOrder = () => AsyncStorage.removeItem('labuibu-last-order');
