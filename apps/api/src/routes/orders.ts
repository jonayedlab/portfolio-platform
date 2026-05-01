import { Router } from 'express';
import { z } from 'zod';
import { prisma, OrderStatus } from '@portfolio/db';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

export const ordersRouter = Router();

const checkoutSchema = z.object({
  email: z.string().email(),
  // WhatsApp number or other contact phone. Required at the API layer so we
  // always have a way to follow up about the order outside email.
  customerPhone: z
    .string()
    .trim()
    .min(5, 'Phone / WhatsApp number is required')
    .max(40, 'Phone / WhatsApp number is too long'),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).default(1),
      }),
    )
    .min(1),
});

// Public checkout — for the MVP we mark as PENDING and return an order id.
// A real payment gateway (Stripe) would update status via webhook to PAID.
ordersRouter.post('/checkout', async (req, res, next) => {
  try {
    const { email, customerPhone, items } = checkoutSchema.parse(req.body);
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, published: true },
    });
    if (products.length !== items.length) {
      throw new HttpError(400, 'One or more products are unavailable');
    }
    const productMap = new Map(products.map((p) => [p.id, p]));
    let total = 0;
    for (const it of items) {
      const p = productMap.get(it.productId);
      if (!p) throw new HttpError(400, 'Invalid product');
      total += p.priceCents * it.quantity;
    }

    const order = await prisma.order.create({
      data: {
        email,
        customerPhone,
        totalCents: total,
        status: OrderStatus.PENDING,
        items: {
          create: items.map((it) => {
            const p = productMap.get(it.productId)!;
            return { productId: p.id, priceCents: p.priceCents, quantity: it.quantity };
          }),
        },
      },
      include: { items: true },
    });
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

// Admin: list / update orders
ordersRouter.get('/', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

ordersRouter.put('/:id/status', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status } = updateSchema.parse(req.body);
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});
