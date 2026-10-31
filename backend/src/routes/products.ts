import type { AuthAccess } from '../auth.ts';
import { Router } from 'express';
import { productSchema, updateProductSchema } from '@labuibu/contracts';
import { Product } from '../models.ts';
import { fail, page } from '../http.ts';

export function createProductsRouter({ auth, admin }: AuthAccess) {
  const router = Router();
  router.get('/', async (req, res) => {
    const filter = req.query.includeInactive === 'true' ? null : { active: true };
    if (!filter) {
      await new Promise<void>((resolve, reject) =>
        auth(req, res, (e) => (e ? reject(e) : resolve())),
      );
      if (req.user.role !== 'admin') throw fail(403, 'Akses khusus admin.');
    }
    const query: { active?: boolean; category?: string } = { ...(filter || {}) };
    if (typeof req.query.category === 'string') query.category = req.query.category;
    res.json({
      data: await Product.find(query)
        .sort({ createdAt: 1 })
        .skip(page(req).skip)
        .limit(page(req).limit),
    });
  });
  router.get('/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id, active: true });
    if (!product) throw fail(404, 'Produk tidak ditemukan.');
    res.json({ data: product });
  });
  router.post('/', auth, admin, async (req, res) =>
    res.status(201).json({ data: await Product.create(productSchema.parse(req.body)) }),
  );
  router.patch('/:id', auth, admin, async (req, res) => {
    const values = updateProductSchema.parse(req.body);
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: values },
      { new: true, runValidators: true },
    );
    if (!product) throw fail(404, 'Produk tidak ditemukan.');
    res.json({ data: product });
  });
  router.delete('/:id', auth, admin, async (req, res) => {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: { active: false } },
      { new: true },
    );
    if (!product) throw fail(404, 'Produk tidak ditemukan.');
    res.status(204).end();
  });
  return router;
}
