import React, { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useShop } from './store.jsx';
import { initAnalytics, track } from './api.js';
import { Header, Footer } from './components/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { Protected } from './components/Protected.jsx';
import { NotFound } from './pages/NotFound.jsx';

const Admin = lazy(() => import('./Admin.jsx'));
const About = lazy(() => import('./About.jsx'));

function lazyPage(load, name) {
  return lazy(async () => ({ default: (await load())[name] }));
}
const Catalog = lazyPage(() => import('./pages/Catalog.jsx'), 'Catalog');
const Detail = lazyPage(() => import('./pages/ProductDetail.jsx'), 'Detail');
const Cart = lazyPage(() => import('./pages/Cart.jsx'), 'Cart');
const Checkout = lazyPage(() => import('./pages/Checkout.jsx'), 'Checkout');
const Auth = lazyPage(() => import('./pages/Auth.jsx'), 'Auth');
const Account = lazyPage(() => import('./pages/Account.jsx'), 'Account');
const OrdersPage = lazyPage(() => import('./pages/Orders.jsx'), 'OrdersPage');
const FavoritesPage = lazyPage(() => import('./pages/Favorites.jsx'), 'FavoritesPage');
const Success = lazyPage(() => import('./pages/OrderSuccess.jsx'), 'Success');

export function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }),
      );
    } else window.scrollTo(0, 0);
    track('page_view', { page_path: location.pathname + location.search });
    const titles = {
      '/': 'Cemilan Enak dan Sehat',
      '/dapur-labuibu': 'Dapur Labuibu',
      '/produk': 'Produk kami',
      '/keranjang': 'Shopping Cart',
      '/checkout': 'Checkout',
      '/login': 'Masuk',
      '/daftar': 'Daftar',
      '/akun': 'Akun Saya',
      '/pesanan-saya': 'Pesanan saya',
      '/favorit': 'Cemilan favorit',
      '/pesanan-berhasil': 'Pesanan',
    };
    document.title = `Labuibu — ${titles[location.pathname] || 'Camilan Rumahan'}`;
  }, [location.pathname, location.hash]);
  return null;
}

export default function App() {
  const { toast, setToast } = useShop();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten
      </a>
      <RouteEffects />
      <Header />
      <div id="main-content">
        <Suspense
          fallback={
            <main className="page" role="status" aria-busy="true">
              Memuat halaman...
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dapur-labuibu" element={<About />} />
            <Route path="/produk" element={<Catalog />} />
            <Route path="/produk/:id" element={<Detail />} />
            <Route path="/keranjang" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <Protected>
                  <Checkout />
                </Protected>
              }
            />
            <Route path="/login" element={<Auth />} />
            <Route path="/daftar" element={<Auth register />} />
            <Route path="/akun" element={<Account />} />
            <Route
              path="/pesanan-saya"
              element={
                <Protected>
                  <OrdersPage />
                </Protected>
              }
            />
            <Route path="/favorit" element={<FavoritesPage />} />
            <Route
              path="/admin"
              element={
                <Protected>
                  <Admin />
                </Protected>
              }
            />
            <Route
              path="/pesanan-berhasil"
              element={
                <Protected>
                  <Success />
                </Protected>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <Check size={18} />
            <span>{toast}</span>
            <Link to="/keranjang">Lihat</Link>
            <button
              className="icon-button"
              onClick={() => setToast('')}
              aria-label="Tutup pemberitahuan"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
