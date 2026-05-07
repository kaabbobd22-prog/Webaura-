import { Router } from 'express';
import Stripe from 'stripe';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { sendOrderEmail } from '../utils/email.js';

const router = Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

router.post('/create-session', async (req, res) => {
  const { buyerName, buyerEmail, buyerPhone, items } = req.body;
  if (!buyerName || !buyerEmail || !items?.length) return res.status(400).json({ message: 'Missing checkout data' });

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, status: 'Published' });
  if (!products.length) return res.status(400).json({ message: 'No valid products found' });

  const stripe = getStripe();
  if (!stripe) return res.status(400).json({ message: 'Stripe is not configured yet' });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: buyerEmail,
    success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout`,
    metadata: {
      buyerName,
      buyerEmail,
      buyerPhone: buyerPhone || '',
      productIds: products.map((product) => String(product._id)).join(',')
    },
    line_items: products.map((product) => ({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(Number(product.price) * 100),
        product_data: {
          name: product.title,
          description: product.shortDescription
        }
      }
    }))
  });

  res.json({ url: session.url });
});

router.get('/confirm', async (req, res) => {
  const sessionId = req.query.session_id;
  if (!sessionId) return res.status(400).json({ message: 'session_id is required' });

  let order = await Order.findOne({ stripeSessionId: sessionId }).populate('items.product');
  if (order) return res.json({ order });

  const stripe = getStripe();
  if (!stripe) return res.status(400).json({ message: 'Stripe is not configured yet' });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') return res.status(400).json({ message: 'Payment not completed' });

  const productIds = session.metadata?.productIds?.split(',').filter(Boolean) || [];
  const products = await Product.find({ _id: { $in: productIds } });

  order = await Order.create({
    buyerName: session.metadata?.buyerName || 'Customer',
    buyerEmail: session.metadata?.buyerEmail || session.customer_email,
    buyerPhone: session.metadata?.buyerPhone || '',
    total: Number(session.amount_total || 0) / 100,
    status: 'paid',
    paymentId: session.payment_intent,
    stripeSessionId: session.id,
    items: products.map((product) => ({ product: product._id, title: product.title, price: product.price }))
  });

  order = await Order.findById(order._id).populate('items.product');
  await sendOrderEmail(order);
  res.json({ order });
});

export default router;
