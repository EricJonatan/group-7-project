import { Breadcrumb } from '../components/Commerce.tsx';
import { OrderHistory } from '../components/OrderHistory.tsx';

export function OrdersPage() {
  return (
    <main className="page orders-page">
      <Breadcrumb items={[{ label: 'Akun', to: '/akun' }, { label: 'Pesanan saya' }]} />
      <div className="page-heading">
        <h1>Pesanan saya</h1>
        <p>Lihat pesanan dan informasi pembayaranmu.</p>
      </div>
      <OrderHistory showHeading={false} />
    </main>
  );
}
