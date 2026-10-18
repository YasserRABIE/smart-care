# syntax=docker/dockerfile:1
# Production image for apps/web. Build from the repo root:
#   docker build -f apps/web/Dockerfile --build-arg NEXT_PUBLIC_SITE_URL=https://smartcareco.com .

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1 HUSKY=0
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Inlined into client code at build time, so it must be the real public URL.
ARG NEXT_PUBLIC_SITE_URL=https://smartcareco.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Placeholders so env validation passes during the build; real values come from .env at runtime.
RUN DATABASE_URI=postgres://build:build@localhost:5432/build \
    PAYLOAD_SECRET=build-only-placeholder-secret-00000000000 \
    pnpm --filter @smart-care/web build

FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=node:node /app/apps/web/public ./apps/web/public
# Payload uploads land here; mount a volume on it.
RUN mkdir -p apps/web/media && chown node:node apps/web/media
USER node
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "server.js"]
