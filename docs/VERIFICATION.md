# Verifikasi frontend

Branch `TypeScript` sekarang hanya berisi web, app, dan dua paket bersama. Source backend, pengujian server, konfigurasi database, dan deployment server telah dikeluarkan. Alur frontend tetap dipertahankan. Ikon shopping bag pada header dan tombol tambah keranjang diganti menjadi troli sesuai permintaan.

## Pemeriksaan otomatis

Pada 31 Oktober 2026, `pnpm check` lulus: type-check empat workspace, lint, format, 13 test, dan build web. Export Android, iOS, serta preview browser app juga berhasil.

Jalankan `pnpm check` untuk strict type-check pada empat workspace, lint, format, 13 test kontrak/keranjang/receipt, dan production build web. Jalankan `pnpm mobile:export` untuk bundle Android/iOS. CI menjalankan pemeriksaan tersebut setiap push dan pull request.

Test bersama mencakup validasi katalog/payload, pemisahan varian, batas jumlah, total keranjang, favorit, aturan pengiriman, payload pesanan tanpa harga client, prioritas nilai server pada receipt, pembuangan data penerima dari receipt, dan pemulihan data tersimpan yang rusak.

## Batas pemeriksaan

Build dan test frontend tidak membuktikan backend sudah berjalan. Autentikasi, otorisasi, database, idempotensi, dan perhitungan harga server perlu diuji bersama implementasi milik tim backend setelah integrasi.

Pemeriksaan browser sebelumnya mencakup katalog desktop empat kolom dan mobile dua kolom, pilihan varian, shopping cart, login demo, alamat checkout, konfirmasi, serta riwayat pesanan. Selain penggantian ikon troli, pemisahan backend tidak mengubah source UI. Hosting cloud, APK, distribusi EAS, QR cloud, analytics, dan pengujian ponsel fisik belum diverifikasi.
