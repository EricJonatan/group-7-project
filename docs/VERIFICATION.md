# Hasil verifikasi

Tanggal: 31 Oktober 2026. Source lokal menggunakan Node.js 24 dan pnpm 11.25. Database pengujian berupa MongoDB sementara; tidak ada database produksi yang diakses.

## Pemeriksaan otomatis

`pnpm check` berhasil: ESLint tanpa error, semua source yang diperiksa sesuai format Prettier, 11 test shared contracts/commerce lulus, 9 integration test API lulus, dan production build web berhasil.

Test shared mencakup validasi seed dan payload, normalisasi email, pembatasan role, pemisahan varian, batas jumlah, perhitungan total, penghapusan item, favorit, aturan pengiriman, payload pesanan tanpa harga client, prioritas harga/ongkir server pada receipt, pembuangan data penerima/kredensial dari receipt, migrasi keranjang lama, JSON keranjang yang tidak valid, dan tanggal receipt yang rusak.

Test API mencakup health/catalog, login salah, email duplikat, role injection, izin admin/customer, CRUD produk dan soft deletion, harga server, retry idempoten dan konflik payload, isolasi order pengguna, transisi status, input harga/quantity, varian, pembatasan pengiriman produk segar, penyembunyian kredensial, profil, pencabutan token saat logout, serta CORS.

Expo berhasil mengekspor bundle browser, Android, dan iOS setelah pemisahan screen/component. Audit referensi style native tidak menemukan key style yang hilang. Ini verifikasi bundling dan source, bukan pengujian ponsel fisik atau APK.

## Pemeriksaan melalui browser

Desktop web diperiksa pada lebar 1280 px: katalog 10 produk, empat kolom, kartu foto/nama/harga tanpa badge/kategori/pencarian/tab, pemilihan varian Keju, jumlah 2, keranjang Rp52.000, login demo, alamat wajib, konfirmasi Rp67.000 termasuk ongkir Rp15.000, instruksi BCA dummy, dan navigasi ke Pesanan saya. Riwayat desktop tetap dua kolom dengan satu thumbnail per kartu dan tanggal di kanan atas.

Mobile web diperiksa pada lebar 390 px: tidak ada overflow horizontal, katalog dua kolom, headline pertanyaan satu baris, dan footer vertikal.

Preview app memakai komponen React Native yang sama. Alur katalog, detail Keju, keranjang, login demo, pengisian alamat, submit, konfirmasi Rp41.000 (produk Rp26.000 + ongkir Rp15.000), BCA dummy, dan Pesanan saya berhasil dijalankan.

## Hasil refactor

Source mengikuti folder repository: `web/` untuk desktop/mobile web, `mobile/` untuk app, `backend/` untuk API, dan `packages/` untuk kode bersama. Halaman/komponen dan route API dipisahkan. Aturan keranjang/receipt/status serta formatter dibagikan. Sebanyak 93 rule CSS komponen lama atau identik dibuang dengan mempertahankan urutan cascade. Tujuh gambar web lama yang tidak dipakai dihapus.

Pada build lokal ini, CSS utama turun dari sekitar 56,6 kB menjadi 47,3 kB (belum gzip). JavaScript entry turun dari sekitar 435,7 kB menjadi 400,6 kB setelah halaman selain Home dipisah menjadi chunk yang dimuat saat diperlukan. Ukuran bundle bukan hasil pengukuran waktu muat jaringan/perangkat.

## Batas verifikasi

Hosting cloud, URL produksi, distribusi EAS, APK, QR cloud, analytics akun pengguna, dan perangkat fisik belum diverifikasi pada pekerjaan refactor ini. Pembayaran masih simulasi/manual dan ongkir berupa tarif contoh. Dokumentasi PDF lama tidak diperbarui atau disertakan dalam unggahan kode bersih. Konfigurasi CI disiapkan; hasil GitHub Actions harus diperiksa setelah repository menerima commit.
