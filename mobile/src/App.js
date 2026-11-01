import React from 'react';
import { Text, ActivityIndicator, View, Pressable } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Provider, useShop } from './store.js';

import {
  Home,
  Catalog,
  Kitchen,
  Detail,
  Cart,
  Auth,
  Checkout,
  Account,
  Orders,
  Favorites,
  Success,
} from './screens.js';
import { colors, Brand } from './ui.js';
import { Icon } from './icons.js';
import { productId } from '@labuibu/contracts/catalog';
import { useFonts } from 'expo-font';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
import { PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display/500Medium';
import { PlayfairDisplay_500Medium_Italic } from '@expo-google-fonts/playfair-display/500Medium_Italic';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display/600SemiBold';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.red,
    background: colors.paper,
    card: colors.paper,
    text: colors.ink,
    border: colors.line,
  },
};
function CartAction({ navigation, compact = false }) {
  const { count } = useShop();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Shopping Cart, ${count} produk`}
      onPress={() => navigation.navigate('Keranjang')}
      hitSlop={8}
      style={{
        marginRight: compact ? 0 : 16,
        padding: compact ? 0 : 8,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Icon name="bag" color={colors.ink} />
      {count > 0 && (
        <View
          style={{
            backgroundColor: colors.soft,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 11, color: colors.ink }}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11 },
        headerTitle: () => <Brand />,
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: colors.paper },
        headerRight: () => <CartAction navigation={navigation} />,
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line },
        tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Produk kami"
        component={Catalog}
        options={{ tabBarIcon: ({ color }) => <Icon name="grid" color={color} /> }}
      />
      <Tab.Screen
        name="Akun"
        component={Account}
        options={{ tabBarIcon: ({ color }) => <Icon name="user" color={color} /> }}
      />
    </Tab.Navigator>
  );
}
function SecondaryHeader({ navigation, route, options, back }) {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.paper }}>
      <View
        style={{
          minHeight: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}
      >
        {back && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            hitSlop={10}
            onPress={() => navigation.goBack()}
            style={{ width: 24, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="back" size={24} color={colors.ink} />
          </Pressable>
        )}
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={{
            flex: 1,
            fontFamily: 'DMSans_600SemiBold',
            fontSize: 17,
            lineHeight: 24,
            color: colors.ink,
          }}
        >
          {options.title || route.name}
        </Text>
        {route.name !== 'Keranjang' && route.name !== 'Success' && (
          <CartAction navigation={navigation} compact />
        )}
      </View>
    </SafeAreaView>
  );
}
function Root() {
  const { ready, products } = useShop();
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <ActivityIndicator color={colors.red} />
      </View>
    );
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          title:
            route.name === 'Detail'
              ? products.find((p) => productId(p) === route.params?.id)?.name || 'Detail produk'
              : {
                  Keranjang: 'Shopping Cart',
                  Dapur: 'Dapur Labuibu',
                  Auth: 'Masuk',
                  Checkout: 'Checkout',
                  Success: 'Pesanan diterima',
                  Orders: 'Pesanan saya',
                  Favorites: 'Cemilan favorit',
                }[route.name] || route.name,
          header: (props) => <SecondaryHeader {...props} />,
          contentStyle: { backgroundColor: colors.paper },
        })}
      >
        <Stack.Screen name="Shop" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Keranjang" component={Cart} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Dapur" component={Kitchen} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Favorites" component={Favorites} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_500Medium_Italic,
    PlayfairDisplay_600SemiBold,
  });
  if (!fontsLoaded && !fontError)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <ActivityIndicator color={colors.red} />
      </View>
    );
  return (
    <SafeAreaProvider>
      <Provider>
        <StatusBar style="dark" />
        <Root />
      </Provider>
    </SafeAreaProvider>
  );
}
