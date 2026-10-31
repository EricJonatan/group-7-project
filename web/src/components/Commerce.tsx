import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Plus } from 'lucide-react';
import { useShop } from '../store.tsx';
import { money, cartKey } from '../data.ts';
import { Pumpkin } from './Brand.tsx';

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span>/</span>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function Quantity({
  quantity,
  onChange,
  name = 'produk',
}: {
  quantity: number;
  onChange: (value: number) => void;
  name?: string;
}) {
  return (
    <div className="quantity">
      <button
        aria-label={`Kurangi jumlah ${name}`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        aria-label={`Tambah jumlah ${name}`}
        disabled={quantity >= 99}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <Pumpkin />
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Summary({ shipping, children }: React.PropsWithChildren<{ shipping?: number }>) {
  const { subtotal, cart } = useShop();
  return (
    <aside className="summary">
      <h2>Ringkasan pesanan</h2>
      <div className="summary-items">
        {cart.map(({ product, quantity }) => (
          <div className="summary-product" key={cartKey(product)}>
            <div>
              <strong>{product.name}</strong>
              <small>
                {product.variantName ? `${product.variantName} · ` : ''}
                {quantity} × <span className="price-amount">{money(product.price)}</span>
              </small>
            </div>
            <span>
              <span className="price-amount">{money(product.price * quantity)}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="summary-row">
        <span>Ongkir</span>
        <span>
          {shipping === undefined ? (
            'Dihitung saat checkout'
          ) : (
            <span className="price-amount">{money(shipping)}</span>
          )}
        </span>
      </div>
      <div className="summary-total">
        <span>Total pembayaran</span>
        <strong>
          <span className="price-amount">{money(subtotal + (shipping || 0))}</span>
        </strong>
      </div>
      {children}
      <p className="summary-note">
        <Heart size={15} /> Cek total sebelum membuat pesanan.
      </p>
    </aside>
  );
}
