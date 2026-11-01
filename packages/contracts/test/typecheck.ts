import type { addCartItem, updateCartItem } from '../src/commerce.ts';
import type { CartItem, OrderInput, Product, SelectedProduct } from '../src/types.ts';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type CommerceTypeChecks = [
  Expect<Equal<Parameters<typeof addCartItem>[0], CartItem[]>>,
  Expect<Equal<Parameters<typeof addCartItem>[1], SelectedProduct>>,
  Expect<Equal<Parameters<typeof addCartItem>[2], number | undefined>>,
  Expect<Equal<Parameters<typeof updateCartItem>[2], number>>,
  Expect<Equal<OrderInput['paymentMethod'], 'bank_transfer' | 'cod'>>,
  Expect<Equal<OrderInput['shippingMethod'], 'regular' | 'instant'>>,
  Expect<Equal<Extract<keyof OrderInput['items'][number], 'price' | 'total'>, never>>,
  Expect<Equal<Product['shippingClass'], 'dry' | 'fresh' | 'chilled'>>,
];
