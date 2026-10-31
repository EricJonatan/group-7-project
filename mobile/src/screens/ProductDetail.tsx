import type { StackScreenProps } from '../navigation.ts';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useShop } from '../store.tsx';

import { Screen, Button, Quantity, styles as s, colors } from '../ui.tsx';
import { money, productId, selectVariant } from '@labuibu/contracts/catalog';
import { Icon } from '../icons.tsx';
import { imageSource } from '../images.ts';
import { Photo } from '../components/Photo.tsx';
import { Accordion } from '../components/Accordion.tsx';
import { ProductGrid } from '../components/ProductGrid.tsx';

export function Detail({ route, navigation }: StackScreenProps<'Detail'>) {
  const { products, add, favorites, favorite } = useShop();
  const p = products.find((p) => productId(p) === route.params.id);
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState('');
  useEffect(() => {
    setQuantity(1);
    setVariantId('');
  }, [route.params.id]);
  if (!p)
    return (
      <Screen>
        <Text style={s.body}>Produk tidak tersedia. Muat ulang katalog.</Text>
        <Button title="Kembali" onPress={() => navigation.goBack()} />
      </Screen>
    );
  const selected = p.variants?.find((v) => v.id === variantId) || p.variants?.[0];
  const chosen = selected ? selectVariant(p, selected.id) : p;
  return (
    <Screen scrollResetKey={productId(p)}>
      <View style={{ width: '100%', maxWidth: 380, alignSelf: 'center', marginBottom: 26 }}>
        <Photo
          source={imageSource(chosen.image)}
          accessibilityLabel={p.name}
          style={{ width: '100%', aspectRatio: 1 }}
        />
        <Text
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: colors.paper,
            padding: 8,
            fontSize: 11,
            color: colors.red,
          }}
        >
          {p.badge}
        </Text>
      </View>
      {p.image === '/images/klepon.jpg' && (
        <Text style={{ fontSize: 11, lineHeight: 18, color: colors.muted, marginBottom: 20 }}>
          Foto: Joseagush · Wikimedia Commons · CC BY-SA 4.0
        </Text>
      )}
      <Text style={s.eyebrow}>{p.category.toUpperCase()} · BUATAN RUMAHAN</Text>
      <View style={[s.row, { alignItems: 'flex-start' }]}>
        <Text style={[s.h1, { flex: 1 }]}>{p.name}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorites.includes(productId(p)) ? 'Hapus dari favorit' : 'Simpan ke favorit'
          }
          accessibilityState={{ selected: favorites.includes(productId(p)) }}
          hitSlop={8}
          onPress={() => favorite(productId(p))}
          style={{ padding: 5 }}
        >
          <Icon name="heart" filled={favorites.includes(productId(p))} />
        </Pressable>
      </View>
      <Text
        style={[
          s.price,
          { fontSize: 20, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: colors.line },
        ]}
      >
        {money(chosen.price)} <Text style={{ fontSize: 12, color: colors.muted }}>/ {p.unit}</Text>
      </Text>
      <Text style={[s.body, { marginTop: 22 }]}>{p.description}</Text>
      <Text style={[s.body, { marginTop: 18, fontSize: 14, color: colors.red }]}>
        Berbahan utama labu asli premium, tanpa perasa buatan.
      </Text>
      <Text style={[s.label, { marginTop: 24, marginBottom: 12 }]}>
        Pilih varian: <Text style={{ fontWeight: '600' }}>{selected?.name || 'Original'}</Text>
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {p.variants?.map((v) => (
          <Pressable
            key={v.id}
            accessibilityRole="button"
            accessibilityState={{ selected: selected?.id === v.id }}
            style={[s.chip, selected?.id === v.id && s.activeChip]}
            onPress={() => setVariantId(v.id)}
          >
            <Text style={s.chipText}>{v.name}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ fontSize: 12, color: '#62714d', marginVertical: 20 }}>
        ● Tersedia untuk dipesan
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Quantity value={quantity} onChange={setQuantity} name={p.name} />
        <Button
          hug
          title="Tambah ke Keranjang"
          style={{ marginTop: 0 }}
          onPress={() => {
            add(chosen, quantity);
            Alert.alert('Masuk keranjang', p.name, [
              { text: 'Lanjut belanja' },
              { text: 'Lihat keranjang', onPress: () => navigation.navigate('Keranjang') },
            ]);
          }}
        />
      </View>
      <Text style={[s.body, { fontSize: 12, marginVertical: 18 }]}>
        Pilih pengiriman saat checkout
      </Text>
      <Accordion title="Bahan & informasi alergen" initiallyOpen>
        {chosen.ingredients}
      </Accordion>
      <Accordion title="Cara menyimpan">{p.storage}</Accordion>
      <Accordion title="Pengiriman">{p.shippingNote}</Accordion>
      <Text style={[s.h2, { marginTop: 36 }]}>Lengkapi pesananmu.</Text>
      <ProductGrid
        products={products.filter((item) => productId(item) !== productId(p)).slice(0, 4)}
        navigation={navigation}
      />
    </Screen>
  );
}
