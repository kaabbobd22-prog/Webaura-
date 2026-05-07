import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils'; // utils ইমপোর্ট করা হলো

// Swiper Components and Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // এখানে `${slug}` ঠিক রাখা হয়েছে
    api.get(`/products/slug/${slug}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setProduct(null));
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

  const allImages = [product.thumbnail, ...(product.gallery || [])].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] min-w-0">

        {/* বাম পাশের কলাম: ইমেজ এবং ডেসক্রিপশন */}
        <div className="space-y-6 min-w-0 order-1 lg:order-1">
          <div className="card-shell overflow-hidden p-2">
            <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-slate-900">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="product-swiper"
                style={{ aspectRatio: '16/9', width: '100%' }}
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={`${image}-${index}`}>
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        src={image}
                        // এখানেও টেমপ্লেট লিটারেল ঠিক করা হয়েছে
                        alt={`${product.title} preview ${index + 1}`}
                        className="h-full w-full object-contain md:object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
        </div>

        {/* ডান পাশের কলাম (প্রাইস বক্স) */}
        <aside className="lg:sticky lg:top-24 lg:h-fit order-2">
          <div className="card-shell space-y-5 p-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                {product.category?.name || 'Website'}
              </p>
              <h1 className="text-4xl font-bold text-white leading-tight">{product.title}</h1>
              <p className="mt-3 text-slate-300">{product.shortDescription}</p>
            </div>

            {/* আপডেট করা প্রাইস ফরম্যাট */}
            <div className="text-4xl font-black text-white">
              {formatPrice(product.price || 0)}
            </div>

            <div className="space-y-3 border-b border-white/10 pb-6">
              <Button className="w-full" onClick={() => addItem(product)}>Add to Cart</Button>
              <Button className="w-full" variant="secondary" onClick={() => { addItem(product); navigate('/checkout'); }}>
                Buy Now
              </Button>
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
                {(product.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ফিচার ও টেক স্ট্যাক ট্যাব */}
        <div className="order-3 lg:col-span-2">
          <div className="card-shell p-6">
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {['overview', 'features', 'tech', 'license', 'faq'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                    activeTab === tab ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {tab === 'tech' ? 'Tech Stack' : tab}
                </button>
              ))}
            </div>
            <div className="mt-5 whitespace-pre-line text-slate-300 leading-relaxed">
              {tabs[activeTab] || 'No details added yet.'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}