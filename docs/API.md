# Kontrak integrasi API frontend

Dokumen ini menjelaskan format yang diharapkan web dan app. Implementasi server dikerjakan terpisah oleh tim backend. Endpoint dan perilaku di bawah perlu dicocokkan saat integrasi; ini bukan laporan pengujian server.

Base URL: `http://localhost:4000/api` atau URL deployment ditambah `/api`. Respons sukses berbentuk `{ "data": ... }`. Error berbentuk `{ "message": "...", "errors": [...] }` untuk validasi. Token dikirim melalui `Authorization: Bearer TOKEN`.

| Method | Endpoint | Akses | Fungsi |
| --- | --- | --- | --- |
| POST | /auth/register | Publik | Buat customer; name, email, password |
| POST | /auth/login | Publik | Login; email, password; hasil user + token |
| GET | /auth/me | Login | Hasil `{ user }` |
| POST | /auth/logout | Login | Batalkan semua sesi akun; 204 |
| GET | /products | Publik | Produk aktif; category, limit, skip |
| GET | /products?includeInactive=true | Admin | Produk aktif/nonaktif |
| GET | /products/:id | Publik | Detail berdasarkan slug |
| POST | /products | Admin | Buat produk |
| PATCH | /products/:id | Admin | Edit produk |
| DELETE | /products/:id | Admin | Nonaktifkan produk; 204 |
| GET | /users/me | Login | Profil sendiri |
| PATCH | /users/me | Login | Edit name/email; role ditolak |
| DELETE | /users/me | Customer | Hapus akun dan order sendiri; 204 |
| GET | /users | Admin | Daftar pengguna; limit, skip |
| DELETE | /users/:id | Admin | Hapus customer dan ordernya; admin dilindungi |
| POST | /orders | Login | Buat order, wajib Idempotency-Key |
| GET | /orders | Login | Riwayat order sendiri; limit, skip |
| GET | /orders?all=true | Admin | Semua order; limit, skip |
| GET | /orders/:id | Pemilik/admin | Detail order |
| PATCH | /orders/:id/status | Admin | Transisi status terkontrol |

Contoh create order:

```json
{
  "items": [{ "productId": "keripik-labu", "variantId": "keripik-original", "quantity": 2 }],
  "shippingMethod": "regular",
  "paymentMethod": "bank_transfer",
  "customer": {
    "name": "Contoh Pengguna",
    "email": "contoh@example.com",
    "phone": "081234567890",
    "address": "Jalan Labu Nomor 123",
    "city": "Jakarta",
    "postcode": "12345",
    "notes": ""
  }
}
```

Kirim header `Idempotency-Key` dengan UUID baru untuk tiap checkout. Retry request yang sama memakai key yang sama. Reuse key dengan payload berbeda menghasilkan 409. Jangan kirim unit price/total dari client: skema strict menolaknya. Quantity 1-99, maksimal 30 jenis item. Reguler Rp15.000, instan Rp25.000. Backend harus menjadi sumber akhir total pembayaran.

Skema product lengkap dan update yang dipakai frontend tersedia di `packages/contracts/src/index.ts`. `id` tidak dapat diubah setelah dibuat. PATCH bersifat parsial; tidak perlu mengirim `_id`, timestamps, atau metadata database. Email dinormalisasi lowercase. Password minimal 8 dan maksimal 128 karakter. UI saat ini meminta halaman pertama. Sepakati batas pagination dengan tim backend.

Kode umum: 400 validasi gagal, 401 sesi tidak valid, 403 akses ditolak, 404 data tidak ditemukan, 409 konflik, 429 terlalu banyak request, 500 gangguan server. Server perlu menyaring pesan internal sebelum mengirim error ke client.
