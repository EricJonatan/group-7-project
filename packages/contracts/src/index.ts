import { z } from 'zod';
import { productCategories } from './catalog.ts';
const variantSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    name: z.string().trim().min(1).max(80),
    price: z.number().int().min(1000).max(10000000),
    ingredients: z.string().max(1500).optional(),
  })
  .strict();
export const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((v) => v.toLowerCase());
export const password = z.string().min(8, 'Kata sandi minimal 8 karakter.').max(128);
export const registerSchema = z
  .object({ name: z.string().trim().min(2).max(80), email, password })
  .strict();
export const loginSchema = z.object({ email, password }).strict();
export const profileSchema = z
  .object({ name: z.string().trim().min(2).max(80), email })
  .partial()
  .strict()
  .refine((v) => Object.keys(v).length > 0);
const image = z
  .string()
  .max(2000)
  .refine(
    (v) => /^\/images\/[a-z0-9._-]+$/i.test(v) || /^https:\/\//.test(v),
    'Gunakan URL HTTPS atau path /images/.',
  );
export const productSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    name: z.string().trim().min(2).max(120),
    category: z.enum(productCategories),
    price: z.number().int().min(1000).max(10000000),
    unit: z.string().trim().min(2).max(80),
    badge: z.string().trim().max(50).default('Buatan rumahan'),
    image,
    description: z.string().trim().min(10).max(3000),
    ingredients: z.string().trim().min(3).max(1500),
    storage: z.string().trim().min(3).max(1500),
    shippingClass: z.enum(['dry', 'fresh', 'chilled']).default('fresh'),
    shippingNote: z.string().max(1000).optional(),
    variants: z
      .array(variantSchema)
      .min(1)
      .max(20)
      .refine((v) => new Set(v.map((i) => i.id)).size === v.length, 'ID varian harus unik.')
      .optional(),
    active: z.boolean().default(true),
  })
  .strict();
export const updateProductSchema = productSchema
  .omit({ id: true })
  .partial()
  .strict()
  .refine((v) => Object.keys(v).length > 0);
export const customerSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email,
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s()-]{9,18}$/),
    address: z.string().trim().min(10).max(500),
    city: z.string().trim().min(2).max(100),
    postcode: z.string().regex(/^\d{5}$/),
    notes: z.string().trim().max(500).optional().default(''),
  })
  .strict();
export const orderSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            productId: z
              .string()
              .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
              .max(100),
            variantId: z
              .string()
              .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
              .max(100)
              .optional(),
            quantity: z.number().int().min(1).max(99),
          })
          .strict(),
      )
      .min(1)
      .max(30),
    shippingMethod: z.enum(['regular', 'instant']),
    paymentMethod: z.enum(['bank_transfer', 'cod']),
    customer: customerSchema,
  })
  .strict();
export const shippingPrices = { regular: 15000, instant: 25000 };
export const statusSchema = z
  .object({ status: z.enum(['processing', 'shipped', 'completed', 'cancelled']) })
  .strict();

export { demoBankAccount } from './payments.ts';

export { ZodError } from 'zod';
