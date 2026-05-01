import { Router } from 'express';
import { z } from 'zod';
import { prisma, ProductRequestStatus } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const productRequestsRouter = Router();

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().email(),
  phone: z.string().trim().min(5).max(40),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(5000),
  budget: z.string().trim().max(100).optional().nullable(),
});

// Public: anyone can submit a product / service request.
productRequestsRouter.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const request = await prisma.productRequest.create({
      data: {
        ...data,
        budget: data.budget ?? null,
      },
    });
    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
});

// Admin: list all product requests, newest first.
productRequestsRouter.get('/', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const requests = await prisma.productRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  status: z.nativeEnum(ProductRequestStatus).optional(),
  adminNote: z.string().max(5000).nullable().optional(),
});

// Admin: update status / admin note on a request.
productRequestsRouter.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const request = await prisma.productRequest.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

// Admin: delete a request (e.g. spam).
productRequestsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.productRequest.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
