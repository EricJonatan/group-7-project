import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../ui.js';

export function Choice({ title, description, price, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: selected ? colors.red : colors.line,
        padding: 16,
        marginBottom: 12,
        backgroundColor: selected ? colors.soft : 'transparent',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderWidth: 1,
          borderColor: selected ? colors.red : colors.muted,
          borderRadius: 8,
          marginTop: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red }} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, lineHeight: 22, color: colors.ink, fontWeight: '600' }}>
          {title}
        </Text>
        {description && (
          <Text style={{ fontSize: 12, lineHeight: 20, color: colors.muted, marginTop: 4 }}>
            {description}
          </Text>
        )}
      </View>
      {price && <Text style={{ fontSize: 12, lineHeight: 22, color: colors.price }}>{price}</Text>}
    </Pressable>
  );
}
