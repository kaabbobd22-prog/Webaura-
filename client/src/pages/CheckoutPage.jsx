import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils'; // utils ইমপোর্ট করা হলো

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '', agree: false });

  if (!items.length && !isSuccess) return <Navigate to="/cart" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/checkout', {
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        buyerPhone: form.buyerPhone,
        items: items.map((item) => ({
          productId: item._id,
          price: item.price,
          title: item.title
        })),
        totalAmount: subtotal
      });

      setOrderId(response.data.orderId);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to process order.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 size={80} className="text-cyan-300" />
        </div>
        <h1 className="text-4xl font-black text-white">Order Received!</h1>
        <p className="mt-4 text-lg text-slate-300">
          Thank you, <span className="font-bold text-white">{form.buyerName}</span>.
          Your order has been placed successfully.
        </p>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Order Details</p>
          <div className="mt-4 space-y-2">
            <p className="text-slate-300">Order ID: <span className="text-white text-xs">{orderId}</span></p>
            <p className="text-slate-300">Email: <span className="text-white">{form.buyerEmail}</span></p>
            <p className="text-slate-300">Amount: <span className="text-white">{formatPrice(subtotal)}</span></p>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-sm italic text-slate-400">
              Note: As payment is not yet configured, our support agent will contact you soon for final delivery.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Link to="/shop">
            <Button>Continue Shopping <ArrowRight size={18} className="ml-2 inline" /></Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Checkout</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Confirm your order details</h1>
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
            Currently, we are accepting manual orders. Once you submit, our team will review and contact you for the source code delivery.
          </div>

          <label className="mt-6 flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={form.agree} onChange={(e) => setForm((s) => ({ ...s, agree: e.target.checked }))} required />
            I agree to the terms and digital delivery policy.
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
                <p className="font-semibold text-white">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-slate-300">Total</span>
            <span className="text-2xl font-black text-white">{formatPrice(subtotal)}</span>
          </div>
          <Button className="mt-6 w-full" type="submit" disabled={!form.agree || loading}>
            {loading ? 'Processing…' : `Confirm Order - ${formatPrice(subtotal)}`}
          </Button>
        </aside>
      </form>
    </div>
  );
}