import { test } from 'node:test';
import assert from 'node:assert/strict';
import { products, selectVariant, cartKey, orderPreview, restoreCart } from '../src/catalog.js';
import {
  addCartItem,
  updateCartItem,
  toggleFavorite,
  cartTotals,
  requiresInstantShipping,
  orderItemsFromCart,
  createOrderReceipt,
  orderDate,
} from '../src/commerce.js';

const chips = products.find((product) => product.id === 'keripik-labu');
const original = selectVariant(chips, 'keripik-original');
const cheese = selectVariant(chips, 'keripik-keju');

test('cart updates keep variants separate, cap quantity, and leave previous state intact', () => {
  const initial = [{ product: original, quantity: 98 }];
  const added = addCartItem(initial, original, 4);
  assert.equal(added[0].quantity, 99);
  assert.equal(initial[0].quantity, 98);
  const variants = addCartItem(added, cheese, 2);
  assert.equal(variants.length, 2);
  assert.deepEqual(cartTotals(variants), { count: 101, subtotal: 99 * 22000 + 2 * 26000 });
  const updated = updateCartItem(variants, cartKey(cheese), 120);
  assert.equal(updated[1].quantity, 99);
  assert.equal(variants[1].quantity, 2);
  assert.deepEqual(updateCartItem(variants, cartKey(original), 0), [
    { product: cheese, quantity: 2 },
  ]);
});

test('favorite toggles and shipping requirements work for empty, dry, and fresh carts', () => {
  assert.deepEqual(toggleFavorite(['a'], 'a'), []);
  assert.deepEqual(toggleFavorite(['a'], 'b'), ['a', 'b']);
  assert.equal(requiresInstantShipping([]), false);
  assert.equal(requiresInstantShipping([{ product: original, quantity: 1 }]), false);
  assert.equal(
    requiresInstantShipping([
      { product: products.find((p) => p.id === 'donat-labu'), quantity: 1 },
    ]),
    true,
  );
});

test('order payload contains only IDs and quantity, never client prices', () => {
  assert.deepEqual(orderItemsFromCart([{ product: cheese, quantity: 2 }]), [
    { productId: 'keripik-labu', variantId: 'keripik-keju', quantity: 2 },
  ]);
});

test('receipt uses server prices and shipping and excludes customer and credential data', () => {
  const serverOrder = {
    _id: 'order-123',
    total: 71000,
    shipping: 17000,
    createdAt: '2026-10-31T01:00:00.000Z',
    paymentMethod: 'bank_transfer',
    customer: { address: 'Private address' },
    token: 'private-token',
    items: [
      {
        productId: 'keripik-labu',
        variantId: 'keripik-keju',
        variantName: 'Keju',
        name: 'Keripik Labu — Keju',
        quantity: 2,
        price: 27000,
        customer: 'private',
      },
    ],
  };
  const receipt = createOrderReceipt(serverOrder, {
    cart: [{ product: cheese, quantity: 2 }],
    shipping: 15000,
  });
  assert.equal(receipt.id, 'order-123');
  assert.equal(receipt.items[0].price, 27000);
  assert.equal(receipt.items[0].image, cheese.image);
  assert.equal(receipt.shipping, 17000);
  assert.equal(receipt.total, 71000);
  assert.equal(receipt.customer, undefined);
  assert.equal(receipt.token, undefined);
  assert.equal(receipt.items[0].customer, undefined);
  assert.equal(receipt.date, serverOrder.createdAt);
});

test('demo receipts retain the selected variant, and old receipts resolve one thumbnail', () => {
  const receipt = createOrderReceipt(
    { id: 'DEMO-1', total: 67000 },
    {
      cart: [{ product: cheese, quantity: 2 }],
      shipping: 15000,
      paymentMethod: 'cod',
      demo: true,
    },
  );
  assert.equal(receipt.items[0].variantId, 'keripik-keju');
  assert.equal(receipt.items[0].name, 'Keripik Labu — Keju');
  assert.equal(receipt.demo, true);
  assert.throws(() => createOrderReceipt({ total: 1 }));
  const preview = orderPreview(
    {
      items: [
        { name: 'Keripik Labu — Keju', quantity: 2 },
        { name: 'Donat Labu', quantity: 1 },
      ],
    },
    products,
  );
  assert.equal(preview.image, chips.image);
  assert.equal(preview.detail, 'Keju · 2 item · +1 lainnya');
  assert.equal(orderDate({ date: '2026-10-31T01:00:00.000Z' }).includes('2026'), true);
});

test('invalid persisted carts and missing dates do not break startup or order history', () => {
  assert.deepEqual(
    restoreCart([null, {}, { product: {}, quantity: 1 }, { product: original, quantity: -1 }]),
    [],
  );
  assert.equal(orderDate({ date: 'invalid-date' }), '—');
});
