import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles as s, colors } from '../ui.js';
import { Icon } from '../icons.js';

export function AccountMenu({ navigation }) {
  return (
    <View style={{ marginVertical: 24, borderTopWidth: 1, borderTopColor: colors.line }}>
      {[
        {
          name: 'Pesanan saya',
          description: 'Lihat pesanan dan informasi pembayaran.',
          route: 'Orders',
        },
        {
          name: 'Cemilan favorit',
          description: 'Cemilan yang sudah kamu simpan.',
          route: 'Favorites',
        },
        {
          name: 'Dapur Labuibu',
          description: 'Kenali bahan dan proses pembuatan kami.',
          route: 'Dapur',
        },
      ].map((item) => (
        <Pressable
          key={item.route}
          accessibilityRole="button"
          onPress={() => navigation.navigate(item.route)}
          style={[
            s.row,
            { borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 20 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { fontSize: 15 }]}>{item.name}</Text>
            <Text style={[s.body, { fontSize: 13, lineHeight: 21, marginTop: 4 }]}>
              {item.description}
            </Text>
          </View>
          <Icon name="arrow" size={18} />
        </Pressable>
      ))}
    </View>
  );
}
