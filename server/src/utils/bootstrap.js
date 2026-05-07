import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { upsertSettings } from './settings.js';

export async function ensureDefaultAdmin() {
  const existing = await AdminUser.findOne({ email: process.env.ADMIN_EMAIL?.toLowerCase() });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  return AdminUser.create({
    email: process.env.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    name: 'Marketplace Admin'
  });
}

export async function ensureSeedData() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany([
      { name: 'Business', slug: 'business' },
      { name: 'Portfolio', slug: 'portfolio' },
      { name: 'E-commerce', slug: 'e-commerce' },
      { name: 'Blog', slug: 'blog' },
      { name: 'Landing Page', slug: 'landing-page' }
    ]);
  }

  const categories = await Category.find({});
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const findCategory = (slug) => categories.find((item) => item.slug === slug)?._id;
    await Product.insertMany([
      {
        title: 'GrowthPro Agency Site',
        slug: 'growthpro-agency-site',
        shortDescription: 'A modern agency website with service sections, testimonials, and lead capture.',
        description: 'A conversion-focused business website template with polished hero sections, service blocks, testimonials, FAQ, and contact CTA. Perfect for agencies and freelancers.',
        price: 149,
        category: findCategory('business'),
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'],
        demoUrl: 'https://example.com/demo/growthpro',
        fileUrl: 'https://example.com/files/growthpro.zip',
        tags: ['agency', 'saas', 'lead generation'],
        features: ['Responsive layout', 'Pricing section', 'Testimonial carousel', 'Contact form'],
        techStack: ['React', 'Tailwind CSS', 'Express'],
        status: 'Published'
      },
      {
        title: 'Creator Portfolio Kit',
        slug: 'creator-portfolio-kit',
        shortDescription: 'A clean portfolio template for designers, developers, and creative studios.',
        description: 'A sleek personal portfolio website with case study layouts, about page, services, and CTA-driven contact sections.',
        price: 99,
        category: findCategory('portfolio'),
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'],
        demoUrl: 'https://example.com/demo/portfolio',
        fileUrl: 'https://example.com/files/portfolio.zip',
        tags: ['portfolio', 'creative', 'freelancer'],
        features: ['Case study pages', 'Animated project grid', 'Contact CTA'],
        techStack: ['React', 'Tailwind CSS'],
        status: 'Published'
      },
      {
        title: 'ShopSwift Product Store',
        slug: 'shopswift-product-store',
        shortDescription: 'A stylish storefront template for small catalogs and digital products.',
        description: 'A storefront layout with product grids, featured offers, promo sections, and a polished checkout-ready UX concept.',
        price: 179,
        category: findCategory('e-commerce'),
        thumbnail: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'],
        demoUrl: 'https://example.com/demo/shopswift',
        fileUrl: 'https://example.com/files/shopswift.zip',
        tags: ['store', 'digital products', 'e-commerce'],
        features: ['Product cards', 'Promo banner', 'Cart drawer layout'],
        techStack: ['React', 'Node.js'],
        status: 'Published'
      }
    ]);
  }

  await upsertSettings({
    siteName: 'WebLaunch Marketplace',
    contactEmail: process.env.ADMIN_EMAIL,
    heroTitle: 'Ready-Made Websites You Can Launch Today',
    heroDescription: 'Preview live demos, buy the source code, and launch a polished site fast from one clean storefront.'
  });
}
