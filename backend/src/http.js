import mongoose from 'mongoose';

export const fail = (status, message) => Object.assign(new Error(message), { status });
export const validId = (id) => mongoose.isValidObjectId(id);

export function page(req) {
  return {
    limit: Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30)),
    skip: Math.min(10000, Math.max(0, parseInt(req.query.skip, 10) || 0)),
  };
}

export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Periksa kembali data yang kamu masukkan.',
      errors: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email atau ID produk sudah digunakan.' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error('API error:', err.message);
  res.status(status).json({
    message: status >= 500 ? 'Server mengalami kendala. Coba lagi nanti.' : err.message,
  });
}
