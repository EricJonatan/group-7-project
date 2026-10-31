import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { products } from '@labuibu/contracts/catalog';
import { registerSchema, productSchema } from '@labuibu/contracts';
import { getConfig } from './config.ts';
import { Product, User, Order } from './models.ts';
const config = getConfig();
await mongoose.connect(config.mongoUri);
try {
  await Promise.all([Product.init(), User.init(), Order.init()]);
  const refresh = process.argv.includes('--refresh-catalog');
  for (const p of products) {
    const values = productSchema.parse(p);
    await Product.updateOne({ id: p.id }, refresh ? { $set: values } : { $setOnInsert: values }, {
      upsert: true,
    });
  }
  if (refresh)
    await Product.updateMany(
      {
        id: {
          $in: [
            'keripik-original',
            'keripik-balado',
            'keripik-keju',
            'keripik-rumput-laut',
            'donat-gula',
            'donat-kayu-manis',
            'donat-cokelat',
            'donat-kacang',
            'bolu-labu-pandan',
            'muffin-labu-oat',
            'paket-berbagi',
          ],
        },
      },
      { $set: { active: false } },
    );
  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const values = registerSchema.parse({
      name: 'Admin Labuibu',
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
    });
    if (!(await User.exists({ email: values.email }))) {
      await User.create({
        name: values.name,
        email: values.email,
        passwordHash: await bcrypt.hash(values.password, 12),
        role: 'admin',
      });
      console.log('Admin created. Remove seed credentials from the environment after use.');
    } else console.log('Existing account preserved; role and password were not changed.');
  }
  console.log('Catalog seeded. Existing product edits were preserved.');
} finally {
  await mongoose.disconnect();
}
