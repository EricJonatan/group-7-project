import type { RequestHandler } from 'express';
import type { AppConfig } from './config.ts';
import type { UserDocument } from './models.ts';
import jwt from 'jsonwebtoken';
import { User } from './models.ts';
import { fail, validId } from './http.ts';
export function createAuth(config: AppConfig) {
  function token(user: Pick<UserDocument, '_id' | 'tokenVersion'>) {
    return jwt.sign({ ver: user.tokenVersion }, config.jwtSecret, {
      subject: String(user._id),
      issuer: 'labuibu-api',
      audience: 'labuibu',
      expiresIn: '1d',
      algorithm: 'HS256',
    });
  }
  const auth: RequestHandler = async (req, _res, next) => {
    try {
      const raw = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!raw) throw fail(401, 'Silakan masuk terlebih dahulu.');
      const payload = jwt.verify(raw, config.jwtSecret, {
        algorithms: ['HS256'],
        issuer: 'labuibu-api',
        audience: 'labuibu',
      });
      if (typeof payload === 'string' || !validId(payload.sub))
        throw fail(401, 'Sesi tidak valid.');
      const user = await User.findById(payload.sub);
      if (!user || payload.ver !== user.tokenVersion)
        throw fail(401, 'Sesi berakhir. Silakan masuk lagi.');
      req.user = user;
      next();
    } catch (err) {
      next(
        err instanceof Error && 'status' in err
          ? err
          : fail(401, 'Sesi berakhir. Silakan masuk lagi.'),
      );
    }
  };
  const admin: RequestHandler = (req, _res, next) => {
    next(req.user.role === 'admin' ? undefined : fail(403, 'Akses khusus admin.'));
  };
  return { auth, admin, token };
}

export type AuthAccess = ReturnType<typeof createAuth>;
declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
