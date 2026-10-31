import type { TabScreenProps } from '../navigation.ts';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useShop } from '../store.tsx';

import { Button, Footer, styles as s, colors } from '../ui.tsx';
import { money } from '@labuibu/contracts/catalog';
import { Icon, Pumpkin } from '../icons.tsx';
import { imageSource } from '../images.ts';
import { Photo } from '../components/Photo.tsx';
import { CatalogState, ProductGrid } from '../components/ProductGrid.tsx';

export function Home({ navigation }: TabScreenProps<'Home'>) {
  const { products, loading, error, load } = useShop();
  const { width } = useWindowDimensions();
  const headlineSize = Math.min(30, (width - 40) / 12);
  const headlineStyle = { fontSize: headlineSize, lineHeight: headlineSize * 1.3 };
  return (
    <View style={s.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.red} />
        }
      >
        <View>
          <Photo
            source={imageSource('/images/hero-assortment.jpg')}
            accessibilityLabel="Aneka donat, keripik, kukis, dan bolu"
            style={{ width: '100%', aspectRatio: 4 / 3 }}
          />
          <View
            style={{
              position: 'absolute',
              right: 16,
              top: 14,
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: '#fff5dff0',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <Text style={{ fontSize: 8, color: colors.red, letterSpacing: 0.5 }}>LABU ASLI</Text>
            <Pumpkin size={28} />
            <Text style={{ fontSize: 8, color: colors.red, letterSpacing: 0.5 }}>PREMIUM</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              backgroundColor: '#201b1650',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 9, color: colors.paper }}>CAMILAN LABUIBU</Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.paper,
                fontFamily: 'PlayfairDisplay_500Medium_Italic',
              }}
            >
              Pilih yang gurih atau manis.
            </Text>
          </View>
        </View>
        <View style={s.section}>
          <Text style={s.eyebrow}>ANEKA CEMILAN LABU PREMIUM</Text>
          <Text style={[s.h1, headlineStyle]}>
            Cemilan enak dan sehat?{`\n`}
            <Text style={{ color: colors.red, fontFamily: 'PlayfairDisplay_500Medium_Italic' }}>
              Ya, Labuibu!
            </Text>
          </Text>
          <Text style={s.body}>
            Berbahan utama labu asli premium, tanpa perasa buatan. Dari keripik, kukis, dan biji
            labu panggang sampai puding dan jajanan tradisional.
          </Text>
          <Button
            title="Belanja Camilan  →"
            hug
            onPress={() => navigation.navigate('Produk kami')}
          />
          <Text style={{ fontSize: 12, lineHeight: 20, color: colors.muted, marginTop: 20 }}>
            ✳{' '}
            {products.length ? (
              <>
                <Text style={{ color: colors.price }}>
                  {money(Math.min(...products.map((p) => p.price)))}
                </Text>{' '}
                · Banyak pilihan rasa
              </>
            ) : (
              'Pilih rasa dan porsi sesuai seleramu'
            )}
          </Text>
        </View>
        <View style={[s.section, { backgroundColor: colors.soft, gap: 20, paddingVertical: 26 }]}>
          {[
            ['leaf', 'Labu asli premium', 'Bahan utama pilihan Labuibu'],
            ['heart', 'Tanpa perasa buatan', 'Rasa dari bahan yang digunakan'],
            ['bag', 'Banyak pilihan rasa', 'Dari gurih original sampai cokelat'],
          ].map(([icon, title, text]) => (
            <View key={title} style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Icon name={icon} size={27} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: colors.ink, marginBottom: 4 }}>{title}</Text>
                <Text style={{ fontSize: 12, lineHeight: 19, color: colors.muted }}>{text}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={s.section}>
          <Text style={s.h2}>
            Mau ngemil{' '}
            <Text style={{ color: colors.red, fontFamily: 'PlayfairDisplay_500Medium_Italic' }}>
              apa?
            </Text>
          </Text>
          <CatalogState />
          {!loading && !error && (
            <ProductGrid products={products.slice(0, 8)} navigation={navigation} />
          )}
          <Button
            title="Lihat semua camilan  →"
            style={{ marginTop: 2 }}
            onPress={() => navigation.navigate('Produk kami')}
          />
        </View>
        <View style={{ backgroundColor: colors.soft }}>
          <Photo
            source={imageSource('/images/story.jpg')}
            style={{ width: '100%', aspectRatio: 1.25 }}
          />
          <View style={{ padding: 24 }}>
            <Text style={s.eyebrow}>KENAPA LABUIBU?</Text>
            <Text style={s.h2}>
              Enak pilihannya.{`\n`}
              <Text style={{ color: colors.red, fontFamily: 'PlayfairDisplay_500Medium_Italic' }}>
                Jelas bahannya.
              </Text>
            </Text>
            <Text style={s.body}>
              Mau yang gurih? Ada keripik original, balado, keju, dan rumput laut. Suka manis? Pilih
              donat, bolu, brownies, atau muffin labu.
            </Text>
            <Text style={[s.body, { marginTop: 16 }]}>
              Kenali bahan yang kamu makan. Setiap produk dilengkapi komposisi, informasi alergen,
              dan ukuran kemasan.
            </Text>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Dapur')}>
              <Text style={[s.link, { marginTop: 12 }]}>Kenali Bahan & Proses Kami →</Text>
            </Pressable>
          </View>
        </View>
        <View style={[s.section, { alignItems: 'center', paddingVertical: 48 }]}>
          <Text style={s.eyebrow}>GURIH ATAU MANIS, TINGGAL PILIH</Text>
          <Text style={[s.h2, headlineStyle, { textAlign: 'center' }]}>
            Cemilan enak dan sehat?{`\n`}
            <Text style={{ color: colors.red, fontFamily: 'PlayfairDisplay_500Medium_Italic' }}>
              Ya, Labuibu!
            </Text>
          </Text>
          <Button
            title="Pilih Varian Favoritmu  →"
            onPress={() => navigation.navigate('Produk kami')}
          />
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
