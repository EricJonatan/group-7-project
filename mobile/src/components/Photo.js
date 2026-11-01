import React from 'react';
import { View, Image } from 'react-native';

export function Photo({ source, style, accessibilityLabel }) {
  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        resizeMode="cover"
        style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
      />
    </View>
  );
}
