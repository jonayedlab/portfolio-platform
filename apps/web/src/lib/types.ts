export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Profile {
  id: string;
  displayName: string;
  headline?: string | null;
  about?: string | null;
  photoUrl?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  socials?: Record<string, string> | null;
  qualifications: Qualification[];
  experiences: Experience[];
  skills: Skill[];
}

export interface Qualification {
  id: string;
  title: string;
  institution: string;
  startYear?: number | null;
  endYear?: number | null;
  description?: string | null;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startYear?: number | null;
  endYear?: number | null;
  current: boolean;
  description?: string | null;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string | null;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  techStack: string[];
  link?: string | null;
  repoUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'blog';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  imageUrl?: string | null;
  published: boolean;
  category?: Category | null;
  categoryId?: string | null;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string | null;
  authorId: string;
  author?: { id: string; name: string };
  categoryId?: string | null;
  category?: Category | null;
  tags: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  email: string;
  totalCents: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: { id: string; productId: string; priceCents: number; quantity: number; product?: Product }[];
  createdAt: string;
}

export interface AnalyticsSummary {
  counts: { products: number; posts: number; projects: number; orders: number };
  sales: { totalPaidCents: number };
  pageviews: { last24h: number; last30d: number };
  uniqueVisitors30d: number;
  topPages: { path: string; views: number }[];
  recent: { id: string; path: string; referrer?: string | null; createdAt: string }[];
}
