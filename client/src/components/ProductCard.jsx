import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Button from './Button';
import { formatPrice } from '../lib/utils'; // utils ইমপোর্ট করুন

export default function ProductCard({ product, compact = false }) {
  return (
    <article className="card-shell overflow-hidden h-full flex flex-col">
      <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-56'} bg-slate-900`}>
        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-cyan-500/40 to-indigo-600/40 text-3xl font-bold text-white">
            {product.title?.slice(0, 1) || 'W'}
          </div>
        )}
        
        {/* আপডেট করা প্রাইস ট্যাগ */}
        <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-sm font-semibold text-cyan-300 backdrop-blur-sm">
          {formatPrice(product.price || 0)}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            {product.category?.name || 'Website'}
          </p>
          <Link 
            to={`/product/${product.slug}`} 
            className="block text-xl font-semibold text-white hover:text-cyan-300 transition-colors"
          >
            {product.title}
          </Link>
          <p className="line-clamp-2 text-sm text-slate-300">
            {product.shortDescription || product.description}
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <Link className="flex-1" to={`/product/${product.slug}`}>
            <Button className="w-full">View Details</Button>
          </Link>
          {product.demoUrl && (
            <a 
              href={product.demoUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}