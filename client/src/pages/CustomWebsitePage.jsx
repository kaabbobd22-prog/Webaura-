import { useState } from 'react';
import api from '../lib/api';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';

const steps = ['Brief', 'Quote', 'Design', 'Develop', 'Deliver'];

export default function CustomWebsitePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Business',
    budget: '৳20,000 - ৳50,000', // Updated initial state to BDT
    timeline: '2 - 4 weeks',
    description: '',
    referenceLinks: ''
  });
  const [sent, setSent] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/custom-requests', form);
    setSent(true);
    // Reset form with BDT default
    setForm({ 
      name: '', 
      email: '', 
      phone: '', 
      type: 'Business', 
      budget: '৳20,000 - ৳50,000', 
      timeline: '2 - 4 weeks', 
      description: '', 
      referenceLinks: '' 
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading 
        eyebrow="Custom websites" 
        title="Can’t find what you need? Let’s build it together." 
        description="Tell me what you’re launching, what budget you’re working with, and how quickly you need it delivered." 
      />
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="card-shell p-6">
            <h3 className="text-2xl font-bold text-white">My custom build process</h3>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{step}</p>
                    <p className="text-sm text-slate-400">Clear communication and lean execution from inquiry to handoff.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-shell p-6">
            <h3 className="text-2xl font-bold text-white">Suggested tiers</h3>
            <div className="mt-5 space-y-4 text-slate-300">
              <p><strong className="text-white">Starter</strong> — one-page websites and landing pages.</p>
              <p><strong className="text-white">Standard</strong> — small business websites with 4–8 pages.</p>
              <p><strong className="text-white">Premium</strong> — custom builds with dashboards, integrations, or content systems.</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="card-shell p-6">
          <h3 className="text-2xl font-bold text-white">Project request form</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="field" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="field" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Type of website</label>
              <select className="field" value={form.type} onChange={(e) => update('type', e.target.value)}>
                <option>Business</option>
                <option>Portfolio</option>
                <option>E-commerce</option>
                <option>Blog</option>
                <option>Landing Page</option>
              </select>
            </div>
            <div>
              <label className="label">Budget range (BDT)</label>
              <select className="field" value={form.budget} onChange={(e) => update('budget', e.target.value)}>
                <option>৳20,000 - ৳50,000</option>
                <option>৳50,000 - ৳1,00,000</option>
                <option>৳1,00,000 - ৳2,50,000</option>
                <option>৳2,50,000+</option>
              </select>
            </div>
            <div>
              <label className="label">Timeline</label>
              <select className="field" value={form.timeline} onChange={(e) => update('timeline', e.target.value)}>
                <option>1 - 2 weeks</option>
                <option>2 - 4 weeks</option>
                <option>1 - 2 months</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Project description</label>
              <textarea className="field min-h-36" value={form.description} onChange={(e) => update('description', e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Reference links</label>
              <textarea className="field min-h-24" value={form.referenceLinks} onChange={(e) => update('referenceLinks', e.target.value)} placeholder="Share inspiration or competitor links" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Button type="submit">Send Request</Button>
            {sent && <p className="text-sm text-emerald-300">Request sent successfully! I will contact you soon.</p>}
          </div>
        </form>
      </div>
    </div>
  );
}