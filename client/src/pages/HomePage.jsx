import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';

const trustPoints = [
  { icon: Zap, title: 'Instant delivery', text: 'Pay and immediately unlock your website files and setup guide.' },
  { icon: ShieldCheck, title: 'Source code included', text: 'Get complete project files so you can host, edit, and scale freely.' },
  { icon: LifeBuoy, title: '7-day support', text: 'Need help after purchase? You get direct support from the developer.' }
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?published=true&limit=8'),
      api.get('/categories'),
      api.get('/settings/public')
    ])
      .then(([productRes, categoryRes, settingsRes]) => {
        setProducts(productRes.data?.products || []);
        setCategories(categoryRes.data?.categories || []);
        setSettings(settingsRes.data?.settings || {});
      })
      .catch((err) => console.error("API Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div>
      {/* --- Simple & Clean Hero Section --- */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto max-w-4xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.4em] text-cyan-400">
              Premium Source Code Store
            </p>
            <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl lg:leading-[1.1]">
              {settings?.heroTitle || 'Launch Your Next Website Today'}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
              {settings?.heroDescription || 'High-quality, ready-made websites built for speed and conversion. Pick a template, get the code, and go live instantly.'}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Link to="/shop">
                <Button className="px-10 py-7 text-lg">Browse Catalog</Button>
              </Link>
              <Link to="/custom">
                <Button variant="secondary" className="px-10 py-7 text-lg">Custom Request</Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background element for "Gravy" feel */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_farthest-side_at_50%_0,rgba(34,211,238,0.08),transparent)]" />
      </section>

      {/* --- Featured Sections --- */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading 
          eyebrow="Featured" 
          title="Hand-picked templates" 
          description="Optimized for performance and clean architecture." 
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => <ProductCard key={product._id} product={product} compact />)}
        </div>
      </section>

      {/* --- Categories --- */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/5 bg-white/[0.02] p-8">
          <div>
            <h3 className="text-xl font-bold text-white">Browse by category</h3>
            <p className="text-sm text-slate-400 mt-1">Find the perfect style for your project</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link 
                key={category._id} 
                to={`/shop?category=${category.slug}`} 
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-cyan-400 hover:text-white hover:bg-cyan-400/5"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why Buy Section --- */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {trustPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-shell p-8 text-center md:text-left">
              <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-400">
                <Icon size={26} />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Custom Build Call-to-Action --- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 p-10 md:p-16 border border-white/5">
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">Custom Projects</p>
            <h3 className="mt-4 text-4xl font-black text-white md:text-5xl">Need something unique?</h3>
            <p className="mt-6 max-w-2xl text-lg text-slate-400">
              If our ready-made templates don't fit your needs, let's build a custom solution tailored to your vision.
            </p>
            <Link to="/custom" className="mt-10">
              <Button className="gap-3 px-8 py-6 text-base">
                Start a Custom Project <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
          {/* Subtle background glow */}
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>
      </section>
    </div>
  );
}