import type {
  Product,
  ProductVariant,
  OrderRecord,
  User,
  Customer,
  OrderStatus,
} from '@labuibu/contracts/types';
import { getErrorMessage } from '@labuibu/api-client';
import { orderStatusTransitions } from '@labuibu/contracts/commerce';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api, apiEnabled, unwrap } from './api.ts';
import { useShop } from './store.tsx';
import { productSchema } from '@labuibu/contracts';
import { productCategories } from '@labuibu/contracts/catalog';
import { money } from './data.ts';
type ProductForm = Omit<Product, 'price' | 'variants'> & {
  price: number | string;
  variants: (Omit<ProductVariant, 'price'> & { price: number | string })[];
};
type AdminOrder = OrderRecord & { _id: string; customer: Customer; status: OrderStatus };
const blank: ProductForm = {
  id: '',
  name: '',
  category: 'Keripik',
  price: 22000,
  unit: '100 gram',
  badge: 'Buatan rumahan',
  image: '/images/chips-table.jpg',
  description: '',
  ingredients: '',
  storage: '',
  shippingClass: 'fresh',
  shippingNote: '',
  variants: [{ id: 'original', name: 'Original', price: 22000 }],
  active: true,
};
export default function Admin() {
  const { user, authLoading, loadProducts } = useShop();
  const [tab, setTab] = useState('produk');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const items = tab === 'produk' ? products : tab === 'pesanan' ? orders : users;
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductForm | null>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    setError('');
    try {
      if (tab === 'produk')
        setProducts(unwrap<Product[]>(await api.get('/products?includeInactive=true&limit=100')));
      else if (tab === 'pesanan')
        setOrders(unwrap<AdminOrder[]>(await api.get('/orders?all=true&limit=100')));
      else setUsers(unwrap<User[]>(await api.get('/users?limit=100')));
    } catch (err) {
      setError(getErrorMessage(err, 'Data belum bisa dimuat.'));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user?.role === 'admin') load();
  }, [tab, user?.role]);
  if (authLoading) return <main className="page">Memeriksa akun...</main>;
  if (!apiEnabled || user?.role !== 'admin') return <Navigate to="/akun" replace />;
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!form) return;
    const parsed = productSchema.safeParse({
      ...form,
      price: form.variants?.length
        ? Math.min(...form.variants.map((v) => Number(v.price)))
        : Number(form.price),
      variants: form.variants?.length
        ? form.variants.map((v) => ({ ...v, price: Number(v.price) }))
        : undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' · '));
      return;
    }
    setBusy(true);
    try {
      const { id, ...values } = parsed.data;
      await (editing ? api.patch(`/products/${id}`, values) : api.post('/products', parsed.data));
      setForm(null);
      setNotice('Produk berhasil disimpan.');
      await load();
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, 'Produk belum berhasil disimpan.'));
    } finally {
      setBusy(false);
    }
  }
  async function remove(p: Product) {
    if (!confirm(`Nonaktifkan ${p.name}? Produk tidak akan muncul di katalog.`)) return;
    setBusy(true);
    try {
      await api.delete(`/products/${p.id}`);
      await load();
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, 'Produk belum berhasil dinonaktifkan.'));
    } finally {
      setBusy(false);
    }
  }
  async function status(id: string, value: string) {
    setBusy(true);
    try {
      await api.patch(`/orders/${id}/status`, { status: value });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Status belum berhasil diperbarui.'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">DAPUR ADMIN</span>
        <h1>
          Kelola <em>Labuibu.</em>
        </h1>
        <p>Produk, pesanan, dan pelanggan dalam satu tempat.</p>
      </div>
      <div className="admin-tabs">
        {['produk', 'pesanan', 'pelanggan'].map((t) => (
          <button
            className={tab === t ? 'active' : ''}
            key={t}
            onClick={() => {
              setTab(t);
              setForm(null);
              setNotice('');
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {tab === 'produk' && (
        <button
          className="button"
          onClick={() => {
            setEditing(false);
            setForm({ ...blank, variants: [{ id: 'original', name: 'Original', price: 22000 }] });
          }}
        >
          Tambah Produk +
        </button>
      )}
      {form && (
        <form className="form admin-form" onSubmit={save}>
          <h2>{editing ? 'Edit' : 'Tambah'} produk</h2>
          <div className="form-grid">
            {(['id', 'name', 'unit', 'price', 'badge', 'image'] as const).map((key) => (
              <label key={key}>
                {
                  {
                    id: 'ID / slug',
                    name: 'Nama',
                    unit: 'Ukuran',
                    price: 'Harga (Rp)',
                    badge: 'Label',
                    image: 'URL gambar',
                  }[key]
                }
                <input
                  type={key === 'price' ? 'number' : 'text'}
                  value={form[key]}
                  disabled={
                    (key === 'id' && editing) || (key === 'price' && form.variants?.length > 0)
                  }
                  required={key !== 'badge'}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <label>
              Kategori
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Product['category'] })
                }
              >
                {productCategories.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={String(form.active)}
                onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </label>
            {(['description', 'ingredients', 'storage'] as const).map((key) => (
              <label className="wide" key={key}>
                {
                  {
                    description: 'Deskripsi',
                    ingredients: 'Bahan & alergen',
                    storage: 'Penyimpanan',
                  }[key]
                }
                <textarea
                  value={form[key]}
                  rows={3}
                  required
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <h3>Varian produk</h3>
          {form.variants?.map((v, index) => (
            <div className="admin-variant-row" key={index}>
              <label>
                ID varian
                <input
                  value={v.id}
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      variants: form.variants.map((item, i) =>
                        i === index ? { ...item, id: e.target.value } : item,
                      ),
                    })
                  }
                />
              </label>
              <label>
                Nama varian
                <input
                  value={v.name}
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      variants: form.variants.map((item, i) =>
                        i === index ? { ...item, name: e.target.value } : item,
                      ),
                    })
                  }
                />
              </label>
              <label>
                Harga (Rp)
                <input
                  type="number"
                  min="1000"
                  value={v.price}
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      variants: form.variants.map((item, i) =>
                        i === index ? { ...item, price: Number(e.target.value) } : item,
                      ),
                    })
                  }
                />
              </label>
              <label className="wide">
                Bahan & alergen varian
                <textarea
                  value={v.ingredients || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      variants: form.variants.map((item, i) =>
                        i === index ? { ...item, ingredients: e.target.value } : item,
                      ),
                    })
                  }
                />
              </label>
              <button
                type="button"
                className="text-button"
                disabled={form.variants.length === 1}
                onClick={() =>
                  setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) })
                }
              >
                Hapus varian
              </button>
            </div>
          ))}
          <button
            type="button"
            className="button outline"
            onClick={() =>
              setForm({
                ...form,
                variants: [...(form.variants || []), { id: '', name: '', price: 22000 }],
              })
            }
          >
            Tambah Varian
          </button>
          <label>
            Jenis pengiriman
            <select
              value={form.shippingClass}
              onChange={(e) =>
                setForm({ ...form, shippingClass: e.target.value as Product['shippingClass'] })
              }
            >
              <option value="dry">Produk kering</option>
              <option value="fresh">Produk segar</option>
              <option value="chilled">Wajib dingin</option>
            </select>
          </label>
          <div className="admin-buttons">
            <button className="button" disabled={busy}>
              Simpan Produk
            </button>
            <button className="button outline" type="button" onClick={() => setForm(null)}>
              Batal
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <p>Memuat...</p>
      ) : !items.length ? (
        <p className="empty">Belum ada data.</p>
      ) : (
        <div className="admin-list">
          {tab === 'produk'
            ? products.map((p) => (
                <article key={p.id}>
                  <img src={p.image} alt="" />
                  <div>
                    <h3>{p.name}</h3>
                    <p>
                      <span className="price-amount">{money(p.price)}</span> ·{' '}
                      {p.active ? 'Aktif' : 'Nonaktif'}
                    </p>
                  </div>
                  <div className="admin-buttons">
                    <button
                      className="text-button"
                      disabled={busy}
                      onClick={() => {
                        setEditing(true);
                        setForm({ ...blank, ...p, variants: p.variants || [] });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-button"
                      disabled={busy || !p.active}
                      onClick={() => remove(p)}
                    >
                      Nonaktifkan
                    </button>
                  </div>
                </article>
              ))
            : tab === 'pesanan'
              ? orders.map((o) => (
                  <article className="admin-order" key={o._id}>
                    <div>
                      <h3>#{o._id.slice(-8)}</h3>
                      <p>
                        {o.customer.name} · {o.customer.phone} · {o.customer.email}
                      </p>
                      <p>
                        {o.customer.address}, {o.customer.city}, {o.customer.postcode}
                      </p>
                      <p>{o.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')}</p>
                      <p>
                        <span className="price-amount">{money(o.total)}</span> · {o.paymentMethod} ·{' '}
                        {o.shippingMethod}
                      </p>
                    </div>
                    <div>
                      <strong>{o.status}</strong>
                      <select
                        disabled={busy}
                        aria-label={`Ubah status pesanan ${o._id}`}
                        value=""
                        onChange={(e) => status(o._id, e.target.value)}
                      >
                        <option value="" disabled>
                          Ubah status
                        </option>
                        {orderStatusTransitions[o.status].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))
              : users.map((u) => (
                  <article key={u._id}>
                    <div>
                      <h3>{u.name}</h3>
                      <p>
                        {u.email} · {u.role}
                      </p>
                    </div>
                  </article>
                ))}
        </div>
      )}
      <Link to="/akun" className="text-link">
        Kembali ke akun
      </Link>
    </main>
  );
}
