import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db';
import User from './models/User';
import Product from './models/Product';

const sampleProducts = [
  {
    name: 'Keripik Labu',
    description: 'Keripik labu kuning beririsan tipis dan renyah dengan bumbu rempah pilihan.',
    price: 22000,
    image: '/images/chips-table.jpg',
    category: 'Keripik',
    stock: 50,
  },
  {
    name: 'Donat Labu',
    description: 'Donat labu lembut isi 6 pcs dengan berbagai varian topping lezat.',
    price: 30000,
    image: '/images/donuts.jpg',
    category: 'Donat',
    stock: 30,
  },
  {
    name: 'Bolu Labu',
    description: 'Bolu labu panggang aroma rempah kayu manis yang lembut dan legit.',
    price: 45000,
    image: '/images/cake.jpg',
    category: 'Bolu',
    stock: 20,
  },
  {
    name: 'Kukis Labu',
    description: 'Kukis renyah berbahan labu asli dengan choco chips yang manis gurih.',
    price: 25000,
    image: '/images/cookies.jpg',
    category: 'Kukis',
    stock: 40,
  },
  {
    name: 'Brownies Labu',
    description: 'Fudgy brownies cokelat pekat dipadu pure labu kuning lembut.',
    price: 38000,
    image: '/images/brownies.jpg',
    category: 'Brownies',
    stock: 25,
  },
  {
    name: 'Muffin Labu',
    description: 'Muffin labu kuning empuk isi butiran berry dan taburan gula palem.',
    price: 28000,
    image: '/images/muffin-tray.jpg',
    category: 'Muffin',
    stock: 35,
  },
  {
    name: 'Puding Labu',
    description: 'Puding sutra labu segar dengan saus fla karamel manis lembut.',
    price: 18000,
    image: '/images/pudding-cup.jpg',
    category: 'Puding',
    stock: 30,
  },
  {
    name: 'Biji Labu Panggang',
    description: 'Biji labu panggang gurih tanpa minyak, kaya serat dan camilan sehat.',
    price: 20000,
    image: '/images/seeds.jpg',
    category: 'Camilan Sehat',
    stock: 60,
  },
  {
    name: 'Pie Labu',
    description: 'Pie labu khas dengan kulit pie renyah dan filling labu custard lembut.',
    price: 55000,
    image: '/images/pie-plate.jpg',
    category: 'Pie',
    stock: 15,
  },
  {
    name: 'Klepon Labu',
    description: 'Klepon kenyal berbahan labu asli dengan isian gula merah lumer dan kelapa parut.',
    price: 15000,
    image: '/images/klepon.jpg',
    category: 'Tradisional',
    stock: 40,
  },
];

const seed = async (): Promise<void> => {
  try {
    await connectDB();

    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@marketplace.com').toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';

    // Start from scratch: wipe the two collections we manage.
    await Promise.all([Product.deleteMany({}), User.deleteMany({})]);
    console.log('Koleksi products & users dikosongkan.');

    // Seed a demo admin user.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    const admin = await User.create({
      name: 'Admin Group 7',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    // Seed products owned by the demo admin.
    await Product.insertMany(sampleProducts.map((p) => ({ ...p, createdBy: admin._id })));

    console.log(`Seed selesai: 1 admin + ${sampleProducts.length} produk Labuibu asli.`);
    console.log(`Login demo -> email: ${adminEmail} | password: ${adminPassword}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Seed error:', message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
