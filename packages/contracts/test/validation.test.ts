import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerSchema, orderSchema, productSchema, profileSchema } from '../src/index.ts';
import { products, selectVariant, cartKey, restoreCart } from '../src/catalog.ts';
test('variants have distinct cart keys and migrate old flavor products', () => {
  const chips = products.find((p) => p.id === 'keripik-labu');
  assert.ok(chips);
  const original = selectVariant(chips, 'keripik-original');
  const cheese = selectVariant(chips, 'keripik-keju');
  assert.notEqual(cartKey(original), cartKey(cheese));
  assert.equal(cheese.price, 26000);
  assert.throws(() => selectVariant(chips, 'missing'));
  const migrated = restoreCart([{ product: { id: 'keripik-balado' }, quantity: 2 }]);
  assert.equal(migrated[0].product.id, 'keripik-labu');
  assert.equal(migrated[0].product.variantName, 'Balado');
  assert.equal(restoreCart([{ product: { category: 'Paket' }, quantity: 1 }]).length, 0);
});
test('catalog seed conforms to product contract', () => {
  for (const p of products) assert.ok(productSchema.safeParse(p).success);
});
test('registration normalizes email and forbids role escalation', () => {
  assert.equal(
    registerSchema.parse({
      name: 'Ibu Labu',
      email: ' IBU@EXAMPLE.COM ',
      password: 'securepassword',
    }).email,
    'ibu@example.com',
  );
  assert.equal(
    registerSchema.safeParse({
      name: 'Ibu Labu',
      email: 'ibu@example.com',
      password: 'securepassword',
      role: 'admin',
    }).success,
    false,
  );
});
test('profile updates cannot change role', () =>
  assert.equal(profileSchema.safeParse({ role: 'admin' }).success, false));
test('order contract rejects prices, negative quantities, excessive quantities, bad address', () => {
  const valid = {
    items: [{ productId: 'keripik-original', quantity: 1 }],
    shippingMethod: 'regular',
    paymentMethod: 'cod',
    customer: {
      name: 'Ibu Labu',
      email: 'ibu@example.com',
      phone: '081234567890',
      address: 'Jalan Labu Nomor 123',
      city: 'Jakarta',
      postcode: '12345',
    },
  };
  assert.ok(orderSchema.safeParse(valid).success);
  for (const item of [
    { productId: 'keripik-original', quantity: -1 },
    { productId: 'keripik-original', quantity: 100 },
    { productId: 'keripik-original', quantity: 1, price: 1 },
  ])
    assert.equal(orderSchema.safeParse({ ...valid, items: [item] }).success, false);
  assert.equal(
    orderSchema.safeParse({ ...valid, customer: { ...valid.customer, address: 'x' } }).success,
    false,
  );
});
