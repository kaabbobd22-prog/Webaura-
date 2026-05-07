import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { items } = useCart();
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-white">
          Web<span className="text-cyan-300">Launch</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/custom" className={navLinkClass}>Custom Website</NavLink>
          <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
        </nav>
        <Link to="/cart" className="relative rounded-full border border-white/10 p-3 text-white hover:bg-white/10">
          <ShoppingCart size={18} />
          {items.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
              {items.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
