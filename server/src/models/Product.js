import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  thumbnail: String,
  gallery: [String],
  demoUrl: String,
  fileUrl: String,
  tags: [String],
  features: [String],
  techStack: [String],
  license: String,
  faq: String,
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
