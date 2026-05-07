import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '', agree: false });

  if (!items.length) return <Navigate to="/cart" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/checkout/create-session', {
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        buyerPhone: form.buyerPhone,
        items: items.map((item) => ({ productId: item._id }))
      });
      window.location.href = response.data.url;
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to start checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Checkout</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Fast, minimal, and ready for payment</h1>
      </div>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card-shell p-6">
          <h2 className="text-2xl font-bold text-white">Buyer information</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="field" required value={form.buyerName} onChange={(e) => setForm((s) => ({ ...s, buyerName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="field" type="email" required value={form.buyerEmail} onChange={(e) => setForm((s) => ({ ...s, buyerEmail: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Phone</label>
              <input className="field" value={form.buyerPhone} onChange={(e) => setForm((s) => ({ ...s, buyerPhone: e.target.value }))} />
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
            Payment is handled through Stripe Checkout. After payment, the success page confirms your order and reveals download links.
          </div>
          <label className="mt-6 flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={form.agree} onChange={(e) => setForm((s) => ({ ...s, agree: e.target.checked }))} required />
            I agree to the terms, digital delivery policy, and support window.
          </label>
        </div>
        <aside className="card-shell h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-white">Order summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-400">Source code + docs</p>
                </div>
                <p className="font-semibold text-white">${Number(item.price).toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-slate-300">Total</span>
            <span className="text-2xl font-black text-white">${subtotal.toFixed(0)}</span>
          </div>
          <Button className="mt-6 w-full" type="submit" disabled={!form.agree || loading}>
            {loading ? 'Redirecting…' : `Pay $${subtotal.toFixed(0)}`}
          </Button>
        </aside>
      </form>
    </div>
  );
}
