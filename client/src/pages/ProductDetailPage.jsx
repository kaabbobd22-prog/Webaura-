import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/slug/${slug}`).then((res) => setProduct(res.data.product)).catch(() => setProduct(null));
  }, [slug]);

  if (!product) {
    return <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-300">Loading product details…</div>;
  }

  const receiveList = ['Source code (.zip)', 'Setup docs', '7-day support'];
  const tabs = {
    overview: product.description,
    features: (product.features || []).join('\n• '),
    tech: (product.techStack || []).join(', '),
    license: product.license || 'Single-purchase license for one business or client deployment.',
    faq: product.faq || 'Need a custom tweak after purchase? Reach out during your support window.'
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="card-shell overflow-hidden">
            <div className="grid gap-3 p-3 md:grid-cols-2">
              {[product.thumbnail, ...(product.gallery || [])].filter(Boolean).map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${product.title} preview ${index + 1}`} className={`w-full rounded-2xl object-cover ${index === 0 ? 'md:col-span-2 h-[420px]' : 'h-56'}`} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {product.demoUrl && (
              <a href={product.demoUrl} target="_blank" rel="noreferrer">
                <Button className="gap-2"><ExternalLink size={18} /> Launch Live Demo</Button>
              </a>
            )}
            <Link to="/custom"><Button variant="secondary">Need this customized?</Button></Link>
          </div>
          <div className="card-shell p-6">
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {['overview', 'features', 'tech', 'license', 'faq'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}>
                  {tab === 'tech' ? 'Tech Stack' : tab}
                </button>
              ))}
            </div>
            <div className="mt-5 whitespace-pre-line text-slate-300">{tabs[activeTab] || 'No details added yet.'}</div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card-shell space-y-5 p-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">{product.category?.name || 'Website'}</p>
              <h1 className="text-4xl font-bold text-white">{product.title}</h1>
              <p className="mt-3 text-slate-300">{product.shortDescription}</p>
            </div>
            <div className="text-4xl font-black text-white">${Number(product.price || 0).toFixed(0)}</div>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => addItem(product)}>Add to Cart</Button>
              <Button className="w-full" variant="secondary" onClick={() => { addItem(product); navigate('/checkout'); }}>Buy Now</Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="mb-4 text-sm font-semibold text-white">What you’ll receive</p>
              <div className="space-y-3">
                {receiveList.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="text-cyan-300" size={18} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Tags</p>
              <div className="flex flex-wrap gap-2">
                {(product.tags || []).map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{tag}</span>)}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
