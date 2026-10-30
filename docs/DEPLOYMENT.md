# Deployment dari Git

Konfigurasi sudah tersedia, tetapi belum dibuat deployment cloud. Gunakan akun Git, Vercel/Netlify, Render, MongoDB Atlas, serta Expo/EAS milikmu. Jangan menambahkan secret ke repository. Isi URL hasil deployment nyata pada bagian akhir setelah deployment berhasil.

## 1. Upload repository

Jadikan folder `labuibu` sebagai root repository, bukan seluruh folder mata kuliah. Push source, root lockfile, dan konfigurasi workspace. `node_modules`, `.env`, `.expo`, APK, dan `dist` diabaikan Git. Workflow GitHub Actions menjalankan test, build web, serta export Android/iOS setiap push/PR.

## 2. MongoDB Atlas dan Render API

Buat cluster Atlas dan pengguna database dengan akses hanya ke database Labuibu. Tambahkan akses jaringan untuk Render sesuai opsi jaringan akunmu. Jangan masukkan connection string dalam kode. Di Render, buat Blueprint dari `render.yaml` di root repository. Isi `MONGODB_URI`, `CORS_ORIGINS` (origin Vercel/Netlify tanpa trailing slash), dan `PUBLIC_WEB_URL`. `JWT_SECRET` dihasilkan Render. `TRUST_PROXY=1` untuk proxy Render.

Build command mengaktifkan pnpm 11.25 dan menginstal paket backend beserta workspace dependency-nya. Start command `pnpm --filter @labuibu/api start`. Health check `/health`. Jika plan free dalam blueprint tidak tersedia untuk akunmu, pilih plan yang tersedia di dashboard; biaya tunduk pada provider. Free service dapat mengalami cold start.

Seed dapat dijalankan dari terminal lokal yang sementara diarahkan ke URI Atlas, dengan environment aman dan kredensial admin pilihanmu. Jalankan `pnpm seed`, lalu keluarkan kredensial seed dari environment. Seed hanya menambahkan produk yang belum ada, tidak mengubah produk/admin yang sudah dibuat. Pastikan seed dijalankan pada database yang benar.

Periksa `https://YOUR_RENDER_HOST/health` dan `/api/products`. Simpan URL API lengkap dengan `/api` untuk web/mobile.

## 3. Vercel web (pilihan utama)

Import repository yang sama. Pilih **Root Directory: web**, Framework Vite, dan aktifkan akses source di luar Root Directory bila diperlukan. `web/vercel.json` mengatur install dari root workspace, build paket web, output `dist`, serta rewrite React Router. Gunakan Node 24. Environment `VITE_API_URL=https://YOUR_RENDER_HOST/api`; opsional `VITE_GA_ID=G-...`. Deploy, kemudian tambahkan origin hasil deployment ke `CORS_ORIGINS` Render. Jangan menambahkan `/api` ke nilai origin CORS.

VITE_* dibaca saat build; perubahan environment memerlukan rebuild/redeploy. Jangan meninggalkan `VITE_API_URL` kosong pada deployment full-stack karena nilai kosong mengaktifkan frontend demo. Coba buka langsung `/produk/keripik-original` untuk memastikan rewrite SPA bekerja.

## Alternatif Netlify

Import repository dengan base directory root; `netlify.toml` mengatur command `pnpm --filter @labuibu/web build` dan publish `web/dist`. Set `VITE_API_URL` dan opsional `VITE_GA_ID`, lalu redeploy. Origin Netlify juga harus diizinkan di Render. `web/public/_redirects` disalin ke hasil build untuk React Router.

## 4. Expo dan Android APK

Di `mobile`, isi `.env` atau EAS environment `EXPO_PUBLIC_API_URL` dengan URL Render HTTPS dan `EXPO_PUBLIC_WEB_URL` dengan origin web HTTPS. Nilai EXPO_PUBLIC_* masuk ke bundle, jadi jangan pernah isi secret. Periksa `pnpm mobile:check` dari root.

Untuk demo Expo Go lokal: `pnpm dev:mobile`, lalu scan QR Expo CLI. Pastikan Expo Go kompatibel SDK 58. QR ini hanya aktif selama Metro dan jaringan tersedia. Untuk membagikan di luar jaringan, Expo CLI mendukung mode tunnel, namun memerlukan konektivitas dan paket tunnel tambahan.

Untuk APK: dari `mobile`, jalankan `pnpm dlx eas-cli login`, `pnpm dlx eas-cli build:configure`, dan `pnpm dlx eas-cli build --platform android --profile preview`. EAS akan membuat/link project milik akunmu dan dapat menambahkan projectId ke app config. Periksa perubahan config sebelum commit. Profil preview menghasilkan APK distribusi internal, sedangkan production mengikuti format store. Signing/build memakai akun EAS; langkah autentikasi tidak dikerjakan otomatis oleh repository ini.

Simpan URL artifact APK dan QR distribusi internal yang ditampilkan EAS. Untuk pembaruan OTA permanen, lakukan `eas update:configure` setelah project di-link, aktifkan updates dengan URL project aktual, lalu ikuti konfigurasi channel/runtime EAS. Konfigurasi saat ini menonaktifkan OTA sampai project EAS asli dibuat; tidak ada project ID atau QR cloud fiktif.

## 5. Verifikasi setelah deploy

Registrasi customer, login, buka detail produk, ubah jumlah keranjang, submit order, dan periksa riwayat. Login admin, tambah/edit/nonaktifkan produk uji, dan ubah status pesanan. Pastikan total server benar, produk nonaktif tidak bisa dipesan, dan customer tidak dapat membuka admin. Uji lewat ponsel menggunakan API cloud. Uji validasi alamat/quantity dan kegagalan jaringan. Masukkan GA ID sendiri bila monitoring dibutuhkan; verify event melalui akun Analytics milikmu.

Pembayaran saat ini dikonfirmasi manual oleh penjual. Jangan menganggap order selesai sebagai pembayaran berhasil. Ganti harga, bahan/alergen, foto ilustrasi, tarif, cakupan pengiriman, dan profil usaha sebelum menerima pesanan nyata.

## Catatan hasil deployment

Web: belum di-deploy. Backend: belum di-deploy. Expo distribution/QR: belum dibuat. APK: belum dibangun. Isi link hasil provider setelah deployment/build berhasil. Tidak ada kegagalan deployment yang disembunyikan sebagai keberhasilan.

Referensi resmi: [Expo EAS Build](https://docs.expo.dev/build/introduction/), [Expo monorepos](https://docs.expo.dev/guides/monorepos/), [Render Blueprint](https://render.com/docs/infrastructure-as-code), [Vercel monorepos](https://vercel.com/docs/monorepos).
