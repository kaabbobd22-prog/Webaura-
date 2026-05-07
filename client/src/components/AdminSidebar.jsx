import { LayoutDashboard, Boxes, ShoppingBag, MessageSquareMore, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/custom-requests', label: 'Custom Requests', icon: MessageSquareMore },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="card-shell h-fit p-4 lg:sticky lg:top-24">
      <div className="mb-6 border-b border-white/10 px-3 pb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Admin</p>
        <h2 className="mt-2 text-xl font-bold text-white">Marketplace Control</h2>
      </div>
      <nav className="space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem('wm_admin_token');
          navigate('/admin/login');
        }}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/5"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
