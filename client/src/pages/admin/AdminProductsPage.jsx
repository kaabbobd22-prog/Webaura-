import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Button from '../../components/Button';

const initialForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  category: '',
  thumbnail: '',
  gallery: '',
  demoUrl: '',
  fileUrl: '',
  tags: '',
  features: '',
  techStack: '',
  status: 'Published'
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const load = () => {
    Promise.all([api.get('/products'), api.get('/categories')]).then(([productRes, categoryRes]) => {
      setProducts(productRes.data.products || []);
      setCategories(categoryRes.data.categories || []);
      if (!form.category && categoryRes.data.categories?.[0]?._id) {
        setForm((current) => ({ ...current, category: categoryRes.data.categories[0]._id }));
      }
    });
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      gallery: form.gallery ? form.gallery.split(',').map((v) => v.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(',').map((v) => v.trim()).filter(Boolean) : [],
      features: form.features ? form.features.split('\n').map((v) => v.trim()).filter(Boolean) : [],
      techStack: form.techStack ? form.techStack.split(',').map((v) => v.trim()).filter(Boolean) : []
    };

    if (editingId) await api.put(`/products/${editingId}`, payload);
    else await api.post('/products', payload);

    setEditingId(null);
    setForm(initialForm);
    load();
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      slug: product.slug,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price,
      category: product.category?._id || product.category,
      thumbnail: product.thumbnail || '',
      gallery: (product.gallery || []).join(', '),
      demoUrl: product.demoUrl || '',
      fileUrl: product.fileUrl || '',
      tags: (product.tags || []).join(', '),
      features: (product.features || []).join('\n'),
      techStack: (product.techStack || []).join(', '),
      status: product.status || 'Published'
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card-shell p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Manage products</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Website listings</h1>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3">Title</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-white/5">
                  <td className="py-4">{product.title}</td>
                  <td className="py-4">${product.price}</td>
                  <td className="py-4">{product.status}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => edit(product)}>Edit</Button>
                      <Button variant="danger" className="px-3 py-2 text-xs" onClick={async () => { await api.delete(`/products/${product._id}`); load(); }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <form onSubmit={submit} className="card-shell p-6">
        <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit website' : 'Add website'}</h2>
        <div className="mt-6 grid gap-4">
          <input className="field" placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
          <input className="field" placeholder="Slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} required />
          <textarea className="field min-h-24" placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))} required />
          <textarea className="field min-h-32" placeholder="Full description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} required />
          <input className="field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} required />
          <select className="field" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <input className="field" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))} />
          <input className="field" placeholder="Gallery URLs, comma-separated" value={form.gallery} onChange={(e) => setForm((s) => ({ ...s, gallery: e.target.value }))} />
          <input className="field" placeholder="Live demo URL" value={form.demoUrl} onChange={(e) => setForm((s) => ({ ...s, demoUrl: e.target.value }))} />
          <input className="field" placeholder="Downloadable ZIP URL" value={form.fileUrl} onChange={(e) => setForm((s) => ({ ...s, fileUrl: e.target.value }))} />
          <textarea className="field min-h-24" placeholder="Features, one per line" value={form.features} onChange={(e) => setForm((s) => ({ ...s, features: e.target.value }))} />
          <input className="field" placeholder="Tech stack, comma-separated" value={form.techStack} onChange={(e) => setForm((s) => ({ ...s, techStack: e.target.value }))} />
          <input className="field" placeholder="Tags, comma-separated" value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
          <select className="field" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
            <option>Draft</option>
            <option>Published</option>
          </select>
          <div className="flex gap-3">
            <Button type="submit">{editingId ? 'Update Product' : 'Add Product'}</Button>
            <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>Reset</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
