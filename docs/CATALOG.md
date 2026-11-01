# Katalog dan pilihan varian

Katalog menampilkan 10 jenis produk dalam 7 kategori. Rasa/topping dipilih di halaman detail, bukan menjadi kartu produk tersendiri. Tidak ada produk paket. Harga pada kartu adalah harga varian terendah.

Tiap item checkout mengirim productId, variantId, dan quantity. Backend memvalidasi varian, mengambil harga dari database, serta menyimpan nama varian dalam snapshot pesanan. Varian berbeda dari satu produk disimpan sebagai baris terpisah di keranjang. Keranjang lama dengan ID rasa dimigrasikan ke jenis produk dan pilihan rasa yang sesuai; item paket lama dihapus dari keranjang.

Gunakan `pnpm seed` untuk database baru. Untuk database demo yang sudah berisi katalog lama, gunakan `pnpm catalog:refresh` setelah environment API dikonfigurasi. Perintah refresh mengganti katalog contoh yang dikenal, memperbarui nama/harga/bahan/varian, dan menonaktifkan kartu rasa serta paket lama. Produk kustom dengan ID lain tidak dihapus. Riwayat pesanan mempertahankan snapshot historis.

Produk kering (keripik, kukis, biji labu) dapat memakai layanan reguler. Produk segar dan dingin hanya dapat memilih pengiriman lokal hari yang sama; kebutuhan kemasan dan rantai dingin tetap harus dikonfirmasi penjual. Ketahanan 7 hari belum diuji dan tidak dijanjikan. Estimasi kalori tidak ditampilkan atas permintaan pemilik.

Tagline dan informasi sumber bahan: berbahan utama labu asli premium, tanpa perasa buatan; disiapkan dengan tangan di dapur rumah.

Referensi pengembangan jenis makanan: [Pumpkin Cookies - King Arthur Baking](https://www.kingarthurbaking.com/recipes/fudgy-chewy-pumpkin-cookies-recipe), [Pumpkin Pie - King Arthur Baking](https://www.kingarthurbaking.com/recipes/pumpkin-pie-recipe), [Resep berbahan lokal, termasuk klepon labu - Kemendagri](https://ppid.kemendagri.go.id/storage/dokumen/uzxgBMkiTast6shJYwouQXjKrg9wCuLNsv91XvNT.pdf), [Pumpkin Seed Recipes - Good Food](https://www.bbcgoodfood.com/recipes/collection/pumpkin-seed-recipes).
