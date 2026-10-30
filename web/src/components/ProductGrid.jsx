import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../store.jsx';
import { money, productId } from '../data.js';

export function Card({ product }) {
  const { favorites, favorite } = useShop();
  const id = productId(product);
  const saved = favorites.includes(id);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/produk/${id}`} className="product-image">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <button
          className={`favorite-button ${saved ? 'saved' : ''}`}
          aria-label={`${saved ? 'Hapus' : 'Simpan'} ${product.name} ${saved ? 'dari' : 'ke'} favorit`}
          aria-pressed={saved}
          onClick={() => favorite(id)}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3>
        <Link to={`/produk/${id}`}>{product.name}</Link>
      </h3>
      <div className="card-bottom">
        <span className="price-amount">{money(product.price)}</span>
      </div>
    </article>
  );
}

export function Grid({ products }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <Card key={productId(p)} product={p} />
      ))}
    </div>
  );
}

export function CatalogState() {
  const { loading, catalogError, loadProducts } = useShop();
  return loading ? (
    <div className="empty">
      <span className="spinner" />
      <p>Menyiapkan camilan...</p>
    </div>
  ) : catalogError ? (
    <div className="empty" role="alert">
      <p>{catalogError}</p>
      <button className="button outline" onClick={loadProducts}>
        Coba lagi
      </button>
    </div>
  ) : null;
}
