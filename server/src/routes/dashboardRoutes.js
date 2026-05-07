import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import CustomRequest from '../models/CustomRequest.js';

const router = Router();

router.get('/', requireAdmin, async (_req, res) => {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [orders, pendingRequests] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).limit(200),
    CustomRequest.countDocuments({ status: 'New' })
  ]);

  const revenueToday = orders.filter((order) => new Date(order.createdAt) >= dayStart).reduce((sum, order) => sum + order.total, 0);
  const revenueMonth = orders.filter((order) => new Date(order.createdAt) >= monthStart).reduce((sum, order) => sum + order.total, 0);
  const revenueAllTime = orders.reduce((sum, order) => sum + order.total, 0);

  const salesChart = Array.from({ length: 30 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    const total = orders.filter((order) => new Date(order.createdAt).toDateString() === date.toDateString()).reduce((sum, order) => sum + order.total, 0);
    return { date: date.toISOString(), label, total };
  });

  res.json({
    revenueToday,
    revenueMonth,
    revenueAllTime,
    totalOrders: orders.length,
    pendingRequests,
    recentOrders: orders.slice(0, 5),
    salesChart
  });
});

export default router;
