# Panduan Deployment Cloud

Berikut adalah panduan deployment untuk seluruh ekosistem Labuibu (Web, Backend API, Database MongoDB, dan Mobile Expo).

## 1. MongoDB Atlas & Backend API (Render / Vercel)

1. Buat cluster MongoDB Atlas (M0 Free Tier) dan user database.
2. Atur IP Access List ke `0.0.0.0/0` (Allow Access from Anywhere).
3. Salin connection string `mongodb+srv://...`.
4. Di Render, buat Web Service baru dari repositori ini:
   - Branch: `main`
   - Build Command: `corepack enable && pnpm install`
   - Start Command: `pnpm --filter @labuibu/api start`
   - Health check: `/health`
   - Environment: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS=*`.
5. Jalankan seed awal katalog:
   ```bash
   pnpm seed
   ```
6. Simpan URL API live yang diberikan (misal: `https://YOUR_API_HOST/api`).

## 2. Frontend Web (Vercel)

1. Import repositori di Vercel.
2. Pengaturan project:
   - **Root Directory**: `web`
   - **Framework Preset**: `Vite`
   - Aktifkan opsi "Include files outside Root Directory" (untuk monorepo packages).
3. Environment variables:
   - `VITE_API_URL`: URL Backend API lengkap dengan `/api`.
   - `VITE_GA_ID`: Measurement ID Google Analytics (`G-XXXXXXXXXX`).
4. Klik Deploy. Rewrite SPA sudah diatur otomatis oleh `web/vercel.json`.

## 3. Mobile App (Expo & EAS Build APK)

1. Isi file `mobile/.env` dengan URL API produksi:
   ```env
   EXPO_PUBLIC_API_URL=https://YOUR_API_HOST/api
   EXPO_PUBLIC_WEB_URL=https://YOUR_WEB_HOST
   ```
2. Untuk demo lokal: `pnpm dev:mobile` lalu scan QR Code via Expo Go.
3. Untuk build file installer `.apk` mandiri (Android):
   ```bash
   cd mobile
   pnpm dlx eas-cli login
   pnpm dlx eas-cli build:configure
   pnpm dlx eas-cli build --platform android --profile preview
   ```
   Setelah selesai, EAS Cloud menyediakan link download file `.apk` dan QR Code unduhan.
