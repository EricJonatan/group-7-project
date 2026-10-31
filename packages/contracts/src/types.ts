import type { z } from 'zod';
import type {
  productSchema,
  registerSchema,
  loginSchema,
  customerSchema,
  orderSchema,
  statusSchema,
} from './index.ts';

export type Product = z.infer<typeof productSchema>;
export type ProductVariant = NonNullable<Product['variants']>[number];
export type SelectedProduct = Product & {
  _id?: string;
  slug?: string;
  variantId?: string;
  variantName?: string;
};
export interface CartItem {
  product: SelectedProduct;
  quantity: number;
}
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AuthInput = LoginInput & { name?: string };
export type Customer = z.infer<typeof customerSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type PaymentMethod = OrderInput['paymentMethod'];
export type ShippingMethod = OrderInput['shippingMethod'];
export type OrderStatus = z.infer<typeof statusSchema>['status'];
export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: 'customer' | 'admin';
  demo?: boolean;
}
export interface AuthResponse {
  user: User;
  token: string;
}
export interface OrderItem {
  productId?: string;
  variantId?: string;
  variantName?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}
export interface OrderRecord {
  _id?: string;
  id?: string;
  items: OrderItem[];
  total: number;
  shipping?: number;
  date?: string;
  createdAt?: string;
  paymentMethod?: PaymentMethod;
  shippingMethod?: ShippingMethod;
  status?: OrderStatus;
  demo?: boolean;
  customer?: Customer;
}
export interface OrderReceipt extends Omit<OrderRecord, 'customer'> {
  id: string;
  date: string;
  demo: boolean;
}
export interface ReceiptOptions {
  cart?: CartItem[];
  shipping?: number;
  paymentMethod?: PaymentMethod;
  demo?: boolean;
}
