import jwt from 'jsonwebtoken';
import { User } from './models.js';
import { fail, validId } from './http.js';
export function createAuth(config) {
  function token(user) {
    return jwt.sign({ ver: user.tokenVersion }, config.jwtSecret, {
      subject: String(user._id),
      issuer: 'labuibu-api',
      audience: 'labuibu',
      expiresIn: '1d',
      algorithm: 'HS256',
    });
  }
  async function auth(req, _res, next) {
    try {
      const raw = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!raw) throw fail(401, 'Silakan masuk terlebih dahulu.');
      const payload = jwt.verify(raw, config.jwtSecret, {
        algorithms: ['HS256'],
        issuer: 'labuibu-api',
        audience: 'labuibu',
      });
      if (!validId(payload.sub)) throw fail(401, 'Sesi tidak valid.');
      const user = await User.findById(payload.sub);
      if (!user || payload.ver !== user.tokenVersion)
        throw fail(401, 'Sesi berakhir. Silakan masuk lagi.');
      req.user = user;
      next();
    } catch (err) {
      next(err.status ? err : fail(401, 'Sesi berakhir. Silakan masuk lagi.'));
    }
  }
  function admin(req, _res, next) {
    next(req.user.role === 'admin' ? undefined : fail(403, 'Akses khusus admin.'));
  }
  return { auth, admin, token };
}
