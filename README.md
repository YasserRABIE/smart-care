# Smart Care Medical

Marketing site and product catalog for Smart Care Medical. Next.js (App Router) + Payload CMS 3 + Postgres, in a pnpm/Turborepo monorepo. See [CLAUDE.md](CLAUDE.md) for architecture, data model, and the phase plan.

## Quick start

Requires Node 22 (`.nvmrc`) and Docker.

```bash
corepack enable
pnpm install
cp apps/web/.env.example apps/web/.env   # then set PAYLOAD_SECRET (openssl rand -hex 32)
pnpm db:up
pnpm dev
```

Site: http://localhost:3000. Admin: http://localhost:3000/admin (the first account you create becomes the admin).

## Scripts

| Command                                        | What it does                                       |
| ---------------------------------------------- | -------------------------------------------------- |
| `pnpm dev`                                     | Run the app in dev mode                            |
| `pnpm build`                                   | Production build                                   |
| `pnpm lint` / `pnpm typecheck` / `pnpm test`   | Quality checks (same as CI)                        |
| `pnpm format`                                  | Prettier on the whole repo                         |
| `pnpm db:up` / `pnpm db:down`                  | Start/stop local Postgres 16 (host port **5433**)  |
| `pnpm --filter @smart-care/web generate:types` | Regenerate `payload-types.ts` after schema changes |

## Layout

```
apps/web           Next.js + Payload (site, admin, API)
packages/shared    zod schemas and shared types (@smart-care/shared)
packages/config    tsconfig, ESLint, Prettier presets (@smart-care/config)
docker/            local Postgres
```
