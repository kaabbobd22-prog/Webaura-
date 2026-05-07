import { Router } from 'express';
import CustomRequest from '../models/CustomRequest.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendCustomRequestAlert } from '../utils/email.js';

const router = Router();

router.post('/', async (req, res) => {
  const request = await CustomRequest.create(req.body);
  await sendCustomRequestAlert(request);
  res.status(201).json({ request });
});

router.get('/', requireAdmin, async (_req, res) => {
  const requests = await CustomRequest.find({}).sort({ createdAt: -1 });
  res.json({ requests });
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const request = await CustomRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ request });
});

export default router;
