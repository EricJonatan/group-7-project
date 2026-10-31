import type {
  Product,
  SelectedProduct,
  CartItem,
  User,
  AuthInput,
  AuthResponse,
  OrderReceipt,
} from '@labuibu/contracts/types';
import { api, apiEnabled, tokenStore } from './api.ts';
import {
  addCartItem,
  updateCartItem,
  toggleFavorite,
  cartTotals,
} from '@labuibu/contracts/commerce';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { readSavedShop, saveJSON, removeSavedOrder } from './storage.ts';
import { unwrap, getErrorMessage } from '@labuibu/api-client';
import { registerSchema, loginSchema } from '@labuibu/contracts';
import { products as demoProducts } from '@labuibu/contracts/catalog';

interface ShopContextValue {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  user: User | null;
  loading: boolean;
  count: number;
  subtotal: number;
  add: (product: SelectedProduct, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  favorite: (id: string) => void;
  logout: () => Promise<void>;
  ready: boolean;
  error: string;
  load: () => Promise<void>;
  clear: () => void;
  authenticate: (register: boolean, values: AuthInput) => Promise<void>;
  lastOrder: OrderReceipt | null;
  rememberOrder: (order: OrderReceipt) => void;
}
const Context = createContext<ShopContextValue | null>(null);
export function Provider({ children }: React.PropsWithChildren) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lastOrder, setLastOrder] = useState<OrderReceipt | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>(apiEnabled ? [] : demoProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const [saved, token] = await Promise.all([readSavedShop(), tokenStore.get()]);
        if (!active) return;
        setFavorites(saved.favorites);
        setLastOrder(saved.lastOrder);
        setCart(saved.cart);
        if (apiEnabled && token) {
          try {
            const result = unwrap<{ user: User }>(await api.get('/auth/me'));
            if (active) setUser(result.user);
          } catch {
            await tokenStore.remove();
          }
        }
      } finally {
        if (active) setReady(true);
      }
    }
    restore().catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (ready) saveJSON('labuibu-cart', cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) saveJSON('labuibu-favorites', favorites);
  }, [favorites, ready]);
  function favorite(id: string) {
    setFavorites((items) => toggleFavorite(items, id));
  }
  async function load() {
    setError('');
    setLoading(true);
    try {
      if (!apiEnabled) {
        setProducts(demoProducts);
        return;
      }
      const data = unwrap<Product[]>(await api.get('/products'));
      if (!Array.isArray(data)) throw new Error('Format katalog tidak sesuai.');
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Tidak dapat menghubungi dapur Labuibu.'));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function authenticate(register: boolean, values: AuthInput) {
    const payload = (register ? registerSchema : loginSchema).parse(values);
    if (!apiEnabled) {
      setUser({
        name:
          ('name' in payload && typeof payload.name === 'string' ? payload.name : undefined) ||
          payload.email.split('@')[0],
        email: payload.email,
        demo: true,
      });
      return;
    }
    const data = unwrap<AuthResponse>(
      await api.post(`/auth/${register ? 'register' : 'login'}`, payload),
    );
    if (!data.token || !data.user) throw new Error('Respons server tidak valid.');
    await tokenStore.set(data.token);
    setUser(data.user);
  }
  function rememberOrder(order: OrderReceipt) {
    setLastOrder(order);
    saveJSON('labuibu-last-order', order);
  }
  async function logout() {
    if (apiEnabled) {
      try {
        await api.post('/auth/logout');
      } catch {}
    }
    await tokenStore.remove();
    setUser(null);
    setLastOrder(null);
    await removeSavedOrder();
  }
  function add(product: SelectedProduct, quantity = 1) {
    setCart((items) => addCartItem(items, product, quantity));
  }
  function update(id: string, quantity: number) {
    setCart((items) => updateCartItem(items, id, quantity));
  }
  const { count, subtotal } = cartTotals(cart);
  return (
    <Context.Provider
      value={{
        lastOrder,
        rememberOrder,
        favorites,
        favorite,
        user,
        ready,
        products,
        loading,
        error,
        load,
        cart,
        add,
        update,
        authenticate,
        logout,
        clear: () => setCart([]),
        count,
        subtotal,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useShop() {
  const shop = useContext(Context);
  if (!shop) throw new Error('Provider is missing.');
  return shop;
}
