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
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হয়েছে

  useEffect(() => {
    // ডাটা ফেচিং শুরু
    Promise.all([
      api.get('/products?published=true&limit=8'),
      api.get('/categories'),
      api.get('/settings/public')
    ])
      .then(([productRes, categoryRes, settingsRes]) => {
        // ডাটা সেট করার সময় সেফটি চেক
        setProducts(productRes.data?.products || []);
        setCategories(categoryRes.data?.categories || []);
        setSettings(settingsRes.data?.settings || {});
      })
      .catch((err) => {
        console.error("API Fetch Error:", err); // এরর কনসোলে দেখা যাবে
      })
      .finally(() => {
        setLoading(false); // লোডিং শেষ
      });
  }, []);

  const featured = products.slice(0, 4);

  // যদি ডাটা লোড হতে সময় নেয় বা না আসে, তবে ডিজাইন ভেঙে যাওয়া রোধ করবে
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Single-vendor storefront</p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white md:text-6xl">
            {settings?.heroTitle || 'Ready-Made Websites You Can Launch Today'}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {settings?.heroDescription || 'A focused marketplace for polished websites built by one creator. Preview live demos, purchase source code, and launch faster.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop"><Button>Browse Websites</Button></Link>
            <Link to="/custom"><Button variant="secondary">Request a Custom Build</Button></Link>
          </div>
        </div>
        <div className="card-shell p-5">
          <div className="grid gap-4 md:grid-cols-2">
             {/* ম্যাপ করার আগে চেক করা হচ্ছে products আছে কি না */}
            {featured.length > 0 ? (
              featured.map((product) => <ProductCard key={product._id} product={product} compact />)
            ) : (
              !loading && <p className="text-slate-400">No featured products found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeading eyebrow="Featured websites" title="Hand-picked launch-ready templates" description="Fast-loading designs across business, portfolio, e-commerce, blog, and landing page categories." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => <ProductCard key={product._id} product={product} compact />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeading eyebrow="Categories" title="Jump straight to the style you need" />
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link key={category._id} to={`/shop?category=${category.slug}`} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 hover:border-cyan-300 hover:text-white">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeading eyebrow="Catalog" title="All websites" description="Twelve-column friendly catalog cards, optimized for quick scanning and confident buying." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      {/* Trust Points and Custom Build sections remain unchanged as they don't depend on API data directly in a way that breaks layout */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeading eyebrow="Why buy from me" title="A lean storefront built around trust and speed" />
        <div className="grid gap-6 md:grid-cols-3">
          {trustPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-shell p-6">
              <div className="mb-4 inline-flex rounded-2xl bg-cyan-400/15 p-3 text-cyan-300"><Icon size={22} /></div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="card-shell flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Custom builds</p>
            <h3 className="mt-3 text-3xl font-bold text-white">Need something unique?</h3>
            <p className="mt-3 max-w-2xl text-slate-300">Share your scope, budget, and timeline. I’ll review your request and send a tailored quote.</p>
          </div>
          <Link to="/custom" className="inline-flex items-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-300">
            Request a custom website <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}