import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { ensureDefaultAdmin, ensureSeedData } from './utils/bootstrap.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Webaura API! Server is running smoothly." });
});
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

async function start() {
  await connectDB();
  await ensureDefaultAdmin();
  await ensureSeedData();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to boot server', error);
  process.exit(1);
});
