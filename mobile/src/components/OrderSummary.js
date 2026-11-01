import React from 'react';
import { View, Text } from 'react-native';
import { useShop } from '../store.js';

import { styles as s, colors } from '../ui.js';
import { money, cartKey } from '@labuibu/contracts/catalog';

export function OrderSummary({ shipping, children }) {
  const { cart, subtotal } = useShop();
  return (
    <View style={s.summary}>
      <Text style={s.h2}>Ringkasan pesanan</Text>
      <View
        style={{
          gap: 18,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
          paddingBottom: 20,
          marginBottom: 18,
        }}
      >
        {cart.map(({ product, quantity }) => (
          <View key={cartKey(product)} style={[s.row, { alignItems: 'flex-start' }]}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[s.label, { fontFamily: 'DMSans_600SemiBold' }]}>{product.name}</Text>
              <Text
                style={{
                  fontFamily: 'DMSans_400Regular',
                  fontSize: 12,
                  lineHeight: 20,
                  color: colors.muted,
                  marginTop: 4,
                }}
              >
                {product.variantName ? `${product.variantName} · ` : ''}
                {quantity} × <Text style={{ color: colors.price }}>{money(product.price)}</Text>
              </Text>
            </View>
            <Text style={[s.price, { fontSize: 14 }]}>{money(product.price * quantity)}</Text>
          </View>
        ))}
      </View>
      <View style={[s.row, { alignItems: 'flex-start' }]}>
        <Text style={[s.body, { fontSize: 14 }]}>Ongkir</Text>
        <Text style={[s.price, { fontSize: 14, textAlign: 'right', flex: 1 }]}>
          {shipping === undefined ? 'Dihitung saat checkout' : money(shipping)}
        </Text>
      </View>
      <View
        style={[
          s.row,
          {
            borderTopWidth: 1,
            borderTopColor: colors.line,
            paddingTop: 18,
            marginTop: 18,
            alignItems: 'flex-start',
          },
        ]}
      >
        <Text style={[s.label, { flex: 1, fontFamily: 'DMSans_600SemiBold' }]}>
          Total pembayaran
        </Text>
        <Text style={[s.price, { fontFamily: 'DMSans_600SemiBold', fontSize: 20, lineHeight: 26 }]}>
          {money(subtotal + (shipping || 0))}
        </Text>
      </View>
      {children}
    </View>
  );
}
