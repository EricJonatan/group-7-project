import React from 'react';
import { Text } from 'react-native';
import { useShop } from '../store.js';

import { Screen, Button, styles as s } from '../ui.js';
import { productId } from '@labuibu/contracts/catalog';
import { ProductGrid } from '../components/ProductGrid.js';

export function Favorites({ navigation }) {
  const { products, favorites } = useShop();
  const saved = products.filter((p) => favorites.includes(productId(p)));
  return (
    <Screen>
      <Text style={s.h1}>Cemilan favorit</Text>
      <Text style={[s.body, { marginBottom: 24 }]}>Cemilan pilihan yang sudah kamu simpan.</Text>
      {saved.length ? (
        <ProductGrid products={saved} navigation={navigation} />
      ) : (
        <>
          <Text style={s.body}>
            Ketuk ikon hati di camilan pilihanmu. Semuanya akan ada di sini.
          </Text>
          <Button
            title="Jelajahi Camilan"
            onPress={() => navigation.navigate('Shop', { screen: 'Produk kami' })}
          />
        </>
      )}
    </Screen>
  );
}
