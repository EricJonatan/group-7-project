import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useShop } from './store.tsx';
import { initAnalytics, track } from './api.ts';
import { Header, Footer } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { Protected } from './components/Protected.tsx';
import { NotFound } from './pages/NotFound.tsx';

const Admin = lazy(() => import('./Admin.tsx'));
const About = lazy(() => import('./About.tsx'));

const Catalog = lazy(() =>
  import('./pages/Catalog.tsx').then((module) => ({ default: module.Catalog })),
);
const Detail = lazy(() =>
  import('./pages/ProductDetail.tsx').then((module) => ({ default: module.Detail })),
);
const Cart = lazy(() => import('./pages/Cart.tsx').then((module) => ({ default: module.Cart })));
const Checkout = lazy(() =>
  import('./pages/Checkout.tsx').then((module) => ({ default: module.Checkout })),
);
const Auth = lazy(() => import('./pages/Auth.tsx').then((module) => ({ default: module.Auth })));
const Account = lazy(() =>
  import('./pages/Account.tsx').then((module) => ({ default: module.Account })),
);
const OrdersPage = lazy(() =>
  import('./pages/Orders.tsx').then((module) => ({ default: module.OrdersPage })),
);
const FavoritesPage = lazy(() =>
  import('./pages/Favorites.tsx').then((module) => ({ default: module.FavoritesPage })),
);
const Success = lazy(() =>
  import('./pages/OrderSuccess.tsx').then((module) => ({ default: module.Success })),
);

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
    const titles: Record<string, string> = {
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
