# Labuibu

Frontend toko camilan labu rumahan. `web/` untuk desktop dan mobile web; `mobile/` untuk app Android/iOS. Keduanya memakai React dan TypeScript. Backend dikerjakan terpisah oleh anggota tim dan tidak disertakan di branch ini.

## Struktur

```text
web/                  React + Vite + React Router
mobile/               React Native + Expo
packages/contracts/   Tipe data, skema Zod, katalog demo, aturan keranjang dan pesanan
packages/api-client/  Axios client dan adapter token
docs/                Panduan pengembangan dan integrasi API
.github/workflows/    Pemeriksaan otomatis
```

Web dan app memiliki komponen tampilan masing-masing. Kontrak data dan koneksi API dipakai bersama.

## Menjalankan lokal

Gunakan Node.js 24 (>=24.3) dan pnpm 11.25. Jalankan dari root repository:

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install
cp web/.env.example web/.env.local
cp mobile/.env.example mobile/.env
pnpm dev
```

Web tersedia di `http://localhost:5173`. Jalankan app di terminal lain:

```sh
pnpm dev:mobile
```

Scan QR dari Expo CLI memakai Expo Go yang kompatibel dengan SDK 58, atau gunakan development build. Untuk preview app di browser, jalankan `pnpm --filter @labuibu/mobile web`.

URL API pada file contoh sengaja kosong agar frontend bisa dicoba tanpa server. Mode demo memakai katalog bawaan, login simulasi, dan checkout tanpa transaksi sungguhan. Database dan server lokal tidak diperlukan untuk mode ini.

## Menghubungkan backend

Isi `VITE_API_URL` di `web/.env.local` dan `EXPO_PUBLIC_API_URL` di `mobile/.env` dengan URL API dari anggota tim, termasuk `/api`. Contoh server lokal: `http://localhost:4000/api`. Untuk ponsel fisik, gunakan IP LAN komputer server atau URL HTTPS publik. `localhost` pada ponsel menunjuk ke ponsel itu sendiri.

Isi `EXPO_PUBLIC_WEB_URL` dengan origin web untuk gambar dari API yang belum dibundel di app. Restart dev server setelah mengubah environment; untuk deployment, build ulang. Environment frontend dapat dibaca pengguna, jadi jangan menaruh secret database atau JWT di sana.

Format request, response, token, dan endpoint yang digunakan frontend ada di [docs/API.md](docs/API.md). Tim backend perlu mencocokkan implementasinya dengan kontrak tersebut, termasuk CORS untuk origin web. Implementasi dan pengujian server menjadi tanggung jawab tim backend.

## Fitur frontend

Beranda, katalog, detail dan pilihan varian, favorit, shopping cart, login/registrasi, akun, checkout dengan alamat pengiriman, konfirmasi, riwayat pesanan, dan halaman Dapur Labuibu. Halaman admin tetap tersedia untuk pengelolaan produk, pelanggan, dan status pesanan melalui API.

Katalog demo berisi 10 jenis produk. Pilihan rasa berada di halaman detail. Token web disimpan di sessionStorage; token app memakai SecureStore. Keranjang dan favorit memakai penyimpanan lokal setiap platform. Receipt demo tidak menyimpan alamat, telepon, password, atau token.

Transfer bank masih memakai rekening BCA dummy atas nama PT. Anti Rezim Dzolim, diatur pada `packages/contracts/src/payments.ts`. Tidak ada payment gateway atau integrasi kurir. Harga, bahan/alergen, ongkir, foto, dan rekening perlu disesuaikan sebelum dipakai untuk jualan. Google Analytics web bersifat opsional melalui `VITE_GA_ID`; app belum memakai SDK monitoring.

## Pemeriksaan

```sh
pnpm check
pnpm mobile:check
pnpm mobile:export
```

`pnpm check` menjalankan strict type-check, lint, pemeriksaan format, test kontrak/keranjang/pesanan, dan build web. CI juga mengekspor bundle Android/iOS. Export ini bukan APK dan tidak menggantikan pengujian pada ponsel. Gunakan `pnpm format` untuk merapikan source.

## Deployment dan kerja tim

Petunjuk web dan Expo ada di [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Backend dikelola dan di-deploy oleh anggota tim. Repository: [sheisnthere/group-7-project](https://github.com/sheisnthere/group-7-project).

Kerjakan perubahan di branch sesuai bagian masing-masing, push branch tersebut, lalu buat pull request untuk ditinjau tim. Jangan push langsung ke `main`. Dependency, `.env`, hasil build, dan APK tidak masuk Git. Gunakan satu `pnpm-lock.yaml` di root.

Panduan lain: [arsitektur](docs/ARCHITECTURE.md), [pemeliharaan](docs/MAINTENANCE.md), [katalog](docs/CATALOG.md), [sumber foto](docs/ASSETS.md), dan [verifikasi](docs/VERIFICATION.md).
