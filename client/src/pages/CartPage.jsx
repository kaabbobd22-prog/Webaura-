import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils'; // utils ইমপোর্ট করা হলো

export default function CartPage() {
  const { items, removeItem, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Cart</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Review your selected websites</h1>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="card-shell p-10 text-center">
          <h2 className="text-2xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-3 text-slate-300">Browse the catalog and add a website to continue.</p>
          <Link to="/shop" className="mt-6 inline-flex">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="card-shell flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-900">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 line-clamp-1 text-sm text-slate-300">{item.shortDescription}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-5 md:justify-end">
                  {/* আপডেট করা আইটেম প্রাইস */}
                  <div className="text-2xl font-bold text-white">
                    {formatPrice(item.price || 0)}
                  </div>
                  <Button variant="secondary" onClick={() => removeItem(item._id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <aside className="card-shell h-fit p-6 lg:sticky lg:top-24">
            <h3 className="text-2xl font-bold text-white">Order summary</h3>
            
            {/* আপডেট করা সাব-টোটাল */}
            <div className="mt-6 flex items-center justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="text-xl font-bold text-white">
                {formatPrice(subtotal)}
              </span>
            </div>
            
            <div className="mt-6 space-y-3">
              <Link to="/shop" className="block">
                <Button variant="secondary" className="w-full">Continue Shopping</Button>
              </Link>
              <Link to="/checkout" className="block">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}