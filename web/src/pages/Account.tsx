import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut } from 'lucide-react';
import { useShop } from '../store.tsx';
import { Breadcrumb } from '../components/Commerce.tsx';
import { AccountMenu } from '../components/AccountMenu.tsx';
import { OrderHistory } from '../components/OrderHistory.tsx';
import { FavoriteProducts } from '../components/FavoriteProducts.tsx';

export function Account() {
  const { user, logout } = useShop();
  const navigate = useNavigate();
  if (!user)
    return (
      <main className="page">
        <Breadcrumb items={[{ label: 'Akun saya' }]} />
        <div className="page-heading">
          <h1>Akun saya</h1>
          <p>Masuk untuk melanjutkan belanja dan melihat pesanan.</p>
          <Link className="button" to="/login">
            Masuk / Daftar <ArrowRight size={17} />
          </Link>
        </div>
        <AccountMenu />
      </main>
    );
  return (
    <main className="page">
      <Breadcrumb items={[{ label: 'Akun saya' }]} />
      <div className="account-heading">
        <div className="page-heading">
          <span className="eyebrow">
            <span /> AKUN & PESANAN SAYA
          </span>
          <h1>
            Halo, <em>{user.name}.</em>
          </h1>
          <p>{user.email}</p>
          {user.demo && <p className="demo-note">Akun demo · Sesi tersimpan hanya di tab ini.</p>}
        </div>
        <button
          className="button outline"
          onClick={async () => {
            await logout();
            navigate('/');
          }}
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
      <AccountMenu />
      {user.role === 'admin' && (
        <p>
          <Link className="button" to="/admin">
            Buka Dapur Admin <ArrowRight size={17} />
          </Link>
        </p>
      )}
      <div className="desktop-account-content">
        <OrderHistory />
        <FavoriteProducts />
      </div>
    </main>
  );
}
