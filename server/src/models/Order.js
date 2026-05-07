import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerPhone: String,
  total: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'delivered', 'refunded'], default: 'paid' },
  paymentId: String,
  stripeSessionId: { type: String, unique: true, sparse: true },
  items: [orderItemSchema]
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
