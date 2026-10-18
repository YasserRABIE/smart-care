# Smart Care — Project Context

Marketing site + product catalog for **Smart Care Medical**, a Cairo-based supplier of surgical instruments, medical furniture, and AI diagnostics software to hospitals across MENA.
No e-commerce, no prices, no inventory. The only conversion is an **inquiry** (contact form that hands off to WhatsApp, "Send Inquiry" on products, phone).

The client must be able to manage product lines, categories, products, partners, FAQs, and site content themselves through an admin panel.

## Workflow rules for Claude

- **Plan before code.** For every phase, propose the plan (files to create/change, commands to run, decisions) and wait for approval before writing code.
- Work one phase at a time. Finish each phase with the verification checklist passing before moving on.
- Never commit secrets. Every new env var goes into `.env.example` and `src/lib/env.ts`.
- Prefer official scaffolds and docs over hand-rolled setup. Check current docs for Payload/Next.js versions instead of relying on memory.

## Stack

| Concern    | Choice                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Monorepo   | pnpm workspaces + Turborepo                                                                               |
| Node       | 22 LTS, pinned in `.nvmrc` and `engines`                                                                  |
| App        | Next.js (App Router) + Payload CMS 3, scaffolded with `create-payload-app` (blank template)               |
| Database   | Postgres 16 (Docker locally, Docker on the VPS in production)                                             |
| Styling    | Tailwind CSS v4, design tokens in `@theme`, font via `next/font`                                          |
| Validation | zod, schemas shared from `packages/shared`                                                                |
| Inquiries  | Client-side form → WhatsApp click-to-chat (`wa.me`) with a prefilled message; no email, nothing stored    |
| Motion     | Motion (framer-motion), respects `prefers-reduced-motion`                                                 |
| Tests      | Vitest (unit), Playwright (e2e for form + catalog)                                                        |
| Quality    | TypeScript strict, ESLint, Prettier, Husky + lint-staged                                                  |
| CI         | GitHub Actions: install, lint, typecheck, test, build                                                     |
| Hosting    | Hostinger VPS (KVM 2): Docker Compose with app + Postgres + Caddy. Images are built in CI, not on the VPS |

i18n: English only for v1, but keep the structure ready for Arabic/RTL (`next-intl` + Payload localization). **Confirm with the client before Phase 3.**

## Repository structure

```
smart-care/
  apps/web/                   Next.js + Payload
    src/
      app/
        (frontend)/           layout, home, products/[line], contact, sitemap, robots, not-found
        (payload)/            admin + API routes (generated)
      payload/
        collections/  globals/  hooks/  access/
      features/
        home/  catalog/  contact/  partners/
      components/
        ui/                   generic primitives (Button, Input, Textarea, Badge, Pagination, Accordion)
        layout/               Header, Footer, Container, Section, SectionHeading
      lib/
        data/                 data access layer (getProducts, getProductLine, getSiteSettings...)
        env.ts                zod-validated env
        utils.ts
      payload.config.ts
  packages/
    shared/                   zod schemas, shared types (@smart-care/shared)
    config/                   base tsconfig, eslint, prettier
  docker/docker-compose.dev.yml
  .github/workflows/ci.yml
  .env.example  .nvmrc  turbo.json  pnpm-workspace.yaml
```

## Architecture conventions

- **Server Components by default.** Client components only for: search box, contact form, mobile menu, hero animation.
- Filter chips and pagination are plain `<Link>`s. FAQ uses native `<details>/<summary>`.
- **Data access layer:** pages never call Payload directly; they call functions in `lib/data`. Those functions own querying, caching, and the "published only" filter.
- **Caching:** data functions are cached with tags (`products`, `product-lines`, `site-settings`, ...). Payload `afterChange`/`afterDelete` hooks call `revalidateTag`.
- **Catalog state lives in the URL:** `/products/[line]?category=&q=&page=`. 6 products per page.
- **"Send Inquiry" on a product** links to `/contact?product=<slug>`; the contact page prefills the subject and adds the product (and its line) to the WhatsApp message.
- **WhatsApp inquiries:** the form validates with the shared zod schema in the browser, builds the message (`features/contact/whatsapp-message.ts`), and opens `wa.me/<Site Settings WhatsApp number>?text=…`. The visitor sends it from WhatsApp. No server action, no email, no `inquiries` collection.
- **UI variants with `cva`:** one `Button` with variants `primary` (filled teal), `pill` (white rounded), `link` (text + arrow icon); renders as `Link` when given `href`.
- Design tokens come from Figma variables. No hardcoded hex values in components.
- Feature-specific code goes in `features/*`; `components/ui` must stay brand-agnostic.

## Data model (Payload)

Collections:

- `users` — email, name, role (`admin` | `editor`). Admin access only.
- `media` — upload with required `alt` and generated sizes.
- `product-lines` — title, slug, description, coverImage, ctaLabel, order.
- `categories` — title, slug, productLine (relationship).
- `products` — title, slug, description, image, category, productLine, status (draft/published), order.
- `partners` — name, logo, url, order.
- `faqs` — question, answer, order.

Globals:

- `site-settings` — phone, email, WhatsApp number, address, working hours, default SEO.
- `home-page` — hero title/subtitle/image, stats array (value, label, description).
- `contact-page` — hero title, sidebar copy, "what to expect" bullets.

## Design (Figma)

File key: `rDltaXMELvK7SJVvtuMZH0` (Smart-Care). Desktop frames only, 1280px wide.

| Page    | Node     | Sections                                                                                                                                                                                    |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home    | `72:45`  | Header, hero (intended springy entrance animation), "The Care You Deserve" + 6-stat bento grid, 3 product line cards, partners strip, Get In Touch (contact info + WhatsApp + form), footer |
| Catalog | `56:4`   | Banner with breadcrumbs, category filter chips with counts, search, 2-column product cards (image, category badge, title, description, Send Inquiry), pagination                            |
| Contact | `215:14` | Hero banner, procurement sidebar + "what to expect" + form, 3 contact cards, map (static image linking to Google Maps), FAQ accordion, partners strip, footer                               |

Use the Figma MCP (`get_design_context`, `get_variable_defs`, `get_screenshot`) when implementing a section.

## Open questions (resolve before the related phase)

1. No mobile/tablet designs — get them or agree on breakpoints (Phase 2).
2. Where does the "PRODUCTS" nav link go? Proposal: `/products` lists the 3 product lines (Phase 4).
3. Arabic/RTL needed? (before Phase 3).
4. Missing states: hover, focus, form success/error, empty search, loading.
5. Placeholder content: duplicate "48" counts, "B2C Customer" / "Employee" should be plural.
6. ~~Inquiry routing~~ — resolved: one WhatsApp number from Site Settings.

## Phases

1. **Setup** — monorepo, Postgres in Docker, Payload scaffold, restructure to the layout above, shared packages, env validation, Tailwind base, lint/format/test tooling, CI skeleton.
2. **Design system** — Figma tokens, font, UI primitives, Header, Footer, layout components.
3. **CMS** — collections, globals, access control, revalidation hooks, seed script with the design's content.
4. **Pages** — home, catalog (filters/search/pagination), contact.
5. **Inquiries** — form, server action, spam protection, email hook, product prefill.
6. **Polish** — responsive, motion, SEO (metadata, sitemap, JSON-LD Organization + FAQPage), accessibility, performance.
7. **Launch** — VPS, Docker Compose, Caddy, domain, nightly `pg_dump` + media backups off-server, admin handover.

### Phase 1 detail (Setup)

1. Prereqs: Node 22, `corepack enable`, Docker running, Git.
2. Root: `git init`, `pnpm-workspace.yaml` (`apps/*`, `packages/*`), `turbo.json` (dev, build, lint, typecheck, test), `.nvmrc`, root `package.json` scripts.
3. `docker/docker-compose.dev.yml` with Postgres 16 + named volume; `pnpm db:up` / `db:down`.
4. `create-payload-app` in `apps/web` (blank template, Postgres adapter). Verify `pnpm dev` and `/admin` user creation **before** changing anything.
5. Restructure into the folder layout above (only `users` and `media` collections for now).
6. `packages/config` (tsconfig/eslint/prettier bases) and `packages/shared` (`@smart-care/shared`) wired into the app.
7. `.env.example` + `src/lib/env.ts` (zod): `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_FALLBACK_EMAIL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
8. Tailwind v4 + `next/font` + placeholder `@theme` tokens.
9. TS strict, ESLint, Prettier, Husky + lint-staged, Vitest with one sample test.
10. `.github/workflows/ci.yml`: install, lint, typecheck, test, build.
11. Verify: `pnpm dev` runs, `/admin` works, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass. README with a five-command quick start. First commit.
