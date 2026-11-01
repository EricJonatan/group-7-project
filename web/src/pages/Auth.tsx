import { getErrorMessage } from '@labuibu/api-client';
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../store.tsx';
import { apiEnabled } from '../api.ts';

export function Auth({ register = false }: { register?: boolean }) {
  const { authenticate, user } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const from =
    location.state?.from?.startsWith('/') && !location.state.from.startsWith('//')
      ? location.state.from
      : '/akun';
  useEffect(() => {
    setError('');
  }, [register]);
  if (user) return <Navigate to={from} replace />;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const values = {
      email: String(f.get('email') || '').trim(),
      password: String(f.get('password') || ''),
      ...(register ? { name: String(f.get('name') || '').trim() } : {}),
    };
    if (register && !values.name) {
      setError('Isi nama kamu terlebih dahulu.');
      setBusy(false);
      return;
    }
    try {
      await authenticate(register ? 'register' : 'login', values);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          apiEnabled
            ? 'Belum berhasil masuk. Periksa email, kata sandi, dan koneksimu.'
            : err instanceof Error
              ? err.message
              : 'Belum berhasil masuk.',
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-layout login-layout">
      <Link to="/produk" className="back-link login-back">
        <ArrowLeft size={16} /> Kembali ke camilan
      </Link>
      <div className="auth-content">
        <h1>{register ? 'Buat akun Labuibu' : 'Masuk ke Labuibu'}</h1>
        <p>
          {register
            ? 'Daftar untuk belanja dan cek pesanan.'
            : 'Masuk untuk belanja dan cek pesanan.'}
        </p>
        <form className="form auth-form" onSubmit={submit} key={register ? 'register' : 'login'}>
          {register && (
            <label>
              Nama lengkap
              <input
                name="name"
                autoComplete="name"
                placeholder="Nama kamu"
                minLength={2}
                maxLength={80}
                required
              />
            </label>
          )}
          <label>
            Alamat email
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
            />
          </label>
          <label>
            Kata sandi
            <input
              name="password"
              type="password"
              autoComplete={register ? 'new-password' : 'current-password'}
              placeholder="Minimal 8 karakter"
              minLength={8}
              maxLength={128}
              required
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button full" disabled={busy}>
            {busy ? 'Sebentar, ya...' : register ? 'Daftar' : 'Masuk'}
            {!busy && <ArrowRight size={17} />}
          </button>
        </form>
        <p className="auth-switch">
          {register ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
          <Link to={register ? '/login' : '/daftar'} state={{ from }}>
            {register ? 'Masuk di sini' : 'Daftar di sini'}
          </Link>
        </p>
        {!apiEnabled && (
          <p className="login-demo-note">
            <strong>Mode demo · Belum terhubung ke server.</strong>
            <span>
              {register
                ? 'Pendaftaran membuat sesi demo, bukan akun sungguhan. Kata sandi tidak disimpan.'
                : 'Gunakan email dan kata sandi contoh (min. 8 karakter). Kata sandi tidak disimpan.'}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
