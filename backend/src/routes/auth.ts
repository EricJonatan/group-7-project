import type { RequestHandler } from 'express';
import type { AuthAccess } from '../auth.ts';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '@labuibu/contracts';
import { User } from '../models.ts';
import { fail } from '../http.ts';

export function createAuthRouter({
  auth,
  authLimit,
  token,
}: AuthAccess & { authLimit: RequestHandler }) {
  const router = Router();
  router.post('/register', authLimit, async (req, res) => {
    const values = registerSchema.parse(req.body);
    const user = await User.create({
      ...values,
      password: undefined,
      passwordHash: await bcrypt.hash(values.password, 12),
    });
    res.status(201).json({ data: { user, token: token(user) } });
  });
  router.post('/login', authLimit, async (req, res) => {
    const values = loginSchema.parse(req.body);
    const user = await User.findOne({ email: values.email }).select('+passwordHash');
    const hash =
      user?.passwordHash || '$2b$12$Pc/0mjnV9DCv8rN.bph8MOO3O6TVCLL8j7JzOrISdpPfp54.gX2H6';
    if (!(await bcrypt.compare(values.password, hash)) || !user)
      throw fail(401, 'Email atau kata sandi salah.');
    res.json({ data: { user, token: token(user) } });
  });
  router.get('/me', auth, (req, res) => res.json({ data: { user: req.user } }));
  router.post('/logout', auth, async (req, res) => {
    await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
    res.status(204).end();
  });
  return router;
}
