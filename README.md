# Kiln — Technology Studio

A production-oriented platform for a premium technology company: public marketing site, project-intake funnel, CRM, client portal and content management — one codebase, no fake functionality.

> **Bring us the problem. We build the technology.**

---

## Stack

- **Next.js 15** (App Router, React 19, TypeScript 5, Tailwind CSS 3)
- **File-backed data store** (`lib/store.ts`) mirroring `db/schema.sql` — swap for Postgres/Supabase without touching UI code
- **No animation libraries** — hand-rolled CSS/IntersectionObserver motion, `prefers-reduced-motion` respected
- **zod** for API request validation; everything else is framework-native

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — defaults work out of the box
npm run dev                  # http://localhost:3000

npm run build && npm start   # production
npm run lint                 # eslint
npx tsc --noEmit             # typecheck
node --test tests/           # e2e suite (server must be running)
```

## Roles & demo accounts

Credentials are env-driven (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORTAL_EMAIL`, `PORTAL_PASSWORD`) and **hashed with scrypt** in the store — never stored in plain text.

| Role | Login | Area |
|---|---|---|
| Admin | `/admin/login` | CRM, projects, clients, CMS, settings |
| Client | `/portal/login` | Project workspaces, milestones, messages, files |

Default development credentials: `admin@kiln.studio / admin2026` and `client@demo.kiln.studio / demo2026`. Change them in `.env.local` for any real deployment.

Sessions: httpOnly cookie (`kiln_session`, 12 h), random token validated server-side on every request. Middleware provides a fast 307 gate for `/portal` and `/admin`; every page and API additionally re-checks the session **and ownership** — URLs grant nothing.

## The ecosystem

```
Visitor ── start-project wizard ──▶ Lead (CRM)
        ── AI consultant ────────▶ Lead
        ── contact form ─────────▶ Contact
Admin   ── pipeline: new → contacted → qualified → discovery → proposal
           → negotiation → won / lost (owner, activity timeline, notes)
        ── won: create Client ▶ create Project (7 standard milestones)
        ── project ops: publish updates, flag ACTION REQUIRED, audit log
Client  ── portal: dashboard, projects, updates feed, milestones, messages,
           approvals (recorded with name + timestamp), file upload/download
        ── portal invites + password reset via one-hour signed tokens
```

Reference numbers for incoming briefs use a human-readable, non-sequential
format: `KD-2026-XXXXX`. Duplicate submissions (same email + same objective
within 10 minutes) return the existing reference instead of creating a new lead.

### Admin

- `/admin` — stats (new leads, active projects, awaiting response, upcoming milestones, unread messages), quick actions, tables
- `/admin/leads` — search, filter by all 8 statuses, sort, pagination · `/admin/leads/[id]` — tabbed detail (Overview / Brief / Activity / Messages / Notes / Client / Related project), archive/unarchive, owner assignment, notes
- `/admin/projects` + `/admin/projects/[id]` — search + status filter, milestone editor, client messages, publish titled updates to the client feed, ACTION REQUIRED flags, file management
- `/admin/clients` — CRUD with archive (soft delete) + portal invite (creates the portal user and emails a one-time setup link)
- `/admin/audit` — who did what and when: status changes, project creation, milestone completions, client invites, publishes
- `/admin/settings` — contact details overrides (footer + contact page update immediately), active storage mode readout

Project statuses use an operational vocabulary (`planning`, `in_progress`,
`blocked`, `in_review`, `ready_to_launch`, `live`, `completed`, `on_hold`,
`archived`); clients see friendly labels such as “Waiting on something”.

### CMS (admin)

Case studies, insights, testimonials, team and jobs are **fully editable in the back office** (`/admin/case-studies`, `/admin/insights`, …): draft → published → archived, slug + SEO overrides, delete with confirmation. Public pages read from the store, so publishing changes the live site instantly. Seed content in `content/*.ts` is **clearly marked example/development material** — replace before launch.

### Client portal

Dashboard, cross-project milestones/messages/files tables, real file uploads (validated types, 10 MB cap, server-generated keys) and authorized downloads via `GET /api/files/:id`. Each project has an **Updates** tab (studio-published progress feed), a prominent **action-required** banner with one-click approve, and an approval history recorded with the client’s name and timestamp.

### Public site extras

- **Global search** — press `/` anywhere (or the header search button). Searches services, work, insights and industries; Esc closes, arrow keys + Enter navigate.
- **`/cookies`** — plain-language cookie policy (one essential session cookie, no trackers).
- **`/services/system-integration`** — alias for the Systems & Integrations service page.
- Case studies carry honest **nature badges** (Representative build / Concept build / Internal project) and cross-link related work.

## API

Consistent envelope `{ ok: true, data }` / `{ ok: false, error }` with proper status codes (400/401/404/409/413/422/429). Zod-validated bodies. Rate-limited: contact, brief, login, reset, uploads.

| Endpoint | Method | Auth |
|---|---|---|
| `/api/health` | GET | — |
| `/api/project-brief`, `/api/leads` | POST | — (rate-limited) |
| `/api/leads/:id` | GET, PATCH | admin |
| `/api/contact`, `/api/applications` | POST | — (rate-limited) |
| `/api/auth/login`, `/api/auth/logout` | POST | — |
| `/api/clients` | GET, POST | admin |
| `/api/projects` | GET, POST | admin |
| `/api/projects/:id/messages` | GET, POST | admin or owning client |
| `/api/projects/:id/files` | GET, POST (multipart) | admin or owning client |
| `/api/files/:id` | GET (download) | admin or owning client |

## Email

All outgoing mail routes through `sendMail()`. With `RESEND_API_KEY` set it delivers via Resend; without it, messages are stored in the outbox (`data/db.json`) so the flow is still fully testable. Templates: brief received, contact received, application received, password reset, milestone/message notifications (portal + admin bell).

## Data, migrations & seed

- Storage: `data/db.json` (+ `data/uploads/`), created and **seeded automatically on first request**.
- The store has a version field; older databases are **migrated on load** (milestone statuses, new lead fields).
- To reset everything: stop the server, `rm -rf data`, start again.
- `db/schema.sql` is the reference Postgres schema (Supabase-ready) that the file store mirrors 1:1.

## Security notes

- Server-side authorization on every sensitive route/API — roles are never trusted from the client.
- Cross-client isolation enforced in the store layer (projects, messages, files).
- Uploads: MIME whitelist, size caps, server-generated filenames/keys, path-traversal-safe download resolution.
- Login + intake + uploads rate-limited per IP; password reset tokens single-use, 1 h expiry; reset never reveals whether an account exists.
- Security headers via `next.config.mjs` (X-Frame-Options DENY, nosniff, strict referrer, permissions policy).
- Analytics: server-side event log only — no tracking cookies, hence no consent banner.

## Testing

`tests/e2e.test.mjs` runs against the live production build (`node --test tests/`) and covers: full route sweep, visitor intake, admin CRM flow (lead → status → client → project → message → upload), client portal flow, **cross-client authorization negatives**, file-type validation, auth gates, logout, rate limits and response-envelope consistency. 30 tests, all required to pass.

## Deployment

### Local / VM

```bash
npm run build
npm start          # binds 0.0.0.0:3000
```

Runs anywhere Node 18.18+ runs. Persist the `data/` directory.

### Vercel (recommended)

1. Push this repo to GitHub and choose **Add New → Project** in Vercel, importing the repo. The Next.js framework preset is detected automatically — keep the default build command (`next build`) and output.
2. Set environment variables in **Project → Settings → Environment Variables**:
   - `BASE_URL` = your production URL, e.g. `https://your-company.vercel.app`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORTAL_EMAIL`, `PORTAL_PASSWORD` (change from the dev defaults!)
   - `RESEND_API_KEY` / `RESEND_FROM` (optional — real email delivery)
3. Deploy. That's it — no `vercel.json` needed.

**Storage on Vercel (demo mode).** Vercel's filesystem is read-only, and this app detects that automatically: the database and uploads run **in memory** and re-seed with example data on cold starts. Perfect for a showcase deployment. `/admin/settings` shows the active storage mode. When you're ready for durable data, connect Supabase/Postgres (see `db/schema.sql`) or Vercel KV — the store layer in `lib/store.ts` is the single place to swap.


## Project structure

```
app/            routes: public site, /portal, /admin, /api
components/     ui/, layout/, home/, services/, work/, insights/,
                start/, careers/, auth/, portal/, admin/
content/        seed content modules (CMS seed source)
lib/            store (data layer), auth, actions (server actions),
                cmsFields, consult, rate-limit, analytics, seo, validate
db/schema.sql   Postgres reference schema
tests/          e2e suite (node --test)
data/           runtime database + uploads (created at first run)
```
