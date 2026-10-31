# Pemeliharaan source

## Batas tiap aplikasi

`web/` menangani desktop web dan mobile web melalui CSS responsif. `mobile/` adalah app Android/iOS Expo; preview browser merender komponen native yang sama. `backend/` menyediakan REST API. Jalankan perintah pnpm dari root agar workspace shared ikut tersedia.

Komponen tampilan tetap spesifik platform. Hindari menyalin aturan harga, keranjang, atau pesanan ke halaman: aturan tersebut berada di `packages/contracts/src/commerce.ts`, sedangkan validasi payload ada di `packages/contracts/src/index.ts` dan katalog/varian di `catalog.js`.

## Peta perubahan

| Perubahan | Lokasi |
| --- | --- |
| Halaman web | `web/src/pages/` |
| UI bersama web | `web/src/components/` |
| Navigasi web dan pemuatan halaman | `web/src/App.tsx` |
| State/sesi web | `web/src/store.tsx` |
| Halaman app | `mobile/src/screens/` |
| UI bersama app | `mobile/src/components/`, `mobile/src/ui.tsx` |
| Navigasi app | `mobile/src/App.tsx` |
| API dan token app | `mobile/src/api.ts`, `mobile/src/config.ts` |
| Penyimpanan app | `mobile/src/storage.ts` |
| Endpoint | `backend/src/routes/` |
| Autentikasi dan error API | `backend/src/auth.ts`, `backend/src/http.ts` |
| Payload dan aturan bisnis | `packages/contracts/src/` |
| Axios bersama | `packages/api-client/src/` |

Web memuat halaman selain Home saat dibutuhkan. Format rupiah/tanggal memakai formatter yang dibuat sekali. Pemulihan state app membaca data tersimpan dalam satu batch dan menangani JSON rusak per entri. Pencarian produk saat checkout API memakai peta berdasarkan ID.

## Styling

Urutan stylesheet web dipertahankan: `styles.css` untuk layout dasar, `commerce.css` untuk ukuran ecommerce dan grid, `typography.css` untuk aturan tampilan akhir/responsif. `about.css` hanya dimuat bersama halaman Dapur. Jangan menambah aturan untuk komponen yang telah dihapus (pencarian, tab kategori, badge thumbnail, atau footer lama). Style chip native tetap diperlukan untuk pilihan varian di detail produk.

## Pemeriksaan

`pnpm check` menjalankan type-check, lint, format, unit test kontrak/keranjang/receipt, integration test API dengan MongoDB sementara, serta production build web. `pnpm mobile:export` memeriksa bundling Android/iOS. `pnpm --filter @labuibu/mobile export:preview` menyiapkan preview browser pada `mobile/dist/preview/`.

Sebelum mengubah checkout, periksa pemisahan varian, batas jumlah, ongkir produk segar, payload tanpa harga client, harga server pada receipt, retry idempoten, dan pembersihan keranjang setelah sukses. Sebelum mengubah storage, pastikan receipt tidak memuat alamat, telepon, token, atau password. Uji perangkat fisik tetap diperlukan untuk safe area Android dan distribusi APK.

## Riwayat repository

Implementasi awal auth di commit `3d32949` digantikan oleh alur auth terintegrasi dengan validasi, MongoDB, hashing password, dan JWT. Commit awal tetap ada dalam riwayat Git. Modul placeholder yang sudah digantikan tidak dipertahankan sebagai implementasi kedua.

Konfigurasi TypeScript bersama ada di `tsconfig.base.json`. Masing-masing workspace menetapkan target lingkungan melalui `tsconfig.json`. Tambahkan tipe bersama di `packages/contracts/src/types.ts` jika dipakai lebih dari satu aplikasi.
