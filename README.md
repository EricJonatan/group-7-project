# Labuibu

Toko camilan labu rumahan: web React, app React Native/Expo, REST API Express, dan MongoDB. Semua source aplikasi dan paket bersama menggunakan TypeScript. UI mengambil arah visual Ruang Kreasi Kayu (krem hangat, merah bata, judul serif, tata letak editorial), dengan identitas dan konten Labuibu. Thumbnail memakai foto makanan nyata; banner aneka produk merupakan ilustrasi AI. Keduanya bukan foto produksi Labuibu.

## Struktur

```text
web/               Desktop web + mobile web, React + Vite + React Router
  src/pages/       Halaman pelanggan, checkout, akun, dan pesanan
  src/components/  Komponen UI web yang dipakai ulang
mobile/            App Android/iOS, React Native + Expo
  src/screens/     Halaman native
  src/components/  Komponen UI native yang dipakai ulang
backend/           REST API Express + Mongoose + JWT
  src/routes/      Route auth, produk, pengguna, dan pesanan
packages/
  contracts/       Skema Zod, aturan keranjang/pesanan/ongkir, katalog seed, format rupiah
  api-client/      Axios client bersama, token lewat adapter setiap platform
docs/              Arsitektur, API, deployment, dokumentasi project
.github/workflows/ CI: pengujian, build web, bundle Android/iOS
```

UI web dan native sengaja terpisah. Kontrak data dan koneksi API dibagikan, tanpa memaksa elemen HTML ke React Native. Setiap aplikasi dapat di-deploy sendiri dari satu repository. Tidak ada backend atau berkas Ruang Kreasi Kayu yang diubah.

## Persyaratan

Node.js 24 (>=24.3), pnpm 11.25, MongoDB 7+ lokal atau MongoDB Atlas. Docker bersifat opsional untuk MongoDB lokal. Expo Go yang mendukung SDK 58 diperlukan untuk mencoba aplikasi di ponsel; gunakan development build jika Expo Go di perangkatmu berbeda versi.

## Mulai lokal

Jalankan seluruh perintah dari folder `labuibu`, kecuali disebutkan lain.

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local
cp mobile/.env.example mobile/.env
```

Isi `backend/.env`: `MONGODB_URI`, `JWT_SECRET` acak minimal 32 karakter, `CORS_ORIGINS`, serta kredensial admin seed pilihanmu. Contoh secret di `.env.example` sengaja ditolak server. Buat secret dengan `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Jangan commit `.env`.

Jika memakai Docker, jalankan `docker compose up -d mongo`. Alternatifnya, gunakan URI Atlas. `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` hanya diperlukan untuk membuat admin pertama; hapus dari environment setelah seed.

Isi `web/.env.local` dengan `VITE_API_URL=http://localhost:4000/api`. Nilai kosong menyediakan demo frontend saja, dengan penanda yang jelas dan tanpa transaksi sungguhan.

```sh
pnpm seed
pnpm dev
```

Web tersedia di `http://localhost:5173`, backend di `http://localhost:4000`, health check di `/health`. Login menggunakan admin yang dibuat melalui seed untuk membuka `/admin`. Registrasi publik selalu membuat customer, tidak bisa meminta role admin.

## Mobile

Tampilan app mengikuti mobile web: banner penuh di atas beranda, katalog dua kolom, varian di detail, tombol keranjang sesuai lebar isi, form login/daftar terpusat, footer vertikal, dan alamat pengiriman wajib. Tab Home, Produk kami, dan Akun dipisah. Keranjang berada di kanan atas, sedangkan Dapur Labuibu tersedia melalui menu Akun, termasuk sebelum login.

Tanpa `EXPO_PUBLIC_API_URL`, app memakai katalog bawaan serta login/checkout demo yang diberi label. Data penerima tidak dikirim, kata sandi demo tidak disimpan, dan tidak ada transaksi sungguhan. Isi URL API untuk memakai backend. Foto katalog disertakan dalam app; `EXPO_PUBLIC_WEB_URL` menjadi base URL untuk gambar baru dari API yang belum dibundel. Font DM Sans dan Playfair Display juga dibundel agar tipografi konsisten saat offline. Pratinjau React Native di browser tersedia lewat `pnpm --filter @labuibu/mobile web`; ini alat pemeriksaan UI, bukan pengganti pengujian di perangkat.

Isi `EXPO_PUBLIC_API_URL` dan `EXPO_PUBLIC_WEB_URL` dalam `mobile/.env`. Ponsel fisik harus memakai IP LAN komputer, misalnya `http://192.168.1.10:4000/api` dan `http://192.168.1.10:5173`, bukan `localhost`. API mendengarkan jaringan lokal secara default; izinkan port melalui firewall bila diperlukan. Web Vite memakai `--host 0.0.0.0`. Ponsel dan komputer harus berada pada jaringan yang sama. Android Emulator dapat memakai `10.0.2.2`; iOS Simulator dapat memakai `localhost`.

```sh
pnpm dev:mobile
```

Scan QR yang dicetak Expo CLI dengan Expo Go. QR lokal bergantung pada komputer dan jaringan aktif; bukan link deployment permanen. Token mobile disimpan melalui Expo SecureStore. Keranjang dan favorit disimpan di AsyncStorage. Riwayat pesanan berasal dari API.

## Perintah lain

```sh
pnpm dev:web
pnpm dev:api
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm mobile:check
pnpm mobile:export
```

Integration test memakai MongoDB sementara dari `mongodb-memory-server`, tidak menyentuh database aplikasi. Run pertama mengunduh binary MongoDB. Export mobile menghasilkan JavaScript/Hermes bundle untuk Android dan iOS; ini **bukan APK**. APK dibangun melalui profil EAS `preview`; petunjuk di `docs/DEPLOYMENT.md`.

## Fitur

Beranda, katalog sederhana tanpa pencarian/tab kategori, detail bahan dan alergen, favorit lokal web/app, keranjang persisten, registrasi/login JWT, checkout terproteksi, ongkir, pencatatan pesanan, riwayat pesanan, dashboard admin untuk tambah/edit/nonaktifkan produk, daftar pelanggan, dan pembaruan status pesanan. Backend mendukung CRUD profil pengguna, validasi input, pembatasan request, CORS, password hash, dan otorisasi role.

Harga dan total pesanan dihitung backend dari database. Checkout memiliki idempotency key agar retry tidak membuat pesanan ganda. Status pesanan mengikuti transisi terbatas. Penghapusan produk bersifat nonaktif sehingga histori pesanan tetap tersimpan. Logout membatalkan seluruh token akun yang sudah diterbitkan.

Pembayaran masih berupa pencatatan pilihan transfer/COD dan konfirmasi manual oleh penjual; tidak terhubung payment gateway, tidak memotong uang, dan tidak membuat label kurir. Tarif pengiriman tetap, belum memakai API kurir. Favorit web tersimpan per browser, belum disinkronkan antar perangkat. API menggunakan pagination default 30, maksimum 100; katalog berisi 10 jenis produk dengan 23 pilihan varian di halaman detail.

Google Analytics 4 bersifat opsional untuk web melalui `VITE_GA_ID`. Event: page view, add to cart, begin checkout, dan purchase. Data penerima tidak dikirim ke analytics. Tidak ada tracking bila ID kosong. Pasang kebijakan privasi/consent sesuai kebutuhan sebelum peluncuran publik. Mobile belum dilengkapi SDK monitoring tersendiri.

## Deployment

Repository: [sheisnthere/group-7-project](https://github.com/sheisnthere/group-7-project). Konfigurasi Vercel/Netlify, Render, dan EAS tersedia; layanan cloud dan APK belum dibuat. Petunjuk ada di [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Alur Git

Buat branch sesuai bagian pekerjaan, misalnya `Frontend/nama-fitur`, `Backend/nama-fitur`, atau `Mobile/nama-fitur`. Push ke branch tersebut dan ajukan pull request ke `main` untuk ditinjau tim.

```sh
git switch main
git pull --ff-only
git switch -c Frontend/nama-fitur
# Kerjakan perubahan, lalu jalankan pnpm check.
git add .
git commit -m "Describe the change"
git push -u origin Frontend/nama-fitur
```

`.env`, dependency, dan hasil build tidak masuk Git. Gunakan satu `pnpm-lock.yaml` di root. Nama paket Android/iOS masih `com.labuibu.app`; sesuaikan sebelum publikasi ke store.

Foto dan sumbernya tercantum di `docs/ASSETS.md`. Materi katalog, harga, deskripsi bahan, dan estimasi pengiriman adalah contoh yang perlu disesuaikan pemilik usaha sebelum dipakai untuk jualan.

Pembaruan katalog, migrasi data contoh, dan aturan pengiriman: `docs/CATALOG.md`. Halaman Dapur Labuibu tersedia di `/dapur-labuibu`.

## Rekening transfer contoh

Konfirmasi transfer bank menampilkan rekening BCA dummy atas nama PT. Anti Rezim Dzolim. Konfigurasi tunggal tersedia di `packages/contracts/src/payments.ts` untuk web dan app. Nomor rekening ini hanya untuk simulasi dan harus diganti sebelum menerima pembayaran sungguhan. Tombol konfirmasi membuka Pesanan saya; pesanan demo terakhir ditampilkan tanpa menyimpan alamat atau nomor telepon dalam bukti pesanan.

Menu akun mobile berurutan Pesanan saya, Cemilan favorit, dan Dapur Labuibu; setiap menu membuka halaman tersendiri. Web memakai `/pesanan-saya` dan `/favorit`. Desktop menampilkan pesanan serta favorit di akun, sementara Dapur Labuibu tetap di navigasi atas. Setiap kartu pesanan memakai satu thumbnail produk pertama, dengan ringkasan varian/jumlah, tanggal, status, dan total.

## Menjaga kualitas kode

Jalankan `pnpm check` sebelum commit: type-check, lint, pemeriksaan format, test shared/API, lalu build web. `pnpm format` merapikan source. CI GitHub menjalankan pemeriksaan yang sama dan mengekspor bundle mobile. Source aplikasi berada di `web/`, `mobile/`, dan `backend/`; build hasil generate dan `.env` tidak masuk Git.

Aturan keranjang, pemisahan varian, favorit, payload item, snapshot receipt, format tanggal, serta transisi status ada di `packages/contracts/src/commerce.ts`. Web dan app memakai UI masing-masing dengan aturan bisnis yang sama. Receipt tersimpan hanya berisi informasi konfirmasi; data penerima dan kredensial tidak disimpan di receipt. Detail struktur ada di [panduan pemeliharaan](docs/MAINTENANCE.md).

## TypeScript

Setiap workspace memiliki `tsconfig.json` yang mengacu pada `tsconfig.base.json`. Mode `strict` aktif. Tipe produk, keranjang, pengguna, dan pesanan berada di `packages/contracts/src/types.ts`; sebagian besar diturunkan dari skema Zod. Parameter navigasi app didefinisikan di `mobile/src/navigation.ts`.

Jalankan `pnpm typecheck` untuk memeriksa semua workspace. TypeScript tidak menggantikan validasi Zod saat request atau data tersimpan dibaca. Backend dan test menjalankan file `.ts` langsung dengan type stripping bawaan Node.js 24; pemeriksaan tipe dilakukan terpisah. Gunakan sintaks TypeScript yang dapat dihapus, tanpa enum atau parameter properties. Web ditranspilasi Vite, sedangkan app ditranspilasi Metro.
