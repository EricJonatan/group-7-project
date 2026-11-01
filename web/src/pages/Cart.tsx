import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { useShop } from '../store.tsx';
import { money, productId, cartKey } from '../data.ts';
import { apiEnabled, track } from '../api.ts';
import { Breadcrumb, Empty, Quantity, Summary } from '../components/Commerce.tsx';

export function Cart() {
  const { cart, subtotal, update } = useShop();
  return (
    <main className="page">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
      <div className="page-heading">
        <div className="eyebrow">
          <span /> CEK PILIHAN CAMILANMU
        </div>
        <h1>Shopping Cart</h1>
        <p>Atur jumlah, periksa total, lalu lanjut ke checkout.</p>
      </div>
      {!cart.length ? (
        <Empty
          title="Keranjangmu masih kosong."
          text="Pilih keripik, donat, atau bolu, lalu tambahkan ke keranjang."
          action={
            <Link to="/produk" className="button">
              Pilih Camilan <ArrowRight size={17} />
            </Link>
          }
        />
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-table-label">
              <span>PRODUK</span>
              <span>JUMLAH & HARGA</span>
            </div>
            {cart.map(({ product, quantity }) => (
              <article className="cart-item" key={cartKey(product)}>
                <Link to={`/produk/${productId(product)}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="cart-item-info">
                  <span className="eyebrow">{product.category}</span>
                  <h3>
                    <Link to={`/produk/${productId(product)}`}>{product.name}</Link>
                  </h3>
                  <p>
                    {product.variantName && (
                      <>
                        <strong>{product.variantName}</strong>
                        <br />
                      </>
                    )}
                    {product.unit} · <span className="price-amount">{money(product.price)}</span>
                  </p>
                </div>
                <div className="cart-item-end">
                  <Quantity
                    quantity={quantity}
                    name={product.name}
                    onChange={(n) => update(cartKey(product), n)}
                  />
                  <strong>
                    <span className="price-amount">{money(product.price * quantity)}</span>
                  </strong>
                  <button
                    className="text-button muted"
                    aria-label={`Hapus ${product.name} dari keranjang`}
                    onClick={() => update(cartKey(product), 0)}
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </article>
            ))}
            <Link className="text-link continue-shopping" to="/produk">
              <ArrowLeft size={16} /> Tambah camilan lainnya
            </Link>
          </div>
          <Summary>
            <Link
              className="button full"
              to="/checkout"
              onClick={() => track('begin_checkout', { currency: 'IDR', value: subtotal })}
            >
              Lanjut ke Checkout <ArrowRight size={17} />
            </Link>
            {!apiEnabled && <p className="demo-note">Mode demo · Tidak ada transaksi sungguhan.</p>}
          </Summary>
        </div>
      )}
    </main>
  );
}
