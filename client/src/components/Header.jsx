import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react'; // Menu এবং X আইকন যোগ করা হয়েছে
import { useCart } from '../context/CartContext';

export default function Header() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // মোবাইল মেনুর স্টেট

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-white'
    }`;

  // মোবাইল মেনু ক্লোজ করার ফাংশন
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white" onClick={closeMenu}>
          Web<span className="text-cyan-300">Launch</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/custom" className={navLinkClass}>Custom Website</NavLink>
          <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
        </nav>

        {/* Right Actions (Cart & Mobile Menu Button) */}
        <div className="flex items-center gap-4">
          <Link 
            to="/cart" 
            className="relative rounded-full border border-white/10 p-3 text-white hover:bg-white/10"
            onClick={closeMenu}
          >
            <ShoppingCart size={18} />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
                {items.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="rounded-full border border-white/10 p-3 text-white hover:bg-white/10 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-slate-950/95 p-6 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-6">
            <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass} onClick={closeMenu}>Shop</NavLink>
            <NavLink to="/custom" className={navLinkClass} onClick={closeMenu}>Custom Website</NavLink>
            <NavLink to="/admin/dashboard" className={navLinkClass} onClick={closeMenu}>Admin</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}