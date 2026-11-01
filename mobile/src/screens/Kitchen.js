import React from 'react';
import { View, Text } from 'react-native';
import { Screen, Button, styles as s, colors } from '../ui.js';
import { imageSource } from '../images.js';
import { Photo } from '../components/Photo.js';

export function Kitchen({ navigation }) {
  return (
    <Screen>
      <Text style={s.eyebrow}>DAPUR LABUIBU</Text>
      <Text style={s.h1}>
        Dari petani labu.{`\n`}
        <Text style={{ color: colors.red, fontFamily: 'PlayfairDisplay_500Medium_Italic' }}>
          Dibuat di rumah.
        </Text>
      </Text>
      <Text style={s.body}>Berbahan utama labu asli premium, tanpa perasa buatan.</Text>
      <Text style={[s.body, { marginTop: 16 }]}>
        Kami membeli labu langsung dari petani dan mengolahnya di dapur rumah. Bahan-bahan alami
        disiapkan dengan tangan menjadi cemilan yang kamu suka.
      </Text>
      <Button
        title="Pilih Cemilanmu  →"
        onPress={() => navigation.navigate('Shop', { screen: 'Produk kami' })}
      />
      <Photo
        source={imageSource('/images/story.jpg')}
        style={{ width: '100%', aspectRatio: 1, marginVertical: 28 }}
      />
      <Text style={[s.body, { fontSize: 12 }]}>
        Foto ilustrasi, bukan dokumentasi dapur atau petani mitra Labuibu.
      </Text>
      <Text style={[s.h2, { marginTop: 32 }]}>Empat langkah dari dapur kami.</Text>
      {[
        ['Pilih labu', 'Labu premium dibeli langsung dari petani, lalu diperiksa sebelum diolah.'],
        [
          'Siapkan bahan',
          'Labu dicuci, dikupas, dan disiapkan. Bahan alami lainnya ditimbang sesuai resep.',
        ],
        [
          'Olah dengan tangan',
          'Adonan dicampur, dibagi, dan dibentuk dengan tangan, lalu dimasak sesuai jenis cemilan.',
        ],
        [
          'Periksa & kemas',
          'Hasil olahan diperiksa dan dikemas. Penyimpanan serta pengiriman mengikuti kebutuhan produknya.',
        ],
      ].map(([title, text], i) => (
        <View key={title} style={s.line}>
          <Text style={s.eyebrow}>0{i + 1}</Text>
          <Text style={[s.h2, { fontSize: 19, marginBottom: 8 }]}>{title}</Text>
          <Text style={s.body}>{text}</Text>
        </View>
      ))}
    </Screen>
  );
}
