import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

export const profileRouter = Router();

// Public: get the (single, primary) admin profile
profileRouter.get('/', async (_req, res, next) => {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        qualifications: { orderBy: { order: 'asc' } },
        experiences: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
      },
    });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  displayName: z.string().min(1),
  headline: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  socials: z.record(z.string()).optional().nullable(),
});

profileRouter.put('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const data = updateSchema.parse(req.body);
    const existing = await prisma.profile.findUnique({ where: { userId: req.user.sub } });
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data })
      : await prisma.profile.create({ data: { ...data, userId: req.user.sub } });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

// Qualifications / experiences / skills — replace-all semantics for simplicity
const qualSchema = z.array(
  z.object({
    title: z.string().min(1),
    institution: z.string().min(1),
    startYear: z.number().int().optional().nullable(),
    endYear: z.number().int().optional().nullable(),
    description: z.string().optional().nullable(),
    order: z.number().int().default(0),
  }),
);

profileRouter.put('/qualifications', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const items = qualSchema.parse(req.body);
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) throw new HttpError(404, 'Profile not found');
    await prisma.qualification.deleteMany({ where: { profileId: profile.id } });
    if (items.length > 0) {
      await prisma.qualification.createMany({
        data: items.map((i) => ({ ...i, profileId: profile.id })),
      });
    }
    const updated = await prisma.qualification.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    });
    res.json({ qualifications: updated });
  } catch (err) {
    next(err);
  }
});

const expSchema = z.array(
  z.object({
    role: z.string().min(1),
    company: z.string().min(1),
    startYear: z.number().int().optional().nullable(),
    endYear: z.number().int().optional().nullable(),
    current: z.boolean().default(false),
    description: z.string().optional().nullable(),
    order: z.number().int().default(0),
  }),
);

profileRouter.put('/experiences', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const items = expSchema.parse(req.body);
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) throw new HttpError(404, 'Profile not found');
    await prisma.experience.deleteMany({ where: { profileId: profile.id } });
    if (items.length > 0) {
      await prisma.experience.createMany({
        data: items.map((i) => ({ ...i, profileId: profile.id })),
      });
    }
    const updated = await prisma.experience.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    });
    res.json({ experiences: updated });
  } catch (err) {
    next(err);
  }
});

const skillSchema = z.array(
  z.object({
    name: z.string().min(1),
    level: z.number().int().min(1).max(5).default(3),
    category: z.string().optional().nullable(),
    order: z.number().int().default(0),
  }),
);

profileRouter.put('/skills', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const items = skillSchema.parse(req.body);
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) throw new HttpError(404, 'Profile not found');
    await prisma.skill.deleteMany({ where: { profileId: profile.id } });
    if (items.length > 0) {
      await prisma.skill.createMany({
        data: items.map((i) => ({ ...i, profileId: profile.id })),
      });
    }
    const updated = await prisma.skill.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    });
    res.json({ skills: updated });
  } catch (err) {
    next(err);
  }
});
