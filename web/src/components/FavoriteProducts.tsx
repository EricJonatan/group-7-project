import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../store.tsx';
import { productId } from '../data.ts';
import { Grid } from './ProductGrid.tsx';
import { Empty } from './Commerce.tsx';

export function FavoriteProducts({ showHeading = true }) {
  const { products, favorites } = useShop();
  const saved = products.filter((p) => favorites.includes(productId(p)));
  return (
    <section>
      {showHeading && (
        <div className="section-heading">
          <h2>
            Camilan <em>favoritmu.</em>
          </h2>
          <Link className="text-link" to="/keranjang">
            Lihat Shopping Cart <ArrowRight size={17} />
          </Link>
        </div>
      )}
      {saved.length ? (
        <Grid products={saved} />
      ) : (
        <Empty
          title="Simpan yang kamu suka."
          text="Ketuk ikon hati di camilan pilihanmu. Semuanya akan ada di sini."
          action={
            <Link className="button" to="/produk">
              Jelajahi Camilan <ArrowRight size={17} />
            </Link>
          }
        />
      )}
    </section>
  );
}
