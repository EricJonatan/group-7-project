import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);
userSchema.set('toJSON', {
  transform: (_doc, out) => {
    delete out.passwordHash;
    delete out.__v;
    delete out.tokenVersion;
    return out;
  },
});
export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model(
  'Product',
  new Schema(
    {
      id: { type: String, required: true, unique: true, index: true },
      name: String,
      category: String,
      price: Number,
      unit: String,
      badge: String,
      image: String,
      description: String,
      ingredients: String,
      storage: String,
      shippingClass: { type: String, default: 'fresh' },
      shippingNote: String,
      variants: [{ _id: false, id: String, name: String, price: Number, ingredients: String }],
      active: { type: Boolean, default: true },
    },
    { timestamps: true },
  ),
);
const itemSchema = new Schema(
  {
    productId: String,
    variantId: String,
    variantName: String,
    name: String,
    quantity: Number,
    price: Number,
  },
  { _id: false },
);
const customerSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postcode: String,
    notes: String,
  },
  { _id: false },
);
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [itemSchema],
    subtotal: Number,
    shipping: Number,
    total: Number,
    shippingMethod: String,
    paymentMethod: String,
    customer: customerSchema,
    status: {
      type: String,
      enum: ['processing', 'shipped', 'completed', 'cancelled'],
      default: 'processing',
    },
    idempotencyKey: { type: String, required: true },
    requestHash: { type: String, required: true },
  },
  { timestamps: true },
);
orderSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true });
export const Order = mongoose.model('Order', orderSchema);
