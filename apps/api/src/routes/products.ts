import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { slugify } from '../lib/slug.js';

export const productsRouter = Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const includeUnpublished = req.query.all === 'true';
    const categorySlug = typeof req.query.category === 'string' ? req.query.category : undefined;
    const products = await prisma.product.findMany({
      where: {
        ...(includeUnpublished ? {} : { published: true }),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });
    if (!product) throw new HttpError(404, 'Product not found');
    // Hide secret file URL from public consumers
    const { fileUrl: _fileUrl, ...safe } = product;
    res.json({ product: safe });
  } catch (err) {
    next(err);
  }
});

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  priceCents: z.number().int().min(0),
  currency: z.string().default('USD'),
  fileUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  published: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
});

productsRouter.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);
    const product = await prisma.product.create({ data: { ...data, slug } });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

productsRouter.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const update = { ...data };
    if (data.slug) update.slug = slugify(data.slug);
    const product = await prisma.product.update({ where: { id: req.params.id }, data: update });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

productsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Admin-only download URL (digital product fulfillment)
productsRouter.get('/:id/download', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    // For MVP: any authenticated user can fetch download for a paid order they own.
    // Real check below — must have a PAID order with this product.
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) throw new HttpError(404, 'Product not found');
    if (req.user.role !== 'ADMIN') {
      const paid = await prisma.order.findFirst({
        where: {
          userId: req.user.sub,
          status: 'PAID',
          items: { some: { productId: product.id } },
        },
      });
      if (!paid) throw new HttpError(403, 'Purchase required');
    }
    if (!product.fileUrl) throw new HttpError(404, 'No file attached');
    res.json({ url: product.fileUrl });
  } catch (err) {
    next(err);
  }
});
