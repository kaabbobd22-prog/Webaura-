import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

/**
 * @route   POST /api/checkout
 * @desc    ম্যানুয়াল পেমেন্টের জন্য অর্ডার তৈরি করা
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { buyerName, buyerEmail, buyerPhone, items, totalAmount } = req.body;

    // ১. ভ্যালিডেশন চেক
    if (!buyerName || !buyerEmail || !items?.length) {
      return res.status(400).json({ message: 'Missing required order information.' });
    }

    // ২. ডাটাবেসে অর্ডার তৈরি
    const order = await Order.create({
      buyerName,
      buyerEmail,
      buyerPhone: buyerPhone || '',
      total: totalAmount,
      status: 'pending', // যেহেতু পেমেন্ট পরে হবে
      items: items.map(item => ({
        product: item.productId,
        title: item.title,
        price: item.price
      }))
    });

    // ৩. সফল রেসপন্স পাঠানো
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully!',
      orderId: order._id 
    });

  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ 
      message: error.message || 'Something went wrong while placing the order.' 
    });
  }
});

export default router;