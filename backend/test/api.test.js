import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Product, User, Order } from '../src/models.js';
import { products } from '@labuibu/contracts/catalog';
let mongo, app, customer, other, admin;
const password = 'Test-password-2026';
const auth = (token) => ({ Authorization: `Bearer ${token}` });
const order = {
  items: [{ productId: 'keripik-labu', variantId: 'keripik-original', quantity: 2 }],
  shippingMethod: 'regular',
  paymentMethod: 'cod',
  customer: {
    name: 'Ibu Test',
    email: 'test@example.com',
    phone: '081234567890',
    address: 'Jalan Labu Nomor 123',
    city: 'Jakarta',
    postcode: '12345',
  },
};
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Promise.all([User.init(), Product.init(), Order.init()]);
  await Product.insertMany(products);
  app = createApp({
    jwtSecret: 'test-secret-that-is-long-and-random-enough',
    origins: ['http://localhost:5173'],
  });
  for (const [name, email, key] of [
    ['Ibu Test', 'test@example.com', 'customer'],
    ['Other User', 'other@example.com', 'other'],
    ['Admin User', 'admin@example.com', 'admin'],
  ]) {
    const res = await request(app).post('/api/auth/register').send({ name, email, password });
    assert.equal(res.status, 201);
    if (key === 'customer') customer = res.body.data.token;
    if (key === 'other') other = res.body.data.token;
    if (key === 'admin') {
      admin = res.body.data.token;
      await User.updateOne({ email }, { $set: { role: 'admin' } });
    }
  }
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
test('health and public catalog', async () => {
  assert.equal((await request(app).get('/health')).status, 200);
  const r = await request(app).get('/api/products');
  assert.equal(r.status, 200);
  assert.equal(r.body.data.length, products.length);
});
test('auth rejects bad credentials, role injection, and duplicate emails', async () => {
  assert.equal(
    (
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong-pass' })
    ).status,
    401,
  );
  assert.equal(
    (
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Attacker', email: 'attacker@example.com', password, role: 'admin' })
    ).status,
    400,
  );
  assert.equal(
    (
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Ibu Test', email: 'test@example.com', password })
    ).status,
    409,
  );
});
test('protected products enforce role, validation, and soft deletion', async () => {
  assert.equal((await request(app).post('/api/products').send(products[0])).status, 401);
  assert.equal(
    (await request(app).post('/api/products').set(auth(customer)).send(products[0])).status,
    403,
  );
  const body = { ...products[0], id: 'test-product' };
  assert.equal(
    (
      await request(app)
        .post('/api/products')
        .set(auth(admin))
        .send({ ...body, price: -5 })
    ).status,
    400,
  );
  assert.equal((await request(app).post('/api/products').set(auth(admin)).send(body)).status, 201);
  const updated = await request(app)
    .patch('/api/products/test-product')
    .set(auth(admin))
    .send({ price: 25000 });
  assert.equal(updated.body.data.price, 25000);
  assert.equal(
    (await request(app).delete('/api/products/test-product').set(auth(admin))).status,
    204,
  );
  assert.equal((await request(app).get('/api/products/test-product')).status, 404);
});
test('orders use server prices, are idempotent, and isolate user records', async () => {
  const key = randomUUID();
  const r = await request(app)
    .post('/api/orders')
    .set(auth(customer))
    .set('Idempotency-Key', key)
    .send(order);
  assert.equal(r.status, 201);
  assert.equal(r.body.data.total, 59000);
  const id = r.body.data._id;
  const repeat = await request(app)
    .post('/api/orders')
    .set(auth(customer))
    .set('Idempotency-Key', key)
    .send(order);
  assert.equal(repeat.body.data._id, id);
  const conflict = await request(app)
    .post('/api/orders')
    .set(auth(customer))
    .set('Idempotency-Key', key)
    .send({ ...order, shippingMethod: 'instant' });
  assert.equal(conflict.status, 409);
  assert.equal(await Order.countDocuments({}), 1);
  assert.equal((await request(app).get(`/api/orders/${id}`).set(auth(other))).status, 404);
  assert.equal(
    (
      await request(app)
        .patch(`/api/orders/${id}/status`)
        .set(auth(customer))
        .send({ status: 'shipped' })
    ).status,
    403,
  );
  assert.equal(
    (
      await request(app)
        .patch(`/api/orders/${id}/status`)
        .set(auth(admin))
        .send({ status: 'shipped' })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(app)
        .patch(`/api/orders/${id}/status`)
        .set(auth(admin))
        .send({ status: 'processing' })
    ).status,
    409,
  );
});
test('orders reject tampered price, unknown products, missing keys, and invalid quantity', async () => {
  for (const body of [
    {
      ...order,
      items: [{ productId: 'keripik-labu', variantId: 'keripik-original', quantity: 1, price: 1 }],
    },
    { ...order, items: [{ productId: 'missing-product', quantity: 1 }] },
    {
      ...order,
      items: [{ productId: 'keripik-labu', variantId: 'keripik-original', quantity: 0 }],
    },
  ])
    assert.equal(
      (
        await request(app)
          .post('/api/orders')
          .set(auth(customer))
          .set('Idempotency-Key', randomUUID())
          .send(body)
      ).status,
      400,
    );
  assert.equal(
    (await request(app).post('/api/orders').set(auth(customer)).send(order)).status,
    400,
  );
});
test('different variants stay separate and use their own server prices', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set(auth(other))
    .set('Idempotency-Key', randomUUID())
    .send({
      ...order,
      items: [
        { productId: 'keripik-labu', variantId: 'keripik-original', quantity: 1 },
        { productId: 'keripik-labu', variantId: 'keripik-keju', quantity: 1 },
      ],
    });
  assert.equal(response.status, 201);
  assert.equal(response.body.data.items.length, 2);
  assert.equal(response.body.data.total, 63000);
  assert.equal(response.body.data.items[1].variantName, 'Keju');
  assert.equal(response.body.data.items[1].price, 26000);
});
test('missing or unknown variants are rejected; fresh products cannot use regular shipping', async () => {
  for (const item of [
    { productId: 'keripik-labu', quantity: 1 },
    { productId: 'keripik-labu', variantId: 'does-not-exist', quantity: 1 },
    { productId: 'puding-labu', variantId: 'puding-original', quantity: 1 },
  ]) {
    const response = await request(app)
      .post('/api/orders')
      .set(auth(other))
      .set('Idempotency-Key', randomUUID())
      .send({ ...order, items: [item] });
    assert.equal(response.status, 400);
  }
  const fresh = await request(app)
    .post('/api/orders')
    .set(auth(other))
    .set('Idempotency-Key', randomUUID())
    .send({
      ...order,
      shippingMethod: 'instant',
      items: [{ productId: 'puding-labu', variantId: 'puding-original', quantity: 1 }],
    });
  assert.equal(fresh.status, 201);
  assert.equal(fresh.body.data.total, 43000);
});
test('user data excludes credentials, forbids role edits, and logout revokes token', async () => {
  const me = await request(app).get('/api/users/me').set(auth(customer));
  assert.equal(me.status, 200);
  assert.equal(me.body.data.passwordHash, undefined);
  assert.equal(
    (await request(app).patch('/api/users/me').set(auth(customer)).send({ role: 'admin' })).status,
    400,
  );
  const edit = await request(app)
    .patch('/api/users/me')
    .set(auth(customer))
    .send({ name: 'Updated Name' });
  assert.equal(edit.body.data.name, 'Updated Name');
  assert.equal((await request(app).get('/api/users').set(auth(customer))).status, 403);
  assert.equal((await request(app).post('/api/auth/logout').set(auth(customer))).status, 204);
  assert.equal((await request(app).get('/api/auth/me').set(auth(customer))).status, 401);
});
test('CORS rejects unapproved websites and permits native requests without Origin', async () => {
  assert.equal(
    (await request(app).get('/api/products').set('Origin', 'https://evil.example')).status,
    403,
  );
  assert.equal(
    (await request(app).get('/api/products').set('Origin', 'http://localhost:5173')).headers[
      'access-control-allow-origin'
    ],
    'http://localhost:5173',
  );
});
