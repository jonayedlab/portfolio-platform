# Alifur Rahman Jonayed — Portfolio + Digital Platform

A full-stack personal platform: **portfolio + digital shop + blog + admin CMS + analytics**.

| Layer    | Tech                                         |
| -------- | -------------------------------------------- |
| Web      | Next.js 14 (App Router), Tailwind CSS        |
| API      | Express + TypeScript                         |
| DB       | PostgreSQL via Prisma                         |
| Auth     | JWT (httpOnly cookie) + bcrypt              |
| Storage  | Cloudinary (with local-disk fallback)        |
| Tooling  | pnpm workspaces, ESLint, Prettier            |

## Repo layout

```
apps/
  web/        Next.js public site + admin CMS
  api/        Express API (REST)
packages/
  db/         Prisma schema, client, seed
docker-compose.yml   Local Postgres
```

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env and start Postgres
cp .env.example .env
docker compose up -d

# 3. Generate Prisma client + apply schema + seed admin
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Run dev servers (web :3000, api :4000)
pnpm dev
```

Then open:

- Public site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>
  - Default credentials come from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

## Scripts

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | Start `web` and `api` in parallel             |
| `pnpm dev:web`     | Web only                                       |
| `pnpm dev:api`     | API only                                       |
| `pnpm build`       | Build all apps & packages                     |
| `pnpm lint`        | Lint all packages                              |
| `pnpm typecheck`   | TypeScript check across packages              |
| `pnpm db:generate` | Generate Prisma client                         |
| `pnpm db:push`     | Push schema (dev)                              |
| `pnpm db:migrate`  | Create + apply migration (dev)                 |
| `pnpm db:seed`     | Seed admin user, sample data                   |
| `pnpm db:studio`   | Open Prisma Studio                             |

## Modules

### Public site

- `/` — Home with featured projects + latest posts
- `/about` — Profile, skills, experience, qualifications
- `/projects` + `/projects/[slug]` — Portfolio
- `/blog` + `/blog/[slug]` — Blog with SEO meta + JSON-LD
- `/shop` + `/shop/[slug]` — Digital products with checkout stub
- `/contact` — Contact / project request form

### Admin CMS (`/admin/*`)

- `/admin/login` — JWT-cookie auth
- `/admin/dashboard` — Counts, sales, pageviews, top pages, recent visits
- `/admin/profile` — Edit bio, headline, about, contact info
- `/admin/projects` — CRUD projects
- `/admin/products` — CRUD digital products (price, file URL, image, published)
- `/admin/blog` — CRUD posts with SEO fields (meta title/description/keywords) + draft/publish status
- `/admin/orders` — List orders, change status (PENDING / PAID / FAILED / REFUNDED)
- `/admin/messages` — Inbox for contact form / project requests

### Analytics

- Public pageviews recorded via a beacon (`/api/analytics/event`) tagged with anonymous `visitorId` (cookie-less, localStorage).
- Admin sees: pageviews (24h / 30d), unique visitors (30d), top pages, recent visits, content + sales counts.

## API

All endpoints are prefixed with `/api`. JSON in/out. Admin routes require the JWT cookie (set by `POST /api/auth/login`).

| Method | Path                          | Auth   | Purpose                              |
| ------ | ----------------------------- | ------ | ------------------------------------ |
| POST   | `/auth/login`                 | —      | Issue JWT cookie                     |
| POST   | `/auth/logout`                | —      | Clear cookie                         |
| GET    | `/auth/me`                    | user   | Current user                         |
| GET    | `/profile`                    | —      | Public profile                       |
| PUT    | `/profile`                    | admin  | Update profile                       |
| PUT    | `/profile/{qualifications,experiences,skills}` | admin  | Replace lists |
| GET    | `/projects`                   | —      | List (`?featured=true`)              |
| GET    | `/projects/:slug`             | —      | One project                          |
| POST/PUT/DELETE | `/projects[/:id]`    | admin  | CRUD                                 |
| GET    | `/products` (`?all=true`)     | — (admin for `all`) | List products             |
| GET    | `/products/:slug`             | —      | Public product                       |
| POST/PUT/DELETE | `/products[/:id]`    | admin  | CRUD                                 |
| GET    | `/products/:id/download`      | user (+ paid order) | Get download URL          |
| GET    | `/blog` (`?all=true`)         | — / admin | List posts                        |
| GET    | `/blog/:slug`                 | —      | One post                             |
| POST/PUT/DELETE | `/blog[/:id]`        | admin  | CRUD                                 |
| POST   | `/orders/checkout`            | —      | Create order (stub, marks PENDING)   |
| GET    | `/orders`                     | admin  | List orders                          |
| PUT    | `/orders/:id/status`          | admin  | Update order status                  |
| POST   | `/messages`                   | —      | Submit contact form                  |
| GET    | `/messages`                   | admin  | Inbox                                |
| POST   | `/upload`                     | admin  | Multipart file upload (Cloudinary or local) |
| POST   | `/analytics/event`            | —      | Record pageview                      |
| GET    | `/analytics/summary`          | admin  | Dashboard summary                    |

## Storage

Uploads go through `apps/api/src/lib/storage.ts`, which picks an adapter based on `STORAGE_DRIVER`:

- `local` (default): stores under `apps/api/uploads/`, served at `/uploads/...`
- `cloudinary`: requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Adding S3 / R2 means writing another adapter that implements `StorageAdapter`.

## Payments

Checkout is currently a **stub** — orders are created in `PENDING` status. Plug in Stripe (recommended) by:

1. Add `stripe` package to the API.
2. Replace `POST /orders/checkout` to create a Stripe Checkout Session, return `session.url`.
3. Add a webhook (`POST /orders/webhook`) that verifies the signature and marks the order `PAID`.

The product download endpoint (`GET /products/:id/download`) already enforces "paid order required for non-admins".

## Deployment

Recommended: **Vercel** for the web app, **Railway** / **Render** / **Fly.io** for the API + Postgres.

Set environment variables in each platform from `.env.example`. The web app reads `NEXT_PUBLIC_API_URL` to know where the API lives. The API needs `DATABASE_URL`, `JWT_SECRET`, and `WEB_ORIGIN` (CORS) at minimum.

## Roadmap

- Stripe checkout + webhook
- Multi-DB support (toggle Postgres / Mongo via config — not in MVP)
- Image upload UI in admin (calls `/api/upload` + previews)
- Sitemap.xml + robots.txt routes
- Email automation (transactional + newsletter)
- AI chatbot widget on the public site

## License

MIT — see [LICENSE](./LICENSE).
