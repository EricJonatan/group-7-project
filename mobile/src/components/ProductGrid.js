import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useShop } from '../store.js';

import { Button, styles as s, colors } from '../ui.js';
import { money, productId } from '@labuibu/contracts/catalog';
import { Icon } from '../icons.js';
import { imageSource } from '../images.js';
import { Photo } from './Photo.js';

export function ProductCard({ item, navigation }) {
  const { favorites, favorite } = useShop();
  const id = productId(item);
  const saved = favorites.includes(id);
  return (
    <View style={{ flex: 1, minWidth: 0, marginBottom: 26 }}>
      <View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Lihat ${item.name}`}
          onPress={() => navigation.navigate('Detail', { id })}
        >
          <Photo source={imageSource(item.image)} style={s.cardImage} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          accessibilityLabel={`${saved ? 'Hapus' : 'Simpan'} ${item.name} ${saved ? 'dari' : 'ke'} favorit`}
          accessibilityState={{ selected: saved }}
          onPress={() => favorite(id)}
          style={{
            position: 'absolute',
            right: 6,
            top: 6,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: colors.paper,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="heart" size={18} filled={saved} />
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Detail', { id })}>
        <Text style={[s.cardTitle, { marginTop: 12 }]}>{item.name}</Text>
      </Pressable>
      <Text style={s.price}>{money(item.price)}</Text>
    </View>
  );
}

export function ProductGrid({ products, navigation }) {
  const rows = [];
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));
  return (
    <>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
          {row.map((p) => (
            <ProductCard key={productId(p)} item={p} navigation={navigation} />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </>
  );
}

export function CatalogState() {
  const { loading, error, load } = useShop();
  return loading ? (
    <ActivityIndicator color={colors.red} />
  ) : error ? (
    <>
      <Text accessibilityRole="alert" style={s.error}>
        {error}
      </Text>
      <Button title="Coba lagi" onPress={load} />
    </>
  ) : null;
}
