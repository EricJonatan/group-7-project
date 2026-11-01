import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../store.jsx';
import { productId } from '../data.js';
import { Grid } from './ProductGrid.jsx';
import { Empty } from './Commerce.jsx';

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
