# Pemeliharaan frontend

`web/` berisi desktop dan mobile web. `mobile/` berisi app Expo. Jalankan pnpm dari root agar paket bersama ikut tersedia. Backend dikerjakan terpisah; perubahan API perlu disepakati dengan anggota tim yang mengelolanya.

## Lokasi perubahan

| Bagian | Lokasi |
| --- | --- |
| Halaman web | `web/src/pages/` |
| Komponen web | `web/src/components/` |
| Navigasi dan state web | `web/src/App.tsx`, `web/src/store.tsx` |
| Halaman app | `mobile/src/screens/` |
| Komponen app | `mobile/src/components/`, `mobile/src/ui.tsx` |
| Navigasi dan state app | `mobile/src/App.tsx`, `mobile/src/store.tsx` |
| API dan konfigurasi app | `mobile/src/api.ts`, `mobile/src/config.ts` |
| Penyimpanan app | `mobile/src/storage.ts` |
| Kontrak dan aturan bersama | `packages/contracts/src/` |
| Axios bersama | `packages/api-client/src/` |

Aturan keranjang, varian, ongkir, dan receipt berada di `commerce.ts`. Validasi payload ada di `index.ts`, tipe domain di `types.ts`, dan katalog demo di `catalog.ts`. Hindari menyalin aturan ini ke setiap halaman.

## Styling

Stylesheet web memakai urutan `styles.css`, `commerce.css`, lalu `typography.css`. `about.css` dimuat bersama halaman Dapur. Pilihan varian app menggunakan style chip; kartu katalog hanya menampilkan foto, nama, harga, dan kontrol favorit.

## Pemeriksaan

Jalankan `pnpm check` sebelum commit dan `pnpm mobile:export` setelah mengubah app atau paket bersama. Preview browser dapat dibuat dengan `pnpm --filter @labuibu/mobile export:preview`.

Untuk checkout, periksa pilihan varian, batas jumlah, ongkir produk segar, payload tanpa harga client, harga server pada receipt, retry dengan idempotency key, dan pembersihan keranjang setelah sukses. Receipt tersimpan tidak boleh memuat data penerima atau kredensial. Safe area Android dan distribusi APK perlu diperiksa pada perangkat.

Mode demo dapat berjalan tanpa backend. Pengujian login, checkout, dan riwayat terhadap server nyata dilakukan bersama tim backend setelah URL API tersedia.

## TypeScript dan Git

Setiap workspace memiliki `tsconfig.json` dengan konfigurasi dasar di root. Gunakan tipe bersama jika dipakai web dan app. Kerjakan perubahan di branch, push ke branch tersebut, lalu ajukan pull request; jangan push langsung ke `main`.
