import { PrismaClient, Role, PostStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123!';
  const adminName = process.env.ADMIN_NAME ?? 'Alifur Rahman Jonayed';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, role: Role.ADMIN },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: Role.ADMIN,
    },
  });

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      displayName: adminName,
      headline: 'Full-stack developer & digital creator',
      about:
        'I build web platforms, digital products, and write about technology. ' +
        'This portfolio is also my shop, blog, and CMS — all in one place.',
      email: adminEmail,
      socials: {
        github: 'https://github.com/jonayedlab',
        linkedin: '',
        x: '',
      },
      qualifications: {
        create: [
          {
            title: 'B.Sc. in Computer Science',
            institution: 'Example University',
            startYear: 2018,
            endYear: 2022,
            order: 0,
          },
        ],
      },
      experiences: {
        create: [
          {
            role: 'Full-stack Developer',
            company: 'Freelance',
            startYear: 2022,
            current: true,
            description: 'Building portfolios, e-commerce sites, and CMS-driven web apps.',
            order: 0,
          },
        ],
      },
      skills: {
        create: [
          { name: 'TypeScript', level: 5, category: 'Languages', order: 0 },
          { name: 'React / Next.js', level: 5, category: 'Frontend', order: 1 },
          { name: 'Node.js / Express', level: 5, category: 'Backend', order: 2 },
          { name: 'PostgreSQL / Prisma', level: 4, category: 'Database', order: 3 },
          { name: 'Tailwind CSS', level: 5, category: 'Frontend', order: 4 },
        ],
      },
    },
  });

  // Categories
  const blogCat = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: 'Tech', slug: 'tech', type: 'blog' },
  });

  const productCat = await prisma.category.upsert({
    where: { slug: 'templates' },
    update: {},
    create: { name: 'Templates', slug: 'templates', type: 'product' },
  });

  // Sample project
  await prisma.project.upsert({
    where: { slug: 'portfolio-platform' },
    update: {},
    create: {
      title: 'Portfolio Platform',
      slug: 'portfolio-platform',
      summary: 'A full-stack personal platform: portfolio, shop, blog, and CMS.',
      description:
        'Built with Next.js, Express, Prisma, and PostgreSQL. Includes admin auth, ' +
        'blog CMS, digital product shop, and analytics.',
      techStack: ['Next.js', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Tailwind'],
      link: 'https://example.com',
      repoUrl: 'https://github.com/jonayedlab/portfolio-platform',
      featured: true,
      order: 0,
    },
  });

  // Sample blog post
  await prisma.blogPost.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      title: 'Hello, World',
      slug: 'hello-world',
      excerpt: 'Welcome to my blog. This is the first post on the new platform.',
      content:
        '# Hello, World\n\nThis is my first post on the platform. ' +
        'I\'ll be writing about technology, building products, and lessons from freelancing.\n',
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: blogCat.id,
      tags: ['intro', 'meta'],
      metaTitle: 'Hello, World — Alifur Rahman Jonayed',
      metaDescription: 'The first post on my new portfolio + blog platform.',
      metaKeywords: 'portfolio, blog, intro',
    },
  });

  // Sample product
  await prisma.product.upsert({
    where: { slug: 'starter-template' },
    update: {},
    create: {
      name: 'Portfolio Starter Template',
      slug: 'starter-template',
      description: 'A clean Next.js + Tailwind starter template for personal portfolios.',
      priceCents: 1900,
      currency: 'USD',
      published: true,
      categoryId: productCat.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete. Admin login:', adminEmail);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
