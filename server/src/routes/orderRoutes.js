import { Router } from 'express';
import Order from '../models/Order.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendOrderEmail } from '../utils/email.js';

const router = Router();

router.get('/', requireAdmin, async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const orders = await Order.find(query).populate('items.product').sort({ createdAt: -1 });
  res.json({ orders });
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('items.product');
  res.json({ order });
});

router.post('/:id/resend-email', requireAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  await sendOrderEmail(order);
  res.json({ success: true });
});

export default router;
