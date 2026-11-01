# Labuibu

Toko camilan labu rumahan: web React, mobile Expo, REST API Express, dan MongoDB.

## Struktur

```text
web/               Desktop web + mobile web, React + Vite + React Router
mobile/            App Android/iOS, React Native + Expo
backend/           REST API Express + Mongoose + JWT
packages/
  contracts/       Skema Zod, aturan keranjang/pesanan/ongkir, katalog seed, format rupiah
  api-client/      Axios client bersama, token lewat adapter setiap platform
docs/              Arsitektur, API, deployment, dokumentasi project
.github/workflows/ CI: pengujian, build web, bundle Android/iOS
```

UI web dan native terpisah. Kontrak data dan koneksi API dibagikan melalui workspace packages.

## Menjalankan lokal

Gunakan Node.js 24 dan pnpm 11.25. Jalankan dari root repository:

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local
cp mobile/.env.example mobile/.env
```

Isi `backend/.env` dengan `MONGODB_URI` (Atlas/lokal) dan `JWT_SECRET`.

```sh
pnpm seed
pnpm dev
```

Web tersedia di `http://localhost:5173`, backend API di `http://localhost:4000/api`, health check di `http://localhost:4000/health`.

Jalankan app mobile di terminal lain:

```sh
pnpm dev:mobile
```

Scan QR yang ditampilkan Expo CLI dengan aplikasi Expo Go di ponsel.

## Perintah Pemeriksaan

```sh
pnpm check
pnpm mobile:check
pnpm mobile:export
```

`pnpm check` menjalankan type-check, ESLint, pemeriksaan format Prettier, test kontrak dan API, serta build web.

## Deployment

Petunjuk lengkap deployment cloud ada di [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md):
- **Frontend Web**: Deploy ke Vercel atau Netlify (`web/`).
- **Backend API**: Deploy ke Render (`backend/`).
- **Mobile App**: Deploy / publikasi via Expo EAS build APK (`mobile/`).
- **Database**: MongoDB Atlas.
- **Monitoring**: Google Analytics 4 (`VITE_GA_ID`).

Panduan lain:
- [Arsitektur sistem](docs/ARCHITECTURE.md)
- [Spesifikasi API](docs/API.md)
- [Katalog produk](docs/CATALOG.md)
- [Pemeliharaan kode](docs/MAINTENANCE.md)
- [Verifikasi](docs/VERIFICATION.md)
