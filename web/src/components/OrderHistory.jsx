import { createOrderReceipt, orderDate, orderStatusLabels } from '@labuibu/contracts/commerce';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../store.jsx';
import { money, orderPreview } from '../data.js';
import { api, apiEnabled, unwrap } from '../api.js';

export function OrderHistory({ showHeading = true }) {
  const { products } = useShop();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(apiEnabled);
  useEffect(() => {
    let active = true;
    if (apiEnabled)
      api
        .get('/orders')
        .then((r) => {
          if (active) setOrders(unwrap(r));
        })
        .catch(() => {
          if (active) setError('Riwayat pesanan belum bisa dimuat.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    else {
      try {
        const receipt = JSON.parse(sessionStorage.getItem('labuibu-receipt'));
        if (receipt)
          setOrders([
            { ...receipt, _id: receipt.id, createdAt: receipt.date, status: 'processing' },
          ]);
      } catch {}
    }
    return () => {
      active = false;
    };
  }, []);
  return (
    <section id="pesanan-saya" className="order-history">
      {showHeading && <h2>Pesanan saya</h2>}
      {loading && <p className="muted">Memuat pesanan...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !orders.length && !error && (
        <p className="muted">Belum ada pesanan. Pilih camilan dan lanjutkan ke checkout.</p>
      )}
      {orders.map((o) => {
        const preview = orderPreview(o, products);
        const date = orderDate(o);
        return (
          <article className="order-card" key={o._id}>
            <div className="order-card-header">
              <span title={o._id}>#{o._id}</span>
              <time className="order-card-date" dateTime={o.createdAt || o.date}>
                {date}
              </time>
            </div>
            <div className="order-card-body">
              {preview.image ? (
                <img className="order-card-thumb" src={preview.image} alt={preview.name} />
              ) : (
                <div className="order-card-thumb order-thumb-placeholder">
                  <ShoppingBag size={24} />
                </div>
              )}
              <div className="order-card-info">
                <strong>{preview.name}</strong>
                <small>
                  {preview.detail}
                  {!o.demo && <> · {orderStatusLabels[o.status]}</>}
                </small>
                <div className="order-card-total">
                  <b>
                    <span className="price-amount">{money(o.total)}</span>
                  </b>
                </div>
              </div>
              <Link
                className="order-detail-link"
                aria-label={`Lihat detail pesanan ${o._id}`}
                title="Lihat detail pesanan"
                to="/pesanan-berhasil"
                onClick={() =>
                  sessionStorage.setItem('labuibu-receipt', JSON.stringify(createOrderReceipt(o)))
                }
              >
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
