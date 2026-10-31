import type { OrderRecord } from '@labuibu/contracts/types';
import { getErrorMessage } from '@labuibu/api-client';
import { orderSchema, shippingPrices } from '@labuibu/contracts';
import {
  createOrderReceipt,
  orderItemsFromCart,
  requiresInstantShipping,
} from '@labuibu/contracts/commerce';
import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../store.tsx';
import { money } from '../data.ts';
import { api, apiEnabled, track, unwrap } from '../api.ts';
import { Breadcrumb, Summary } from '../components/Commerce.tsx';

export function Checkout() {
  const { cart, subtotal, clearCart, user } = useShop();
  const requiresInstant = requiresInstantShipping(cart);
  const [delivery, setDelivery] = useState<'instant' | 'regular'>(
    requiresInstant ? 'instant' : 'regular',
  );
  const shippingMethod = requiresInstant ? 'instant' : delivery;
  const shipping = shippingPrices[shippingMethod];
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [orderKey] = useState(() => crypto.randomUUID());
  const lock = useRef(false);
  if (!cart.length) return <Navigate to="/keranjang" replace />;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    setError('');
    const fields = new FormData(e.currentTarget);
    const { payment, delivery: _delivery, ...customer } = Object.fromEntries(fields.entries());
    const parsed = orderSchema.safeParse({
      items: orderItemsFromCart(cart),
      shippingMethod,
      paymentMethod: payment,
      customer,
    });
    if (!parsed.success) {
      setError(
        'Lengkapi nama, email, nomor telepon, alamat (minimal 10 karakter), kota, dan kode pos 5 digit.',
      );
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      const order = apiEnabled
        ? unwrap<OrderRecord>(
            await api.post('/orders', parsed.data, { headers: { 'Idempotency-Key': orderKey } }),
          )
        : { id: `DEMO-${Date.now().toString(36).toUpperCase()}`, total: subtotal + shipping };
      const receipt = createOrderReceipt(order, {
        cart,
        shipping,
        paymentMethod: parsed.data.paymentMethod,
        demo: !apiEnabled,
      });
      sessionStorage.setItem('labuibu-receipt', JSON.stringify(receipt));
      clearCart();
      track('purchase', { currency: 'IDR', value: receipt.total, transaction_id: receipt.id });
      navigate('/pesanan-berhasil', { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Pesanan belum berhasil dikirim. Keranjangmu tetap tersimpan. Coba lagi, ya.',
        ),
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="page">
      <Breadcrumb items={[{ label: 'Shopping Cart', to: '/keranjang' }, { label: 'Checkout' }]} />
      <div className="page-heading">
        <span className="eyebrow">
          <span /> TINGGAL SELANGKAH LAGI
        </span>
        <h1>
          Selesaikan <em>pesananmu.</em>
        </h1>
        <p>Isi alamat, pilih pengiriman, lalu periksa total pesanan.</p>
      </div>
      {!apiEnabled && (
        <div className="demo-banner checkout-demo">
          <strong>Checkout demo</strong>
          <span>
            Pesanan ini hanya simulasi. Tidak ada pembayaran atau pengiriman sungguhan. Gunakan data
            contoh.
          </span>
        </div>
      )}
      <form className="checkout-layout form" onSubmit={submit}>
        <div className="checkout-fields">
          <section>
            <h2>
              <span>01</span> Informasi penerima
            </h2>
            <div className="form-grid">
              <label>
                Nama penerima
                <input
                  name="name"
                  defaultValue={user?.name}
                  autoComplete="name"
                  minLength={2}
                  required
                />
              </label>
              <label>
                Nomor telepon
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="08xxxxxxxxxx"
                  pattern="\+?[0-9\s()\-]{9,18}"
                  required
                />
              </label>
              <label className="wide">
                Alamat email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={user?.email}
                  required
                />
              </label>
            </div>
          </section>
          <section>
            <h2>
              <span>02</span> Alamat pengiriman
            </h2>
            <div className="form-grid">
              <label className="wide">
                Alamat lengkap
                <textarea
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  minLength={10}
                  maxLength={500}
                  required
                />
              </label>
              <label>
                Kota / Kabupaten
                <input
                  name="city"
                  autoComplete="address-level2"
                  minLength={2}
                  maxLength={100}
                  placeholder="Kota / kabupaten tujuan"
                  required
                />
              </label>
              <label>
                Kode pos
                <input
                  name="postcode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  placeholder="5 digit"
                  required
                />
              </label>
              <label className="wide">
                Catatan <span className="muted">(opsional)</span>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Ada yang perlu kami tahu?"
                  maxLength={500}
                />
              </label>
            </div>
          </section>
          <section>
            <h2>
              <span>03</span> Pilihan pengiriman
            </h2>
            <label className="radio-card">
              <input
                type="radio"
                name="delivery"
                value="regular"
                disabled={requiresInstant}
                defaultChecked={!requiresInstant}
                onChange={() => setDelivery('regular')}
              />
              <span>
                <strong>Reguler</strong>
                <small>Estimasi 2–3 hari · Hanya produk kering</small>
              </span>
              <b>
                <span className="price-amount">{money(shippingPrices.regular)}</span>
              </b>
            </label>
            <label className="radio-card">
              <input
                type="radio"
                name="delivery"
                value="instant"
                defaultChecked={requiresInstant}
                onChange={() => setDelivery('instant')}
              />
              <span>
                <strong>Instan</strong>
                <small>Hari yang sama · Wajib untuk produk segar & dingin</small>
              </span>
              <b>
                <span className="price-amount">{money(shippingPrices.instant)}</span>
              </b>
            </label>
            <p className="small-note">
              {apiEnabled
                ? 'Ketersediaan layanan dan biaya akhir dikonfirmasi oleh server.'
                : 'Tarif dan estimasi di atas adalah contoh untuk demo.'}
            </p>
          </section>
          <section>
            <h2>
              <span>04</span> Metode pembayaran
            </h2>
            <label className="radio-card">
              <input name="payment" type="radio" value="bank_transfer" defaultChecked />
              <span>
                <strong>Transfer bank</strong>
                <small>Instruksi akan diberikan setelah pesanan dikonfirmasi</small>
              </span>
            </label>
            <label className="radio-card">
              <input name="payment" type="radio" value="cod" />
              <span>
                <strong>Bayar di tempat</strong>
                <small>Tergantung ketersediaan layanan di alamatmu</small>
              </span>
            </label>
          </section>
        </div>
        <Summary shipping={shipping}>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <button className="button full" disabled={busy}>
            {busy ? 'Memproses...' : !apiEnabled ? 'Buat Pesanan Demo' : 'Buat Pesanan'}
            <ArrowRight size={17} />
          </button>
          <p className="demo-note">
            {!apiEnabled
              ? 'Tidak ada uang yang ditagihkan.'
              : 'Pesanan akan diverifikasi oleh penjual.'}
          </p>
        </Summary>
      </form>
    </main>
  );
}
