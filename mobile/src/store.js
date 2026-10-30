import { api, apiEnabled, tokenStore } from './api.js';
import {
  addCartItem,
  updateCartItem,
  toggleFavorite,
  cartTotals,
} from '@labuibu/contracts/commerce';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { readSavedShop, saveJSON, removeSavedOrder } from './storage.js';
import { unwrap } from '@labuibu/api-client';
import { registerSchema, loginSchema } from '@labuibu/contracts';
import { products as demoProducts } from '@labuibu/contracts/catalog';
const Context = createContext(null);
export function Provider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState(apiEnabled ? [] : demoProducts);
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
            const result = unwrap(await api.get('/auth/me'));
            if (active) setUser(result.user || result);
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
  function favorite(id) {
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
      const data = unwrap(await api.get('/products'));
      if (!Array.isArray(data)) throw new Error('Format katalog tidak sesuai.');
      setProducts(data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Tidak dapat menghubungi dapur Labuibu.',
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function authenticate(register, values) {
    const payload = (register ? registerSchema : loginSchema).parse(values);
    if (!apiEnabled) {
      setUser({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        demo: true,
      });
      return;
    }
    const data = unwrap(await api.post(`/auth/${register ? 'register' : 'login'}`, payload));
    if (!data.token || !data.user) throw new Error('Respons server tidak valid.');
    await tokenStore.set(data.token);
    setUser(data.user);
  }
  function rememberOrder(order) {
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
  function add(product, quantity = 1) {
    setCart((items) => addCartItem(items, product, quantity));
  }
  function update(id, quantity) {
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
export const useShop = () => useContext(Context);
