import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const analyticsRouter = Router();

const eventSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().optional().nullable(),
  visitorId: z.string().optional().nullable(),
});

// Public: record a pageview
analyticsRouter.post('/event', async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? req.ip;
    const userAgent = req.header('user-agent') ?? null;
    await prisma.analyticsEvent.create({
      data: {
        path: data.path,
        referrer: data.referrer ?? null,
        visitorId: data.visitorId ?? null,
        ip: ip ?? null,
        userAgent,
      },
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Admin: summary
analyticsRouter.get('/summary', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const now = new Date();
    const start24h = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    const start30d = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

    const [pageviews24h, pageviews30d, uniqueVisitors30d, topPages, recent] = await Promise.all([
      prisma.analyticsEvent.count({ where: { createdAt: { gte: start24h } } }),
      prisma.analyticsEvent.count({ where: { createdAt: { gte: start30d } } }),
      prisma.analyticsEvent
        .findMany({
          where: { createdAt: { gte: start30d }, visitorId: { not: null } },
          distinct: ['visitorId'],
          select: { visitorId: true },
        })
        .then((rows) => rows.length),
      prisma.analyticsEvent.groupBy({
        by: ['path'],
        where: { createdAt: { gte: start30d } },
        _count: { _all: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, path: true, referrer: true, createdAt: true },
      }),
    ]);

    const [productCount, postCount, projectCount, orderCount] = await Promise.all([
      prisma.product.count(),
      prisma.blogPost.count(),
      prisma.project.count(),
      prisma.order.count(),
    ]);

    const salesAgg = await prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: 'PAID' },
    });

    res.json({
      counts: {
        products: productCount,
        posts: postCount,
        projects: projectCount,
        orders: orderCount,
      },
      sales: { totalPaidCents: salesAgg._sum.totalCents ?? 0 },
      pageviews: { last24h: pageviews24h, last30d: pageviews30d },
      uniqueVisitors30d,
      topPages: topPages.map((t) => ({ path: t.path, views: t._count._all })),
      recent,
    });
  } catch (err) {
    next(err);
  }
});
