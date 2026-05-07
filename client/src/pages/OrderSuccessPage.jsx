import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    api.get(`/checkout/confirm?session_id=${sessionId}`)
      .then((res) => {
        setOrder(res.data.order);
        clearCart();
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [sessionId, clearCart]);

  if (loading) {
    return <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-300">Confirming your order…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="card-shell p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Order success</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Thanks for your purchase</h1>
        <p className="mt-4 text-slate-300">Your order is confirmed. Download links are listed below, and a confirmation email can be sent when SMTP is configured.</p>
        {order ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-left">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order ID</p>
                <p className="mt-2 text-lg font-semibold text-white">{order._id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Buyer email</p>
                <p className="mt-2 text-lg font-semibold text-white">{order.buyerEmail}</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {order.items?.map((item) => (
                <div key={item.product?._id || item._id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.product?.title || 'Purchased website'}</h3>
                      <p className="mt-2 text-sm text-slate-400">{item.product?.shortDescription}</p>
                    </div>
                    {item.product?.fileUrl ? (
                      <a href={item.product.fileUrl} target="_blank" rel="noreferrer"><Button>Download ZIP</Button></a>
                    ) : (
                      <span className="text-sm text-amber-300">Add a file URL in admin before delivery.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-amber-300">No Stripe session was found. If you arrived here manually, use the email confirmation flow instead.</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/shop"><Button variant="secondary">Continue Shopping</Button></Link>
          <Link to="/custom"><Button>Request a Custom Build</Button></Link>
        </div>
      </div>
    </div>
  );
}
