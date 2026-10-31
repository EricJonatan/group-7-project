import type {
  CartItem,
  SelectedProduct,
  OrderItem,
  OrderRecord,
  OrderReceipt,
  ReceiptOptions,
  OrderStatus,
} from './types.ts';
import { cartKey, productId } from './catalog.ts';

export const MAX_CART_QUANTITY = 99;

export function addCartItem(items: CartItem[], product: SelectedProduct, quantity = 1): CartItem[] {
  const key = cartKey(product);
  const existing = items.find((item) => cartKey(item.product) === key);
  const nextQuantity = Math.min(MAX_CART_QUANTITY, (existing?.quantity || 0) + quantity);
  return existing
    ? items.map((item) => (item === existing ? { ...item, quantity: nextQuantity } : item))
    : [...items, { product, quantity: nextQuantity }];
}

export function updateCartItem(items: CartItem[], key: string, quantity: number): CartItem[] {
  if (quantity <= 0) return items.filter((item) => cartKey(item.product) !== key);
  return items.map((item) =>
    cartKey(item.product) === key
      ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, quantity) }
      : item,
  );
}

export function toggleFavorite(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

export function cartTotals(items: CartItem[]) {
  return items.reduce(
    (totals, { product, quantity }) => ({
      count: totals.count + quantity,
      subtotal: totals.subtotal + product.price * quantity,
    }),
    { count: 0, subtotal: 0 },
  );
}

export const requiresInstantShipping = (items: CartItem[]) =>
  items.some(({ product }) => product.shippingClass !== 'dry');

export function orderItemsFromCart(cart: CartItem[]) {
  return cart.map(({ product, quantity }) => ({
    productId: productId(product),
    variantId: product.variantId,
    quantity,
  }));
}

/** Keep confirmation data only; never persist customer details or authentication data. */
export function createOrderReceipt(
  order: Omit<OrderRecord, 'items' | 'customer'> & { items?: OrderItem[] },
  { cart = [], shipping, paymentMethod, demo = false }: ReceiptOptions = {},
): OrderReceipt {
  const id = order._id || order.id;
  if (!id) throw new Error('Server belum memberikan nomor pesanan.');
  const fallbackItems = cart.map(({ product, quantity }) => ({
    ...product,
    productId: productId(product),
    name: product.variantName ? `${product.name} — ${product.variantName}` : product.name,
    quantity,
  }));
  const items = (order.items || fallbackItems).map((item) => {
    const product = cart.find((entry) => productId(entry.product) === item.productId)?.product;
    return {
      productId: item.productId,
      variantId: item.variantId,
      variantName: item.variantName,
      name: item.name,
      image: item.image || product?.image,
      price: item.price,
      quantity: item.quantity,
    };
  });
  return {
    id,
    items,
    total: order.total,
    date: order.createdAt || order.date || new Date().toISOString(),
    shipping: order.shipping ?? shipping,
    paymentMethod: order.paymentMethod || paymentMethod,
    demo: order.demo ?? demo,
  };
}

export const orderStatusLabels = Object.freeze({
  processing: 'Diproses',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
});

export const orderStatusTransitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> =
  Object.freeze({
    processing: Object.freeze(['shipped', 'cancelled'] as const),
    shipped: Object.freeze(['completed'] as const),
    completed: Object.freeze([]),
    cancelled: Object.freeze([]),
  });

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
export function orderDate(order: Pick<OrderRecord, 'createdAt' | 'date'>) {
  const date = new Date(order.createdAt || order.date || '');
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

export function isOrderReceipt(value: unknown): value is OrderReceipt {
  if (!value || typeof value !== 'object') return false;
  const receipt = value as Record<string, unknown>;
  const optionalString = (key: string) =>
    receipt[key] === undefined || typeof receipt[key] === 'string';
  return (
    typeof receipt.id === 'string' &&
    typeof receipt.date === 'string' &&
    typeof receipt.demo === 'boolean' &&
    typeof receipt.total === 'number' &&
    Number.isFinite(receipt.total) &&
    (receipt.shipping === undefined ||
      (typeof receipt.shipping === 'number' && Number.isFinite(receipt.shipping))) &&
    (receipt.paymentMethod === undefined ||
      receipt.paymentMethod === 'bank_transfer' ||
      receipt.paymentMethod === 'cod') &&
    (receipt.shippingMethod === undefined ||
      receipt.shippingMethod === 'regular' ||
      receipt.shippingMethod === 'instant') &&
    (receipt.status === undefined ||
      Object.keys(orderStatusLabels).includes(String(receipt.status))) &&
    optionalString('_id') &&
    optionalString('createdAt') &&
    !('customer' in receipt) &&
    Array.isArray(receipt.items) &&
    receipt.items.every(isReceiptItem)
  );
}

function isReceiptItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    ['productId', 'variantId', 'variantName', 'image'].every(
      (key) => item[key] === undefined || typeof item[key] === 'string',
    )
  );
}
