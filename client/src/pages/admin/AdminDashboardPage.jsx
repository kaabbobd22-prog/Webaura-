import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setStats(res.data)).catch(() => { });
  }, []);

  const cards = [
    { label: 'Revenue today', value: `$${stats?.revenueToday || 0}` },
    { label: 'Revenue this month', value: `$${stats?.revenueMonth || 0}` },
    { label: 'All-time revenue', value: `$${stats?.revenueAllTime || 0}` },
    { label: 'Total orders', value: stats?.totalOrders || 0 },
    { label: 'Pending requests', value: stats?.pendingRequests || 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Dashboard</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Store performance at a glance</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="card-shell p-5">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-shell p-6">
          <h2 className="text-2xl font-bold text-white">Recent orders</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3">Buyer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentOrders || []).map((order) => (
                  <tr key={order._id} className="border-b border-white/5">
                    <td className="py-4">{order.buyerName}</td>
                    <td className="py-4">${order.total}</td>
                    <td className="py-4"><span className="rounded-full bg-white/5 px-3 py-1 text-xs">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-shell p-6">
          <h2 className="text-2xl font-bold text-white">30-day sales trend</h2>
          <div className="mt-6 flex h-72 items-end gap-3">
            {(stats?.salesChart || []).map((point) => (
              <div key={point.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-2xl bg-cyan-400/80" style={{ height: `${Math.max(point.total * 6, 8)}px` }} />
                <span className="text-[10px] text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
