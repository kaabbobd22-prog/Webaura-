import mongoose from 'mongoose';

// ১. প্রথমে সাব-স্কিমা (orderItemSchema) ডিফাইন করতে হবে
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

// ২. তারপর মেইন স্কিমা (orderSchema) ডিফাইন করতে হবে
const orderSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerPhone: String,
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'delivered', 'refunded'], 
    default: 'pending' 
  },
  paymentId: String,
  stripeSessionId: { type: String, unique: true, sparse: true },
  items: [orderItemSchema] // এখানে এখন orderItemSchema খুঁজে পাবে
}, { timestamps: true });

// ৩. একদম শেষে মডেলটি এক্সপোর্ট করতে হবে
const Order = mongoose.model('Order', orderSchema);
export default Order;