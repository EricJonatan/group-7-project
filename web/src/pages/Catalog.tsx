import { useShop } from '../store.tsx';
import { Breadcrumb, Empty } from '../components/Commerce.tsx';
import { CatalogState, Grid } from '../components/ProductGrid.tsx';

export function Catalog() {
  const { products, loading, catalogError } = useShop();
  return (
    <main className="page catalog-page">
      <Breadcrumb items={[{ label: 'Produk kami' }]} />
      <div className="page-heading">
        <div className="eyebrow">
          <span /> KATALOG CAMILAN LABU
        </div>
        <h1>
          Pilih rasa. <em>Langsung pesan.</em>
        </h1>
        <p>
          Pilih jenis cemilannya, lalu tentukan rasa di halaman detail. Semua berbahan utama labu
          asli premium, tanpa perasa buatan.
        </p>
      </div>
      {loading || catalogError ? (
        <CatalogState />
      ) : products.length ? (
        <Grid products={products} />
      ) : (
        <Empty title="Camilan belum tersedia." text="Pilihan camilan akan segera hadir." />
      )}
    </main>
  );
}
