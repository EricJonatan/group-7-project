import type { AuthAccess } from '../auth.ts';
import { orderStatusTransitions } from '@labuibu/contracts/commerce';
import { Router } from 'express';
import { createHash } from 'node:crypto';
import { orderSchema, shippingPrices, statusSchema } from '@labuibu/contracts';
import { Product, Order } from '../models.ts';
import { fail, page, validId } from '../http.ts';

export function createOrdersRouter({ auth, admin }: AuthAccess) {
  const router = Router();
  router.post('/', auth, async (req, res) => {
    const values = orderSchema.parse(req.body);
    const key = req.headers['idempotency-key'];
    if (typeof key !== 'string' || !/^[a-zA-Z0-9-]{16,100}$/.test(key))
      throw fail(400, 'Idempotency-Key diperlukan.');
    const requestHash = createHash('sha256').update(JSON.stringify(values)).digest('hex');
    const existing = await Order.findOne({ userId: req.user._id, idempotencyKey: key });
    if (existing) {
      if (existing.requestHash !== requestHash)
        throw fail(409, 'Kunci pesanan sudah dipakai untuk pesanan lain.');
      return res.json({ data: existing });
    }
    const ids = [...new Set(values.items.map((i) => i.productId))];
    const lineIds = values.items.map((i) => `${i.productId}:${i.variantId || ''}`);
    if (new Set(lineIds).size !== lineIds.length) throw fail(400, 'Produk duplikat pada pesanan.');
    const products = await Product.find({ id: { $in: ids }, active: true });
    if (products.length !== ids.length)
      throw fail(400, 'Ada produk yang tidak tersedia. Perbarui keranjangmu.');
    const productById = new Map(products.map((product) => [product.id, product]));
    const items = values.items.map((i) => {
      const p = productById.get(i.productId);
      if (!p) throw fail(400, 'Ada produk yang tidak tersedia. Perbarui keranjangmu.');
      const variant = p.variants?.find((v) => v.id === i.variantId);
      if ((p.variants?.length && !variant) || (!p.variants?.length && i.variantId))
        throw fail(400, 'Varian tidak tersedia. Pilih ulang varian produk.');
      return {
        productId: p.id,
        variantId: variant?.id,
        variantName: variant?.name,
        name: variant ? `${p.name} — ${variant.name}` : p.name,
        quantity: i.quantity,
        price: variant?.price ?? p.price,
      };
    });
    if (values.shippingMethod === 'regular' && products.some((p) => p.shippingClass !== 'dry'))
      throw fail(
        400,
        'Produk segar atau dingin hanya tersedia untuk pengiriman lokal hari yang sama.',
      );
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
    const shipping = shippingPrices[values.shippingMethod];
    try {
      const order = await Order.create({
        ...values,
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        userId: req.user._id,
        idempotencyKey: key,
        requestHash,
      });
      res.status(201).json({ data: order });
    } catch (err) {
      if (!(err && typeof err === 'object' && 'code' in err && err.code === 11000)) throw err;
      const order = await Order.findOne({ userId: req.user._id, idempotencyKey: key });
      if (!order || order.requestHash !== requestHash)
        throw fail(409, 'Kunci pesanan sudah dipakai.');
      res.json({ data: order });
    }
  });
  router.get('/', auth, async (req, res) => {
    const filter =
      req.user.role === 'admin' && req.query.all === 'true' ? {} : { userId: req.user._id };
    res.json({
      data: await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(page(req).skip)
        .limit(page(req).limit),
    });
  });
  router.get('/:id', auth, async (req, res) => {
    if (!validId(req.params.id)) throw fail(404, 'Pesanan tidak ditemukan.');
    const order = await Order.findOne({
      _id: req.params.id,
      ...(req.user.role === 'admin' ? {} : { userId: req.user._id }),
    });
    if (!order) throw fail(404, 'Pesanan tidak ditemukan.');
    res.json({ data: order });
  });
  router.patch('/:id/status', auth, admin, async (req, res) => {
    if (!validId(req.params.id)) throw fail(404, 'Pesanan tidak ditemukan.');
    const { status } = statusSchema.parse(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) throw fail(404, 'Pesanan tidak ditemukan.');
    if (!orderStatusTransitions[order.status].includes(status))
      throw fail(409, 'Perubahan status tidak diizinkan.');
    const updated = await Order.findOneAndUpdate(
      { _id: order._id, status: order.status },
      { $set: { status } },
      { new: true },
    );
    if (!updated) throw fail(409, 'Status telah berubah. Muat ulang pesanan.');
    res.json({ data: updated });
  });
  return router;
}
