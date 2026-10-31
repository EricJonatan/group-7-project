import 'dotenv/config';
export function getConfig(env = process.env) {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || env.JWT_SECRET.startsWith('replace-'))
    throw new Error('Set JWT_SECRET to a random value of at least 32 characters.');
  const origins = (env.CORS_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  if (env.NODE_ENV === 'production' && (!origins.length || origins.includes('*')))
    throw new Error('Production requires explicit CORS_ORIGINS.');
  return {
    mongoUri: env.MONGODB_URI,
    jwtSecret: env.JWT_SECRET,
    origins,
    production: env.NODE_ENV === 'production',
    trustProxy: env.TRUST_PROXY === '1',
    port: Number(env.PORT || 4000),
  };
}

export type ApiConfig = ReturnType<typeof getConfig>;
export type AppConfig = Pick<ApiConfig, 'jwtSecret' | 'origins'> & { trustProxy?: boolean };
