import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  type: { type: String, required: true },
  budget: { type: String, required: true },
  timeline: { type: String, required: true },
  description: { type: String, required: true },
  referenceLinks: String,
  status: { type: String, enum: ['New', 'Replied', 'Quoted', 'Won', 'Lost'], default: 'New' }
}, { timestamps: true });

export default mongoose.model('CustomRequest', customRequestSchema);
