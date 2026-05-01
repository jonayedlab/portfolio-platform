import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const messagesRouter = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional().nullable(),
  body: z.string().min(1).max(5000),
});

// Public: contact / project request
messagesRouter.post('/', async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);
    const msg = await prisma.message.create({ data });
    res.status(201).json({ message: msg });
  } catch (err) {
    next(err);
  }
});

// Admin: list / mark read / delete
messagesRouter.get('/', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

messagesRouter.put('/:id/read', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const msg = await prisma.message.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json({ message: msg });
  } catch (err) {
    next(err);
  }
});

messagesRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
