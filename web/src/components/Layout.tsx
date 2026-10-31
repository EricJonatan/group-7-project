import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useShop } from '../store.tsx';
import { Brand } from './Brand.tsx';

export function Header() {
  const { count, user } = useShop();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <>
      <header className="header">
        <Brand />
        <nav className={open ? 'nav open' : 'nav'} aria-label="Navigasi utama">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/produk">Produk kami</NavLink>
          <NavLink to="/dapur-labuibu" onClick={() => setOpen(false)}>
            Dapur Labuibu
          </NavLink>
        </nav>
        <div className="header-actions">
          <Link className="account-link desktop-account-link" to={user ? '/akun' : '/login'}>
            <UserRound size={18} />
            <span>{user ? 'Akun' : 'Masuk'}</span>
          </Link>
          <Link className="account-link mobile-account-link" to="/akun" aria-label="Akun">
            <UserRound size={18} />
            <span>Akun</span>
          </Link>
          <span className="action-divider" />
          <Link className="bag-link" to="/keranjang" aria-label={`Shopping Cart, ${count} produk`}>
            <ShoppingBag size={20} />
            <span className="cart-count">{count}</span>
          </Link>
          <button
            className="icon-button menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navigasi ponsel">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/produk">Produk kami</NavLink>
          <NavLink to="/akun">Akun</NavLink>
        </nav>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer footer-minimal">
      <Brand />
      <p>
        Semua bahan utama dari labu asli premium,
        <br className="footer-mobile-break" />
        <em>tanpa perasa buatan.</em>
      </p>
      <small>© {new Date().getFullYear()} Labuibu</small>
    </footer>
  );
}
