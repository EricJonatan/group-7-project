export const products = [
  {
    id: 'keripik-labu',
    name: 'Keripik Labu',
    category: 'Keripik',
    price: 22000,
    unit: '100 gram',
    badge: '4 pilihan rasa',
    image: '/images/chips-table.jpg',
    description:
      'Keripik labu kuning beririsan tipis dan renyah. Pilih bumbu original, balado, keju, atau rumput laut di bawah.',
    ingredients: 'Labu kuning, tepung beras, minyak nabati, garam.',
    storage:
      'Simpan tertutup di tempat sejuk dan kering. Ikuti tanggal kedaluwarsa pada kemasan. Ketahanan 7 hari belum diuji.',
    shippingClass: 'dry',
    shippingNote:
      'Gunakan kemasan tertutup dan pelindung agar produk tidak mudah remuk. Estimasi kurir bukan jaminan umur simpan.',
    variants: [
      {
        id: 'keripik-original',
        name: 'Original',
        price: 22000,
        ingredients: 'Labu kuning, tepung beras, minyak nabati, garam.',
      },
      {
        id: 'keripik-balado',
        name: 'Balado',
        price: 24000,
        ingredients: 'Labu kuning, tepung beras, minyak nabati, cabai, gula, garam.',
      },
      {
        id: 'keripik-keju',
        name: 'Keju',
        price: 26000,
        ingredients:
          'Labu kuning, tepung beras, minyak nabati, bubuk keju, garam. Mengandung susu.',
      },
      {
        id: 'keripik-rumput-laut',
        name: 'Rumput Laut',
        price: 25000,
        ingredients: 'Labu kuning, tepung beras, minyak nabati, rumput laut, garam.',
      },
    ],
  },
  {
    id: 'donat-labu',
    name: 'Donat Labu',
    category: 'Donat',
    price: 30000,
    unit: 'box isi 6',
    badge: '4 pilihan topping',
    image: '/images/donuts.jpg',
    description:
      'Donat labu empuk dalam box isi enam. Pilih topping gula, kayu manis, cokelat, atau kacang sesuai seleramu.',
    ingredients:
      'Labu kuning, tepung terigu, telur, susu, mentega, ragi, gula. Mengandung gluten, telur, dan susu.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'fresh',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Kemasan dan suhu penanganan harus disesuaikan dengan produk; konfirmasi layanan ke penjual.',
    variants: [
      {
        id: 'donat-gula',
        name: 'Gula Halus',
        price: 30000,
        ingredients:
          'Labu kuning, tepung terigu, telur, susu, mentega, ragi, gula. Mengandung gluten, telur, dan susu.',
      },
      {
        id: 'donat-kayu-manis',
        name: 'Kayu Manis',
        price: 34000,
        ingredients:
          'Labu kuning, tepung terigu, telur, susu, mentega, ragi, gula, kayu manis. Mengandung gluten, telur, dan susu.',
      },
      {
        id: 'donat-cokelat',
        name: 'Cokelat',
        price: 36000,
        ingredients:
          'Labu kuning, tepung terigu, telur, susu, mentega, ragi, gula, cokelat susu. Mengandung gluten, telur, susu, dan kedelai.',
      },
      {
        id: 'donat-kacang',
        name: 'Cokelat Kacang',
        price: 38000,
        ingredients:
          'Labu kuning, tepung terigu, telur, susu, mentega, ragi, gula, cokelat, kacang tanah. Mengandung gluten, telur, susu, kedelai, dan kacang tanah.',
      },
    ],
  },
  {
    id: 'kukis-labu',
    name: 'Kukis Labu',
    category: 'Kukis',
    price: 28000,
    unit: '150 gram',
    badge: '2 pilihan rasa',
    image: '/images/cookies.jpg',
    description:
      'Kukis berbahan labu kuning untuk teman teh atau kopi. Pilih rasa kayu manis atau choco chips.',
    ingredients:
      'Labu kuning, tepung terigu, mentega, telur, gula. Mengandung gluten, susu, dan telur.',
    storage:
      'Simpan tertutup di tempat sejuk dan kering. Ikuti tanggal kedaluwarsa pada kemasan. Ketahanan 7 hari belum diuji.',
    shippingClass: 'dry',
    shippingNote:
      'Gunakan kemasan tertutup dan pelindung agar produk tidak mudah remuk. Estimasi kurir bukan jaminan umur simpan.',
    variants: [
      {
        id: 'kukis-kayu-manis',
        name: 'Kayu Manis',
        price: 28000,
        ingredients:
          'Labu kuning, tepung terigu, mentega, telur, gula, kayu manis. Mengandung gluten, susu, dan telur.',
      },
      {
        id: 'kukis-choco-chips',
        name: 'Choco Chips',
        price: 32000,
        ingredients:
          'Labu kuning, tepung terigu, mentega, telur, gula, cokelat. Mengandung gluten, susu, telur, dan kedelai.',
      },
    ],
  },
  {
    id: 'puding-labu',
    name: 'Puding Labu',
    category: 'Puding',
    price: 18000,
    unit: '1 cup · ±150 gram',
    badge: 'Sajikan dingin',
    image: '/images/pudding-cup.jpg',
    description:
      'Puding labu lembut yang disajikan dingin. Pilih rasa original atau lapisan cokelat.',
    ingredients: 'Labu kuning, susu, gula, agar-agar. Mengandung susu.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'chilled',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Produk perlu dipertahankan dingin dengan kemasan berpendingin; ketersediaan layanan dikonfirmasi penjual.',
    variants: [
      {
        id: 'puding-original',
        name: 'Original',
        price: 18000,
        ingredients: 'Labu kuning, susu, gula, agar-agar. Mengandung susu.',
      },
      {
        id: 'puding-cokelat',
        name: 'Cokelat',
        price: 20000,
        ingredients: 'Labu kuning, susu, gula, agar-agar, cokelat. Mengandung susu dan kedelai.',
      },
    ],
  },
  {
    id: 'bolu-labu',
    name: 'Bolu Labu',
    category: 'Kue',
    price: 45000,
    unit: '1 loaf · ±350 gram',
    badge: 'Original & pandan',
    image: '/images/cake.jpg',
    description:
      'Bolu labu lembut untuk dinikmati per potong. Pilih rasa original berempah atau pandan.',
    ingredients:
      'Labu kuning, tepung terigu, telur, gula, minyak nabati, kayu manis, biji labu. Mengandung gluten dan telur.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'fresh',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Kemasan dan suhu penanganan harus disesuaikan dengan produk; konfirmasi layanan ke penjual.',
    variants: [
      {
        id: 'bolu-labu',
        name: 'Original',
        price: 45000,
        ingredients:
          'Labu kuning, tepung terigu, telur, gula, minyak nabati, kayu manis, biji labu. Mengandung gluten dan telur.',
      },
      {
        id: 'bolu-labu-pandan',
        name: 'Pandan',
        price: 46000,
        ingredients:
          'Labu kuning, tepung terigu, telur, gula, santan, pandan, kelapa parut. Mengandung gluten dan telur.',
      },
    ],
  },
  {
    id: 'brownies-labu',
    name: 'Brownies Labu',
    category: 'Kue',
    price: 42000,
    unit: '4 potong · ±240 gram',
    badge: 'Cokelat & kacang',
    image: '/images/brownies.jpg',
    description:
      'Brownies cokelat dengan labu kuning dan tekstur padat lembut. Pilih topping cokelat atau kacang.',
    ingredients:
      'Labu kuning, tepung terigu, telur, gula, mentega, bubuk kakao, cokelat. Mengandung gluten, telur, susu, dan kedelai.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'fresh',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Kemasan dan suhu penanganan harus disesuaikan dengan produk; konfirmasi layanan ke penjual.',
    variants: [
      {
        id: 'brownies-labu',
        name: 'Cokelat',
        price: 42000,
        ingredients:
          'Labu kuning, tepung terigu, telur, gula, mentega, bubuk kakao, cokelat. Mengandung gluten, telur, susu, dan kedelai.',
      },
      {
        id: 'brownies-kacang',
        name: 'Cokelat Kacang',
        price: 46000,
        ingredients:
          'Labu kuning, tepung terigu, telur, gula, mentega, bubuk kakao, cokelat. Mengandung gluten, telur, susu, dan kedelai. Kacang tanah. Mengandung kacang tanah.',
      },
    ],
  },
  {
    id: 'muffin-labu',
    name: 'Muffin Labu',
    category: 'Kue',
    price: 32000,
    unit: 'box isi 4',
    badge: 'Oat & choco chips',
    image: '/images/muffin-tray.jpg',
    description: 'Muffin labu dalam ukuran praktis. Pilih taburan oat atau choco chips.',
    ingredients:
      'Labu kuning, tepung terigu, oat, telur, susu, gula, minyak nabati. Mengandung gluten, telur, dan susu.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'fresh',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Kemasan dan suhu penanganan harus disesuaikan dengan produk; konfirmasi layanan ke penjual.',
    variants: [
      {
        id: 'muffin-labu-oat',
        name: 'Oat',
        price: 32000,
        ingredients:
          'Labu kuning, tepung terigu, oat, telur, susu, gula, minyak nabati. Mengandung gluten, telur, dan susu.',
      },
      {
        id: 'muffin-choco-chips',
        name: 'Choco Chips',
        price: 36000,
        ingredients:
          'Labu kuning, tepung terigu, oat, telur, susu, gula, minyak nabati. Mengandung gluten, telur, dan susu. Choco chips. Mengandung kedelai.',
      },
    ],
  },
  {
    id: 'klepon-labu',
    name: 'Klepon Labu',
    category: 'Jajanan',
    price: 24000,
    unit: 'box isi 8',
    badge: 'Isi gula merah',
    image: '/images/klepon.jpg',
    description:
      'Klepon dari adonan labu dan tepung ketan, berisi gula merah dengan taburan kelapa. Dibuat untuk dinikmati segera.',
    ingredients: 'Labu kuning, tepung ketan, gula merah, kelapa parut, garam.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'fresh',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Kemasan dan suhu penanganan harus disesuaikan dengan produk; konfirmasi layanan ke penjual.',
    variants: [
      {
        id: 'klepon-gula-merah',
        name: 'Gula Merah',
        price: 24000,
        ingredients: 'Labu kuning, tepung ketan, gula merah, kelapa parut, garam.',
      },
    ],
  },
  {
    id: 'biji-labu',
    name: 'Biji Labu Panggang',
    category: 'Biji Labu',
    price: 25000,
    unit: '80 gram',
    badge: '2 pilihan bumbu',
    image: '/images/seeds.jpg',
    description:
      'Biji labu panggang untuk pilihan camilan renyah. Pilih asin gurih atau bumbu balado.',
    ingredients: 'Biji labu, minyak nabati, garam.',
    storage:
      'Simpan tertutup di tempat sejuk dan kering. Ikuti tanggal kedaluwarsa pada kemasan. Ketahanan 7 hari belum diuji.',
    shippingClass: 'dry',
    shippingNote:
      'Gunakan kemasan tertutup dan pelindung agar produk tidak mudah remuk. Estimasi kurir bukan jaminan umur simpan.',
    variants: [
      {
        id: 'biji-original',
        name: 'Original',
        price: 25000,
        ingredients: 'Biji labu, minyak nabati, garam.',
      },
      {
        id: 'biji-balado',
        name: 'Balado',
        price: 27000,
        ingredients: 'Biji labu, minyak nabati, cabai, gula, garam.',
      },
    ],
  },
  {
    id: 'pai-labu',
    name: 'Pai Labu',
    category: 'Kue',
    price: 22000,
    unit: '1 potong · ±100 gram',
    badge: 'Isian labu lembut',
    image: '/images/pie-plate.jpg',
    description:
      'Pai dengan isian labu lembut dan kulit pastry. Pilih original atau sentuhan kayu manis.',
    ingredients:
      'Labu kuning, tepung terigu, mentega, telur, susu, gula. Mengandung gluten, susu, dan telur.',
    storage:
      'Nikmati segera setelah diterima. Ikuti instruksi suhu simpan dan tanggal konsumsi pada label produsen. Ketahanan 7 hari belum diuji.',
    shippingClass: 'chilled',
    shippingNote:
      'Hanya pengiriman lokal hari yang sama. Produk perlu dipertahankan dingin dengan kemasan berpendingin; ketersediaan layanan dikonfirmasi penjual.',
    variants: [
      {
        id: 'pai-original',
        name: 'Original',
        price: 22000,
        ingredients:
          'Labu kuning, tepung terigu, mentega, telur, susu, gula. Mengandung gluten, susu, dan telur.',
      },
      {
        id: 'pai-kayu-manis',
        name: 'Kayu Manis',
        price: 24000,
        ingredients:
          'Labu kuning, tepung terigu, mentega, telur, susu, gula, kayu manis. Mengandung gluten, susu, dan telur.',
      },
    ],
  },
];
export const productCategories = [
  'Keripik',
  'Donat',
  'Kue',
  'Kukis',
  'Puding',
  'Jajanan',
  'Biji Labu',
];
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});
export const money = (value) => currencyFormatter.format(value);
export const productId = (product) => product.id || product._id || product.slug;
export const cartKey = (product) => `${productId(product)}:${product.variantId || ''}`;
export function selectVariant(product, id) {
  const variant = product.variants?.find((v) => v.id === id);
  if (product.variants?.length && !variant) throw new Error('Pilih varian terlebih dahulu.');
  return variant
    ? {
        ...product,
        variantId: variant.id,
        variantName: variant.name,
        price: variant.price,
        ingredients: variant.ingredients || product.ingredients,
        image: variant.image || product.image,
      }
    : product;
}

export function restoreCart(items) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (
      !item?.product ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99 ||
      item.product.category === 'Paket'
    )
      return [];
    const parent = products.find(
      (p) =>
        p.id === productId(item.product) ||
        p.variants?.some((v) => v.id === productId(item.product)),
    );
    if (!parent) {
      const product = item.product;
      return typeof productId(product) === 'string' &&
        typeof product.name === 'string' &&
        Number.isFinite(product.price) &&
        product.price >= 0
        ? [item]
        : [];
    }
    const id =
      item.product.variantId ||
      parent.variants?.find((v) => v.id === productId(item.product))?.id ||
      parent.variants?.[0]?.id;
    try {
      return [{ ...item, product: selectVariant(parent, id) }];
    } catch {
      return [];
    }
  });
}

// Use a single product photo for an order, including older demo receipts.
export function orderPreview(order, catalog = []) {
  const items = Array.isArray(order.items) ? order.items : [];
  const first = items[0] || {};
  const product =
    catalog.find((p) => productId(p) === first.productId) ||
    catalog.find((p) => first.name === p.name || first.name?.startsWith(`${p.name} — `));
  const name = product?.name || first.name?.split(' — ')[0] || 'Produk';
  const variant = first.variantName || first.name?.split(' — ').slice(1).join(' — ');
  const detail = [
    variant,
    `${first.quantity || 1} item`,
    items.length > 1 ? `+${items.length - 1} lainnya` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return { name, image: first.image || product?.image, detail };
}
