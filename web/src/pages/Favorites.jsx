import React from 'react';
import { Breadcrumb } from '../components/Commerce.jsx';
import { FavoriteProducts } from '../components/FavoriteProducts.jsx';

export function FavoritesPage() {
  return (
    <main className="page">
      <Breadcrumb items={[{ label: 'Akun', to: '/akun' }, { label: 'Cemilan favorit' }]} />
      <div className="page-heading">
        <h1>Cemilan favorit</h1>
        <p>Cemilan pilihan yang sudah kamu simpan.</p>
      </div>
      <FavoriteProducts showHeading={false} />
    </main>
  );
}
