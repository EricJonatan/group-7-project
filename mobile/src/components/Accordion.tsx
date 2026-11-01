import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles as s, colors } from '../ui.tsx';

export function Accordion({
  title,
  children,
  initiallyOpen = false,
}: React.PropsWithChildren<{ title: string; initiallyOpen?: boolean }>) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={[s.row, { paddingVertical: 18 }]}
      >
        <Text style={{ fontSize: 14, color: colors.ink, flex: 1 }}>{title}</Text>
        <Text style={{ color: colors.red, fontSize: 18 }}>{open ? '−' : '+'}</Text>
      </Pressable>
      {open && (
        <Text style={[s.body, { fontSize: 14, lineHeight: 23, paddingBottom: 18 }]}>
          {children}
        </Text>
      )}
    </View>
  );
}
