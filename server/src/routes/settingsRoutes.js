import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { getSettingsObject, upsertSettings } from '../utils/settings.js';

const router = Router();

router.get('/', requireAdmin, async (_req, res) => {
  const settings = await getSettingsObject();
  res.json({ settings });
});

router.get('/public', async (_req, res) => {
  const settings = await getSettingsObject();
  const safe = {
    siteName: settings.siteName,
    logoUrl: settings.logoUrl,
    contactEmail: settings.contactEmail,
    heroTitle: settings.heroTitle,
    heroDescription: settings.heroDescription,
    stripePublishableKey: settings.stripePublishableKey
  };
  res.json({ settings: safe });
});

router.put('/', requireAdmin, async (req, res) => {
  const settings = await upsertSettings(req.body);
  res.json({ settings });
});

export default router;
