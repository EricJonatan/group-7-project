import { loginSchema, registerSchema } from '@labuibu/contracts';
import {
  addCartItem,
  updateCartItem,
  toggleFavorite,
  cartTotals,
} from '@labuibu/contracts/commerce';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, apiEnabled, track, unwrap } from './api.js';
import { products as demoProducts, productId, restoreCart } from './data.js';
const Context = createContext(null);
function read(key, fallback, storage = localStorage) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function ShopProvider({ children }) {
  const [products, setProducts] = useState(apiEnabled ? [] : demoProducts);
  const [loading, setLoading] = useState(apiEnabled);
  const [catalogError, setCatalogError] = useState('');
  const [cart, setCart] = useState(() => restoreCart(read('labuibu-cart', [])));
  const [favorites, setFavorites] = useState(() => {
    const value = read('labuibu-favorites', []);
    return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [];
  });
  const [user, setUser] = useState(() => read('labuibu-user', null, sessionStorage));
  const [authLoading, setAuthLoading] = useState(
    apiEnabled && Boolean(sessionStorage.getItem('labuibu-token')),
  );
  const [toast, setToast] = useState('');
  async function loadProducts() {
    setLoading(true);
    setCatalogError('');
    try {
      const data = unwrap(await api.get('/products'));
      if (!Array.isArray(data)) throw new Error();
      setProducts(data.map((p) => ({ ...p, id: productId(p) })));
    } catch {
      setCatalogError('Camilan belum bisa dimuat. Periksa koneksi lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (apiEnabled) loadProducts();
  }, []);
  useEffect(() => {
    if (!apiEnabled) return;
    if (!sessionStorage.getItem('labuibu-token')) {
      setUser(null);
      return;
    }
    api
      .get('/auth/me')
      .then((r) => {
        const data = unwrap(r);
        setUser(data.user || data);
      })
      .catch(() => {
        sessionStorage.removeItem('labuibu-token');
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);
  useEffect(() => {
    localStorage.setItem('labuibu-cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('labuibu-favorites', JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    if (user) sessionStorage.setItem('labuibu-user', JSON.stringify(user));
    else sessionStorage.removeItem('labuibu-user');
  }, [user]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  function add(product, quantity = 1) {
    setCart((items) => addCartItem(items, product, quantity));
    setToast(`${product.name} masuk ke keranjang`);
    track('add_to_cart', { currency: 'IDR', value: product.price * quantity });
  }
  function update(id, quantity) {
    setCart((items) => updateCartItem(items, id, quantity));
  }
  function favorite(id) {
    setFavorites((items) => toggleFavorite(items, id));
  }
  async function authenticate(mode, values) {
    values = (mode === 'register' ? registerSchema : loginSchema).parse(values);
    if (!apiEnabled) {
      setUser({ name: values.name || values.email.split('@')[0], email: values.email, demo: true });
      return;
    }
    const data = unwrap(await api.post(`/auth/${mode}`, values));
    if (!data.token || !data.user)
      throw new Error(
        'Respons login tidak sesuai. Hubungkan API dengan format yang didokumentasikan.',
      );
    sessionStorage.setItem('labuibu-token', data.token);
    setUser(data.user);
  }
  async function logout() {
    let message = 'Kamu sudah keluar dari akun.';
    if (apiEnabled) {
      try {
        await api.post('/auth/logout');
      } catch {
        message = 'Keluar dari perangkat ini. Sesi server akan kedaluwarsa otomatis.';
      }
    }
    sessionStorage.removeItem('labuibu-token');
    sessionStorage.removeItem('labuibu-receipt');
    setUser(null);
    setToast(message);
  }
  const { count, subtotal } = cartTotals(cart);
  return (
    <Context.Provider
      value={{
        products,
        loading,
        catalogError,
        loadProducts,
        cart,
        count,
        subtotal,
        add,
        update,
        clearCart: () => setCart([]),
        favorites,
        favorite,
        user,
        authLoading,
        authenticate,
        logout,
        toast,
        setToast,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useShop = () => useContext(Context);
