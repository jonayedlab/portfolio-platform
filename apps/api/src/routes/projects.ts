import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { slugify } from '../lib/slug.js';

export const projectsRouter = Router();

projectsRouter.get('/', async (req, res, next) => {
  try {
    const featured = req.query.featured === 'true';
    const where = featured ? { featured: true } : {};
    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

projectsRouter.get('/:slug', async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
    if (!project) throw new HttpError(404, 'Project not found');
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()).default([]),
  link: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

projectsRouter.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = projectSchema.parse(req.body);
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const project = await prisma.project.create({ data: { ...data, slug } });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
});

projectsRouter.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = projectSchema.partial().parse(req.body);
    const update = { ...data };
    if (data.slug) update.slug = slugify(data.slug);
    const project = await prisma.project.update({ where: { id: req.params.id }, data: update });
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

projectsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
