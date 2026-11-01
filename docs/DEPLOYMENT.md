# Deployment frontend

Backend dikelola anggota tim lain. Minta URL API HTTPS yang sesuai dengan `docs/API.md` dan pastikan origin web diizinkan oleh konfigurasi CORS server. Tidak ada server atau database yang di-deploy dari branch ini.

## Web di Vercel

Import repository, pilih Root Directory `web`, Framework Vite, dan Node.js 24. Izinkan akses source di luar Root Directory agar paket bersama dapat dibaca. `web/vercel.json` mengatur install workspace, build, output `dist`, dan rewrite React Router.

Isi `VITE_API_URL` dengan URL API termasuk `/api`. `VITE_GA_ID` opsional. Environment Vite dibaca saat build, sehingga perubahan nilainya memerlukan redeploy. Nilai URL API kosong mengaktifkan mode demo.

## Web di Netlify

Gunakan root repository sebagai base directory. `netlify.toml` mengatur build web dan publish `web/dist`. Isi environment yang sama dengan Vercel. Rewrite React Router tersedia di `web/public/_redirects`.

## App Expo

Isi `EXPO_PUBLIC_API_URL` dengan URL API HTTPS dan `EXPO_PUBLIC_WEB_URL` dengan origin web. Nilai ini masuk ke bundle, jadi jangan isi secret. Jalankan `pnpm mobile:check` dari root.

Untuk Expo Go lokal, jalankan `pnpm dev:mobile` lalu scan QR yang ditampilkan. Gunakan Expo Go yang kompatibel SDK 58 atau development build. QR lokal bergantung pada Metro dan jaringan aktif.

Untuk APK, jalankan dari `mobile/`:

```sh
pnpm dlx eas-cli login
pnpm dlx eas-cli build:configure
pnpm dlx eas-cli build --platform android --profile preview
```

EAS akan menghubungkan project ke akun pengguna. Periksa perubahan app config sebelum commit. Profil preview menghasilkan APK distribusi internal. Simpan link artifact dan QR dari EAS setelah build selesai. Konfigurasi saat ini belum mengaktifkan OTA karena project EAS belum dihubungkan.

## Setelah deployment

Periksa akses langsung ke `/produk/keripik-labu`, login/registrasi, varian dan jumlah di shopping cart, checkout dengan alamat, konfirmasi, serta riwayat pesanan. Cocokkan harga dan ongkir dari server. Uji app pada ponsel dan periksa gambar baru dari API.

Rekening transfer, harga, ongkir, dan materi katalog masih contoh. Belum ada payment gateway. Web cloud, distribusi Expo, dan APK belum dibuat pada pekerjaan ini; isi link setelah deployment berhasil.
