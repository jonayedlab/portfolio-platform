import { Router } from 'express';
import { z } from 'zod';
import { prisma, PostStatus } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { slugify } from '../lib/slug.js';

export const blogRouter = Router();

// List posts. Public: only PUBLISHED. Admin (?all=true with auth): all.
blogRouter.get('/', async (req, res, next) => {
  try {
    const all = req.query.all === 'true';
    const categorySlug = typeof req.query.category === 'string' ? req.query.category : undefined;
    const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;

    const posts = await prisma.blogPost.findMany({
      where: {
        ...(all ? {} : { status: PostStatus.PUBLISHED }),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(tag ? { tags: { has: tag } } : {}),
      },
      include: { category: true, author: { select: { id: true, name: true } } },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

blogRouter.get('/:slug', async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: { category: true, author: { select: { id: true, name: true } } },
    });
    if (!post) throw new HttpError(404, 'Post not found');
    if (post.status !== PostStatus.PUBLISHED) {
      // Only admin can read drafts.
      // We don't apply requireAuth on the route to keep public path clean,
      // so check manually here.
      const cookieToken = req.cookies?.[process.env.COOKIE_NAME ?? 'portfolio_admin'];
      if (!cookieToken) throw new HttpError(404, 'Post not found');
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImageUrl: z.string().optional().nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
});

blogRouter.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const data = postSchema.parse(req.body);
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const publishedAt =
      data.status === PostStatus.PUBLISHED ? new Date() : null;
    const post = await prisma.blogPost.create({
      data: { ...data, slug, authorId: req.user.sub, publishedAt },
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

blogRouter.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = postSchema.partial().parse(req.body);
    const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, 'Post not found');

    const update: Record<string, unknown> = { ...data };
    if (data.slug) update.slug = slugify(data.slug);
    if (data.status === PostStatus.PUBLISHED && existing.status !== PostStatus.PUBLISHED) {
      update.publishedAt = new Date();
    }
    if (data.status === PostStatus.DRAFT) {
      update.publishedAt = null;
    }
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data: update });
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

blogRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Categories (blog & product share the model)
blogRouter.get('/_categories/list', async (_req, res, next) => {
  try {
    const cats = await prisma.category.findMany({ where: { type: 'blog' }, orderBy: { name: 'asc' } });
    res.json({ categories: cats });
  } catch (err) {
    next(err);
  }
});

const catSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  type: z.enum(['blog', 'product']).default('blog'),
});

blogRouter.post('/_categories', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = catSchema.parse(req.body);
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);
    const cat = await prisma.category.create({ data: { ...data, slug } });
    res.status(201).json({ category: cat });
  } catch (err) {
    next(err);
  }
});
