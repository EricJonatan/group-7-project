# Hasil verifikasi

Source lokal menggunakan Node.js 24 dan pnpm 11.25.

## Pemeriksaan otomatis

`pnpm check` memeriksa ESLint, Prettier format, test shared contracts/commerce, typecheck TypeScript pada semua workspace, dan production build web.

Test shared mencakup validasi seed dan payload, normalisasi email, pembatasan role, pemisahan varian, batas jumlah, perhitungan total, penghapusan item, favorit, aturan pengiriman, payload pesanan tanpa harga client, prioritas harga/ongkir server pada receipt, dan pembuangan data penerima/kredensial dari receipt.

Expo berhasil mengekspor bundle browser, Android, dan iOS.

## Hasil arsitektur

Source mengikuti folder repository: `web/` untuk desktop/mobile web, `mobile/` untuk app, `backend/` untuk REST API Express + MongoDB, dan `packages/` untuk kode bersama (`contracts` dan `api-client`).
