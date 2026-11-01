import { cartKey, productId } from './catalog.js';

export const MAX_CART_QUANTITY = 99;

export function addCartItem(items, product, quantity = 1) {
  const key = cartKey(product);
  const existing = items.find((item) => cartKey(item.product) === key);
  const nextQuantity = Math.min(MAX_CART_QUANTITY, (existing?.quantity || 0) + quantity);
  return existing
    ? items.map((item) => (item === existing ? { ...item, quantity: nextQuantity } : item))
    : [...items, { product, quantity: nextQuantity }];
}

export function updateCartItem(items, key, quantity) {
  if (quantity <= 0) return items.filter((item) => cartKey(item.product) !== key);
  return items.map((item) =>
    cartKey(item.product) === key
      ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, quantity) }
      : item,
  );
}

export function toggleFavorite(items, id) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

export function cartTotals(items) {
  return items.reduce(
    (totals, { product, quantity }) => ({
      count: totals.count + quantity,
      subtotal: totals.subtotal + product.price * quantity,
    }),
    { count: 0, subtotal: 0 },
  );
}

export const requiresInstantShipping = (items) =>
  items.some(({ product }) => product.shippingClass !== 'dry');

export function orderItemsFromCart(cart) {
  return cart.map(({ product, quantity }) => ({
    productId: productId(product),
    variantId: product.variantId,
    quantity,
  }));
}

/** Keep confirmation data only; never persist customer details or authentication data. */
export function createOrderReceipt(
  order,
  { cart = [], shipping, paymentMethod, demo = false } = {},
) {
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

export const orderStatusTransitions = Object.freeze({
  processing: Object.freeze(['shipped', 'cancelled']),
  shipped: Object.freeze(['completed']),
  completed: Object.freeze([]),
  cancelled: Object.freeze([]),
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
export function orderDate(order) {
  const date = new Date(order.createdAt || order.date);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}
