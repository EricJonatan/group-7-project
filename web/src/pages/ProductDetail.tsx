import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Heart, Plus, ShoppingBag, Truck } from 'lucide-react';
import { useShop } from '../store.tsx';
import { money, productId, selectVariant } from '../data.ts';
import { CatalogState, Grid } from '../components/ProductGrid.tsx';
import { NotFound } from './NotFound.tsx';
import { Breadcrumb, Quantity } from '../components/Commerce.tsx';

export function Detail() {
  const { id = '' } = useParams();
  const { products, loading, catalogError, add, favorites, favorite } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState('');
  const product = products.find((p) => productId(p) === id);
  useEffect(() => {
    setQuantity(1);
    setVariantId('');
  }, [id]);
  if (loading || catalogError)
    return (
      <main className="page">
        <CatalogState />
      </main>
    );
  if (!product) return <NotFound />;
  const saved = favorites.includes(id);
  const selected = product.variants?.find((v) => v.id === variantId) || product.variants?.[0];
  const chosen = selected ? selectVariant(product, selected.id) : product;
  return (
    <main className="page detail-page">
      <Breadcrumb items={[{ label: 'Produk kami', to: '/produk' }, { label: product.name }]} />
      <div className="detail-layout">
        <div>
          <div className="detail-photo">
            <img src={product.image} alt={product.name} />
            <span className="product-badge">{product.badge}</span>
          </div>
          <p className="photo-note">
            {product.image === '/images/klepon.jpg' && (
              <>
                Foto:{' '}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Klepon_Top_View.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Joseagush
                </a>{' '}
                ·{' '}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY-SA 4.0
                </a>
                .
              </>
            )}
          </p>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            <span />
            {product.category} · BUATAN RUMAHAN
          </span>
          <div className="detail-title">
            <h1>{product.name}</h1>
            <button
              className={`icon-button ${saved ? 'accent' : ''}`}
              aria-pressed={saved}
              aria-label={saved ? 'Hapus dari favorit' : 'Simpan ke favorit'}
              onClick={() => favorite(id)}
            >
              <Heart fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="detail-price">
            <span className="price-amount">{money(chosen.price)}</span>
            <span>/ {product.unit}</span>
          </div>
          <p className="detail-description">{product.description}</p>
          <p className="premium-note">Berbahan utama labu asli premium, tanpa perasa buatan.</p>
          <div className="variant-picker">
            <span>
              Pilih varian: <strong>{selected?.name || 'Original'}</strong>
            </span>
            <div>
              {product.variants?.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected?.id === v.id}
                  className={selected?.id === v.id ? 'selected' : ''}
                  onClick={() => setVariantId(v.id)}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          <div className="stock">
            <span /> Tersedia untuk dipesan
          </div>
          <div className="purchase">
            <Quantity quantity={quantity} onChange={setQuantity} name={product.name} />
            <button className="button" onClick={() => add(chosen, quantity)}>
              Tambah ke Keranjang <ShoppingBag size={17} />
            </button>
          </div>
          <p className="small-note">
            <Truck size={17} /> Pilih pengiriman saat checkout
          </p>
          <div className="accordions">
            <details open>
              <summary>
                Bahan & informasi alergen <Plus size={16} />
              </summary>
              <p>
                {chosen.ingredients ||
                  'Informasi bahan belum tersedia. Hubungi penjual sebelum membeli jika kamu memiliki alergi.'}
              </p>
            </details>
            <details>
              <summary>
                Cara menyimpan <Plus size={16} />
              </summary>
              <p>{product.storage || 'Ikuti petunjuk penyimpanan pada kemasan produk.'}</p>
            </details>
            <details>
              <summary>
                Pengiriman <Plus size={16} />
              </summary>
              <p>
                {product.shippingNote ||
                  'Konfirmasi kemasan dan layanan pengiriman dengan penjual.'}
              </p>
            </details>
          </div>
        </div>
      </div>
      <section className="related">
        <div className="section-heading">
          <h2>
            Lengkapi <em>pesananmu.</em>
          </h2>
          <Link to="/produk" className="text-link">
            Lihat semua <ArrowRight size={17} />
          </Link>
        </div>
        <Grid products={products.filter((p) => productId(p) !== id).slice(0, 4)} />
      </section>
    </main>
  );
}
