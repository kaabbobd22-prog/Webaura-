import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminUser.findOne({ email: email?.toLowerCase() });

  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
});

export default router;
