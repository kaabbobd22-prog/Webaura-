import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    Promise.all([
      api.get(`/products?published=true${category ? ` & category=${category}` : ''}${search ? ` & search=${encodeURIComponent(search)}` : ''}`),
      api.get('/categories')
    ])
      .then(([productRes, categoryRes]) => {
        setProducts(productRes.data.products || []);
        setCategories(categoryRes.data.categories || []);
      })
      .catch(() => { });
  }, [category, search]);

  const total = useMemo(() => products.length, [products]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading eyebrow="Shop" title="Browse every launch-ready website" description="Filter by category, search by keyword, and compare polished templates in one clean storefront." />
      <div className="card-shell mb-8 grid gap-4 p-5 md:grid-cols-[1fr_220px]">
        <input
          value={search}
          onChange={(e) => setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (e.target.value) next.set('search', e.target.value); else next.delete('search');
            return next;
          })}
          className="field"
          placeholder="Search by title, feature, or tech stack"
        />
        <select
          value={category}
          onChange={(e) => setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (e.target.value) next.set('category', e.target.value); else next.delete('category');
            return next;
          })}
          className="field"
        >
          <option value="">All categories</option>
          {categories.map((item) => <option key={item._id} value={item.slug}>{item.name}</option>)}
        </select>
      </div>
      <p className="mb-6 text-sm text-slate-400">Showing {total} result{total === 1 ? '' : 's'}</p>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </div>
  );
}
