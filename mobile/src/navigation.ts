import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { OrderReceipt } from '@labuibu/contracts/types';

export type ShopTabParamList = { Home: undefined; 'Produk kami': undefined; Akun: undefined };
export type RootStackParamList = {
  Shop: NavigatorScreenParams<ShopTabParamList> | undefined;
  Keranjang: undefined;
  Detail: { id: string };
  Dapur: undefined;
  Orders: undefined;
  Favorites: undefined;
  Auth: { next?: 'Checkout' | 'Orders' } | undefined;
  Checkout: undefined;
  Success: OrderReceipt;
};
export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
export type StackScreenProps<Name extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Name
>;
export type TabScreenProps<Name extends keyof ShopTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ShopTabParamList, Name>,
  NativeStackScreenProps<RootStackParamList, 'Shop'>
>;
export type NavigationProps = { navigation: Pick<RootNavigation, 'navigate'> };
