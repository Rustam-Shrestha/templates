FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@12.14.0 --activate
WORKDIR /app

COPY .npmrc pnpm-lock.yaml* pnpm-workspace.yaml package.json tsconfig.base.json turbo.json ./
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @workspace/contracts build
RUN pnpm --filter @workspace/logger build
RUN pnpm --filter @workspace/backend build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs --from=builder /app ./

USER nestjs
EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/health/live || exit 1

CMD ["node", "apps/backend/dist/main.js"]

