import { Router } from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category, search, published, limit } = req.query;
  const query = {};

  if (published === 'true') query.status = 'Published';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
    ];
  }
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) query.category = categoryDoc._id;
  }

  let request = Product.find(query).populate('category').sort({ createdAt: -1 });
  if (limit) request = request.limit(Number(limit));
  const products = await request;
  res.json({ products });
});

router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

router.post('/', requireAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  const populated = await Product.findById(product._id).populate('category');
  res.status(201).json({ product: populated });
});

router.put('/:id', requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category');
  res.json({ product });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
