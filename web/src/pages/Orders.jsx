import React from 'react';
import { Breadcrumb } from '../components/Commerce.jsx';
import { OrderHistory } from '../components/OrderHistory.jsx';

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
