# Pemeliharaan source

## Batas tiap aplikasi

`web/` menangani desktop web dan mobile web melalui CSS responsif. `mobile/` adalah app Android/iOS Expo; preview browser merender komponen native yang sama. `backend/` menyediakan REST API Express + MongoDB. Jalankan perintah pnpm dari root agar workspace shared ikut tersedia.

Komponen tampilan tetap spesifik platform. Aturan harga, keranjang, atau pesanan berada di `packages/contracts/src/commerce.ts`, sedangkan validasi payload ada di `packages/contracts/src/index.ts` dan katalog/varian di `catalog.ts`.

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
| Endpoint & controller API | `backend/src/routes/`, `backend/src/controllers/` |
| Model MongoDB | `backend/src/models/` |
| Payload dan aturan bisnis | `packages/contracts/src/` |
| Axios bersama | `packages/api-client/src/` |

## Styling

Urutan stylesheet web dipertahankan: `styles.css` untuk layout dasar, `commerce.css` untuk ukuran ecommerce dan grid, `typography.css` untuk aturan tampilan akhir/responsif. `about.css` hanya dimuat bersama halaman Dapur.

## Pemeriksaan

`pnpm check` menjalankan typecheck, lint, format check, unit test kontrak/keranjang/receipt, dan build web. `pnpm mobile:export` memeriksa bundling Android/iOS.
