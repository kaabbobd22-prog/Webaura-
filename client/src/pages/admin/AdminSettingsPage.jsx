import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Button from '../../components/Button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'WebLaunch Marketplace',
    logoUrl: '',
    contactEmail: '',
    heroTitle: '',
    heroDescription: '',
    stripePublishableKey: '',
    stripeSecretKeyHint: '',
    smtpHost: '',
    smtpUser: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then((res) => setSettings((current) => ({ ...current, ...(res.data.settings || {}) }))).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.put('/settings', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={submit} className="card-shell p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Settings</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Storefront and integration settings</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Site name</label>
          <input className="field" value={settings.siteName || ''} onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))} />
        </div>
        <div>
          <label className="label">Logo URL</label>
          <input className="field" value={settings.logoUrl || ''} onChange={(e) => setSettings((s) => ({ ...s, logoUrl: e.target.value }))} />
        </div>
        <div>
          <label className="label">Contact email</label>
          <input className="field" value={settings.contactEmail || ''} onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))} />
        </div>
        <div>
          <label className="label">Stripe publishable key</label>
          <input className="field" value={settings.stripePublishableKey || ''} onChange={(e) => setSettings((s) => ({ ...s, stripePublishableKey: e.target.value }))} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Hero title</label>
          <input className="field" value={settings.heroTitle || ''} onChange={(e) => setSettings((s) => ({ ...s, heroTitle: e.target.value }))} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Hero description</label>
          <textarea className="field min-h-24" value={settings.heroDescription || ''} onChange={(e) => setSettings((s) => ({ ...s, heroDescription: e.target.value }))} />
        </div>
        <div>
          <label className="label">SMTP host</label>
          <input className="field" value={settings.smtpHost || ''} onChange={(e) => setSettings((s) => ({ ...s, smtpHost: e.target.value }))} />
        </div>
        <div>
          <label className="label">SMTP user</label>
          <input className="field" value={settings.smtpUser || ''} onChange={(e) => setSettings((s) => ({ ...s, smtpUser: e.target.value }))} />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Button type="submit">Save Settings</Button>
        {saved && <p className="text-sm text-emerald-300">Settings saved.</p>}
      </div>
    </form>
  );
}
