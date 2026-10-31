import mongoose from 'mongoose';
import { getConfig } from './config.ts';
import { createApp } from './app.ts';
import { User, Product, Order } from './models.ts';
const config = getConfig();
await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
await Promise.all([User.init(), Product.init(), Order.init()]);
const server = createApp(config).listen(config.port, () =>
  console.log(`Labuibu API listening on port ${config.port}`),
);
async function stop() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
