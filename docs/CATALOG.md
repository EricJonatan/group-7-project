# Katalog dan pilihan varian

Katalog menampilkan 10 jenis produk dalam 7 kategori. Rasa/topping dipilih di halaman detail, bukan menjadi kartu produk tersendiri. Tidak ada produk paket. Harga pada kartu adalah harga varian terendah, tanpa label “mulai”.

Tiap item checkout mengirim productId, variantId, dan quantity. Backend memvalidasi varian, mengambil harga dari database, serta menyimpan nama varian dalam snapshot pesanan. Varian berbeda dari satu produk disimpan sebagai baris terpisah di keranjang. Keranjang lama dengan ID rasa dimigrasikan ke jenis produk dan pilihan rasa yang sesuai; item paket lama dihapus dari keranjang.

Katalog demo berada di `packages/contracts/src/catalog.ts`. Untuk mode terhubung, data produk berasal dari API tim backend. Pengisian dan migrasi database dikerjakan oleh tim backend; branch ini tidak menyediakan perintah seed atau refresh database.

Produk kering (keripik, kukis, biji labu) dapat memakai layanan reguler. Produk segar dan dingin hanya dapat memilih pengiriman lokal hari yang sama; kebutuhan kemasan dan rantai dingin tetap harus dikonfirmasi penjual. Ketahanan 7 hari belum diuji dan tidak dijanjikan. Estimasi kalori tidak ditampilkan atas permintaan pemilik.

Tagline dan informasi sumber bahan diberikan oleh pemilik: berbahan utama labu asli premium, tanpa perasa buatan; dibeli langsung dari petani labu, disiapkan dengan tangan di dapur rumah. Foto dapur merupakan ilustrasi, bukan dokumentasi produksi atau petani mitra.

Referensi pengembangan jenis makanan: [Pumpkin Cookies - King Arthur Baking](https://www.kingarthurbaking.com/recipes/fudgy-chewy-pumpkin-cookies-recipe), [Pumpkin Pie - King Arthur Baking](https://www.kingarthurbaking.com/recipes/pumpkin-pie-recipe), [Resep berbahan lokal, termasuk klepon labu - Kemendagri](https://ppid.kemendagri.go.id/storage/dokumen/uzxgBMkiTast6shJYwouQXjKrg9wCuLNsv91XvNT.pdf), [Pumpkin Seed Recipes - Good Food](https://www.bbcgoodfood.com/recipes/collection/pumpkin-seed-recipes). Informasi pengiriman mengacu pada [FoodSafety.gov](https://www.foodsafety.gov/blog/holiday-tips-food-gifts); ini bukan hasil uji umur simpan Labuibu.
