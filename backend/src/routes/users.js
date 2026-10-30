import { Router } from 'express';
import { profileSchema } from '@labuibu/contracts';
import { User, Order } from '../models.js';
import { fail, page, validId } from '../http.js';

export function createUsersRouter({ auth, admin }) {
  const router = Router();
  router.get('/me', auth, (req, res) => res.json({ data: req.user }));
  router.patch('/me', auth, async (req, res) => {
    const values = profileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: values },
      { new: true, runValidators: true },
    );
    res.json({ data: user });
  });
  router.delete('/me', auth, async (req, res) => {
    if (req.user.role === 'admin')
      throw fail(403, 'Akun admin tidak dapat dihapus melalui endpoint ini.');
    await Order.deleteMany({ userId: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    res.status(204).end();
  });
  router.get('/', auth, admin, async (req, res) =>
    res.json({
      data: await User.find().sort({ createdAt: -1 }).skip(page(req).skip).limit(page(req).limit),
    }),
  );
  router.delete('/:id', auth, admin, async (req, res) => {
    if (!validId(req.params.id)) throw fail(404, 'Pengguna tidak ditemukan.');
    const user = await User.findById(req.params.id);
    if (!user) throw fail(404, 'Pengguna tidak ditemukan.');
    if (user.role === 'admin') throw fail(403, 'Akun admin dilindungi.');
    await Order.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.status(204).end();
  });
  return router;
}
