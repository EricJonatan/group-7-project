import type {
  Product,
  SelectedProduct,
  CartItem,
  User,
  AuthInput,
  AuthResponse,
} from '@labuibu/contracts/types';
import { loginSchema, registerSchema } from '@labuibu/contracts';
import {
  addCartItem,
  updateCartItem,
  toggleFavorite,
  cartTotals,
} from '@labuibu/contracts/commerce';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, apiEnabled, track, unwrap } from './api.ts';
import { products as demoProducts, productId, restoreCart } from './data.ts';

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
  catalogError: string;
  loadProducts: () => Promise<void>;
  clearCart: () => void;
  authLoading: boolean;
  authenticate: (mode: 'register' | 'login', values: AuthInput) => Promise<void>;
  toast: string;
  setToast: React.Dispatch<React.SetStateAction<string>>;
}
const Context = createContext<ShopContextValue | null>(null);
function read<T>(key: string, fallback: T, storage = localStorage): T {
  try {
    return JSON.parse(storage.getItem(key) || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}
export function ShopProvider({ children }: React.PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>(apiEnabled ? [] : demoProducts);
  const [loading, setLoading] = useState(apiEnabled);
  const [catalogError, setCatalogError] = useState('');
  const [cart, setCart] = useState(() => restoreCart(read('labuibu-cart', [])));
  const [favorites, setFavorites] = useState(() => {
    const value = read<string[]>('labuibu-favorites', []);
    return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [];
  });
  const [user, setUser] = useState(() => read<User | null>('labuibu-user', null, sessionStorage));
  const [authLoading, setAuthLoading] = useState(
    apiEnabled && Boolean(sessionStorage.getItem('labuibu-token')),
  );
  const [toast, setToast] = useState('');
  async function loadProducts() {
    setLoading(true);
    setCatalogError('');
    try {
      const res = await api.get('/products');
      const data = unwrap<Product[]>(res);
      if (Array.isArray(data) && data.length > 0) {
        setProducts(
          data.map((p) => {
            const id = productId(p);
            const demo = demoProducts.find(
              (d) => d.name.toLowerCase() === p.name.toLowerCase() || d.id === id,
            );
            return {
              ...demo,
              ...p,
              id: id || demo?.id || '',
              badge: p.badge || demo?.badge || 'Buatan rumahan',
              unit: p.unit || demo?.unit || 'kemasan',
              variants: p.variants && p.variants.length > 0 ? p.variants : demo?.variants,
            };
          }),
        );
      } else {
        setProducts(demoProducts);
      }
    } catch (err) {
      console.warn('API error, falling back to local catalog:', err);
      setProducts(demoProducts);
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
        const data = unwrap<{ user: User }>(r);
        setUser(data.user);
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
  function add(product: SelectedProduct, quantity = 1) {
    setCart((items) => addCartItem(items, product, quantity));
    setToast(`${product.name} masuk ke keranjang`);
    track('add_to_cart', { currency: 'IDR', value: product.price * quantity });
  }
  function update(id: string, quantity: number) {
    setCart((items) => updateCartItem(items, id, quantity));
  }
  function favorite(id: string) {
    setFavorites((items) => toggleFavorite(items, id));
  }
  async function authenticate(mode: 'register' | 'login', values: AuthInput) {
    values = (mode === 'register' ? registerSchema : loginSchema).parse(values);
    if (!apiEnabled) {
      setUser({ name: values.name || values.email.split('@')[0], email: values.email, demo: true });
      return;
    }
    const data = unwrap<AuthResponse>(await api.post(`/auth/${mode}`, values));
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
export function useShop() {
  const shop = useContext(Context);
  if (!shop) throw new Error('ShopProvider is missing.');
  return shop;
}
