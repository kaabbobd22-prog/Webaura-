import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Button from '../../components/Button';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');

  const load = () => api.get(`/orders${status ? `?status=${status}` : ''}`).then((res) => setOrders(res.data.orders || []));
  useEffect(() => { load(); }, [status]);

  return (
    <div className="card-shell p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Manage orders</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Paid, delivered, and refunded orders</h1>
        </div>
        <select className="field max-w-52" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Buyer</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-white/5 align-top">
                <td className="py-4">{order._id}</td>
                <td className="py-4">
                  <div className="font-semibold text-white">{order.buyerName}</div>
                  <div className="text-slate-400">{order.buyerEmail}</div>
                  <div className="mt-2 text-xs text-slate-500">{order.items?.map((item) => item.product?.title || item.title).join(', ')}</div>
                </td>
                <td className="py-4">${order.total}</td>
                <td className="py-4">{order.status}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={async () => { await api.patch(`/orders/${order._id}/status`, { status: 'delivered' }); load(); }}>Mark Delivered</Button>
                    <Button className="px-3 py-2 text-xs" onClick={async () => { await api.post(`/orders/${order._id}/resend-email`); alert('Email resend attempted.'); }}>Resend Link</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
