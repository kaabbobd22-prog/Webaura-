import { Router } from 'express';
import Category from '../models/Category.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json({ categories });
});

router.post('/', requireAdmin, async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

export default router;
