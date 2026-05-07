import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Button from './Button';

export default function ProductCard({ product, compact = false }) {
  return (
    <article className="card-shell overflow-hidden">
      <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-56'} bg-slate-900`}>
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-cyan-500/40 to-indigo-600/40 text-3xl font-bold text-white">
            {product.title?.slice(0, 1) || 'W'}
          </div>
        )}
        <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-sm font-semibold text-cyan-300">
          ${Number(product.price || 0).toFixed(0)}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{product.category?.name || 'Website'}</p>
          <Link to={`/product/${product.slug}`} className="text-xl font-semibold text-white hover:text-cyan-300">
            {product.title}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm text-slate-300">{product.shortDescription || product.description}</p>
        </div>
        <div className="flex gap-3">
          <Link className="flex-1" to={`/product/${product.slug}`}>
            <Button className="w-full">View Details</Button>
          </Link>
          {product.demoUrl && (
            <a href={product.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 text-white hover:bg-white/10">
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
