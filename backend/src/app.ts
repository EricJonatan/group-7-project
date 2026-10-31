import type { AppConfig } from './config.ts';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { createAuth } from './auth.ts';
import { fail, errorHandler } from './http.ts';
import { createAuthRouter } from './routes/auth.ts';
import { createProductsRouter } from './routes/products.ts';
import { createUsersRouter } from './routes/users.ts';
import { createOrdersRouter } from './routes/orders.ts';

const rateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
};

export function createApp(config: AppConfig) {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(
          origin && !config.origins.includes(origin) ? fail(403, 'Origin tidak diizinkan.') : null,
          true,
        ),
    }),
  );
  app.use(express.json({ limit: '64kb' }));
  app.use(
    '/api',
    rateLimit({
      ...rateLimitOptions,
      limit: 500,
      message: { message: 'Terlalu banyak permintaan. Coba beberapa saat lagi.' },
    }),
  );
  app.get('/health', (_req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable' });
  });
  const access = createAuth(config);
  const authLimit = rateLimit({
    ...rateLimitOptions,
    limit: 30,
    message: { message: 'Terlalu banyak percobaan masuk. Coba beberapa saat lagi.' },
  });
  app.use('/api/auth', createAuthRouter({ ...access, authLimit }));
  app.use('/api/products', createProductsRouter(access));
  app.use('/api/users', createUsersRouter(access));
  app.use('/api/orders', createOrdersRouter(access));
  app.use((_req, _res, next) => next(fail(404, 'Endpoint tidak ditemukan.')));
  app.use(errorHandler);
  return app;
}
