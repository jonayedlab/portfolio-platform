import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export enums (runtime values) and types from the generated client.
export { Prisma, Role, PostStatus, OrderStatus } from '@prisma/client';
export type {
  User,
  Profile,
  Qualification,
  Experience,
  Skill,
  Project,
  Product,
  Order,
  OrderItem,
  BlogPost,
  Category,
  Message,
  AnalyticsEvent,
} from '@prisma/client';
