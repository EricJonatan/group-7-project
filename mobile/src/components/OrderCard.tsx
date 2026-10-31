import type { OrderRecord } from '@labuibu/contracts/types';
import type { NavigationProps } from '../navigation.ts';
import { createOrderReceipt, orderDate, orderStatusLabels } from '@labuibu/contracts/commerce';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useShop } from '../store.tsx';

import { styles as s, colors } from '../ui.tsx';
import { money, orderPreview } from '@labuibu/contracts/catalog';
import { Icon } from '../icons.tsx';
import { imageSource } from '../images.ts';
import { Photo } from './Photo.tsx';

export function CompactOrderCard({ order, navigation }: NavigationProps & { order: OrderRecord }) {
  const { products } = useShop();
  const preview = orderPreview(order, products);
  const id = order._id || order.id;
  const date = orderDate(order);
  return (
    <View style={{ borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 12 }}>
      <View style={[s.row, { gap: 10, marginBottom: 12 }]}>
        <Text
          numberOfLines={1}
          style={{ flex: 1, fontFamily: 'DMSans_400Regular', fontSize: 11, color: colors.muted }}
        >
          #{id}
        </Text>
        <Text style={{ fontSize: 11, lineHeight: 18, color: colors.muted }}>{date}</Text>
      </View>
      <View style={[s.row, { gap: 12 }]}>
        {preview.image ? (
          <Photo
            source={imageSource(preview.image)}
            accessibilityLabel={preview.name}
            style={{ width: 60, height: 60 }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: colors.soft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="bag" />
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'DMSans_600SemiBold',
              fontSize: 14,
              lineHeight: 20,
              color: colors.ink,
            }}
          >
            {preview.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'DMSans_400Regular',
              fontSize: 12,
              lineHeight: 18,
              color: colors.muted,
              marginTop: 3,
            }}
          >
            {preview.detail}
            {!order.demo ? ` · ${orderStatusLabels[order.status || 'processing'] || ''}` : ''}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 6,
            }}
          >
            <Text style={{ fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: colors.price }}>
              {money(order.total)}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Lihat detail pesanan ${id}`}
          hitSlop={8}
          onPress={() => navigation.navigate('Success', createOrderReceipt(order))}
          style={{ width: 28, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="arrow" size={18} />
        </Pressable>
      </View>
    </View>
  );
}
