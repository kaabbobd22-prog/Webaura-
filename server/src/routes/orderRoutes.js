import { Router } from 'express';
import Order from '../models/Order.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendOrderEmail } from '../utils/email.js';

const router = Router();

// ১. সব অর্ডার দেখার রাউট (অ্যাডমিন)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ২. অর্ডারের স্ট্যাটাস আপডেট করার রাউট (পেন্ডিং থেকে পেইড/ডেলিভারড)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // ভ্যালিডেশন: স্ট্যাটাস পাঠানো হয়েছে কি না
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ order });
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// ৩. ইউজারকে পুনরায় ইমেইল পাঠানোর রাউট
router.post('/:id/resend-email', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ইমেইল পাঠানোর সময় এরর হ্যান্ডলিং
    try {
      await sendOrderEmail(order);
      res.json({ success: true, message: 'Email resent successfully' });
    } catch (emailError) {
      console.error('Email Resend Error:', emailError);
      res.status(500).json({ message: 'Order found, but failed to send email' });
    }

  } catch (error) {
    console.error('Resend Email Route Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;