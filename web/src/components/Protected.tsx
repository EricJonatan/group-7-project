import { Navigate, useLocation } from 'react-router-dom';
import { useShop } from '../store.tsx';

export function Protected({ children }: React.PropsWithChildren) {
  const { user, authLoading } = useShop();
  const location = useLocation();
  if (authLoading)
    return (
      <main className="page">
        <p>Memeriksa akun...</p>
      </main>
    );
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
