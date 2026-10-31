import type { Request, ErrorRequestHandler } from 'express';
import { ZodError } from '@labuibu/contracts';
import mongoose from 'mongoose';

export const fail = (status: number, message: string) =>
  Object.assign(new Error(message), { status });
export const validId = (id: unknown) => mongoose.isValidObjectId(id);

export function page(req: Request) {
  return {
    limit: Math.min(100, Math.max(1, parseInt(String(req.query.limit), 10) || 30)),
    skip: Math.min(10000, Math.max(0, parseInt(String(req.query.skip), 10) || 0)),
  };
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const err = error instanceof Error ? error : new Error('Unknown API error');
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Periksa kembali data yang kamu masukkan.',
      errors: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
  }
  if ('code' in err && err.code === 11000) {
    return res.status(409).json({ message: 'Email atau ID produk sudah digunakan.' });
  }
  const status = 'status' in err && typeof err.status === 'number' ? err.status : 500;
  if (status >= 500) console.error('API error:', err.message);
  res.status(status).json({
    message: status >= 500 ? 'Server mengalami kendala. Coba lagi nanti.' : err.message,
  });
};
