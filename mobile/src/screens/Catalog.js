import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useShop } from '../store.js';

import { Footer, styles as s, colors } from '../ui.js';
import { productId } from '@labuibu/contracts/catalog';
import { ProductCard, CatalogState } from '../components/ProductGrid.js';

export function Catalog({ navigation }) {
  const { products, loading, error, load } = useShop();
  return (
    <View style={s.page}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={
          products.length % 2 ? [...products, { id: 'empty-slot', placeholder: true }] : products
        }
        keyExtractor={productId}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, flexGrow: 1 }}
        ListFooterComponentStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        columnWrapperStyle={{ gap: 14 }}
        refreshing={loading}
        onRefresh={load}
        ListHeaderComponent={
          <>
            <Text style={s.eyebrow}>KATALOG CAMILAN LABU</Text>
            <Text style={s.h1}>
              Pilih rasa.{' '}
              <Text style={{ color: colors.red, fontFamily: 'PlayfairDisplay_500Medium_Italic' }}>
                Langsung pesan.
              </Text>
            </Text>
            <Text style={[s.body, { marginBottom: 24 }]}>
              Pilih jenis cemilannya, lalu tentukan rasa di halaman detail. Semua berbahan utama
              labu asli premium, tanpa perasa buatan.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1, minWidth: 0 }}>
            {!item.placeholder && <ProductCard item={item} navigation={navigation} />}
          </View>
        )}
        ListEmptyComponent={
          loading || error ? (
            <CatalogState />
          ) : (
            <Text style={s.body}>Pilihan camilan akan segera hadir.</Text>
          )
        }
        ListFooterComponent={
          <View style={{ marginHorizontal: -20, marginTop: 12 }}>
            <Footer />
          </View>
        }
      />
    </View>
  );
}
