import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useShop } from '../store.js';

import { Screen, Button, Quantity, styles as s } from '../ui.js';
import { money, cartKey } from '@labuibu/contracts/catalog';
import { imageSource } from '../images.js';
import { Photo } from '../components/Photo.js';
import { OrderSummary } from '../components/OrderSummary.js';

export function Cart({ navigation }) {
  const { cart, user, update } = useShop();
  return (
    <Screen>
      <Text style={s.eyebrow}>CEK PILIHAN CAMILANMU</Text>
      <Text style={s.h1}>Shopping Cart</Text>
      {!cart.length ? (
        <>
          <Text style={s.body}>Keranjangmu kosong. Pilih camilan dan tambahkan ke keranjang.</Text>
          <Button
            title="Lihat Camilan"
            onPress={() => navigation.navigate('Shop', { screen: 'Produk kami' })}
          />
        </>
      ) : (
        <>
          {cart.map(({ product: p, quantity }) => (
            <View style={s.line} key={cartKey(p)}>
              <View style={[s.row, { alignItems: 'flex-start' }]}>
                <Photo source={imageSource(p.image)} style={{ width: 64, height: 84 }} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[s.cardTitle, { marginTop: 0 }]}>{p.name}</Text>
                  <Text style={[s.cardUnit, { marginTop: 4, marginBottom: 6 }]}>
                    {p.variantName ? `${p.variantName} · ` : ''}
                    {p.unit}
                  </Text>
                  <Text style={s.price}>{money(p.price * quantity)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Quantity
                    value={quantity}
                    name={p.name}
                    onChange={(n) => update(cartKey(p), n)}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hapus ${p.name}`}
                    onPress={() => update(cartKey(p), 0)}
                  >
                    <Text style={s.link}>Hapus</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          <OrderSummary>
            <Button
              title="Lanjut ke Checkout"
              onPress={() =>
                navigation.navigate(
                  user ? 'Checkout' : 'Auth',
                  user ? undefined : { next: 'Checkout' },
                )
              }
            />
          </OrderSummary>
        </>
      )}
    </Screen>
  );
}
