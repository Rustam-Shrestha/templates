FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@12.14.0 --activate
WORKDIR /app

COPY .npmrc pnpm-lock.yaml* pnpm-workspace.yaml package.json tsconfig.base.json turbo.json ./
COPY packages/ ./packages/
COPY apps/frontend/ ./apps/frontend/

ENV NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @workspace/contracts build
RUN pnpm --filter @workspace/ui build
RUN pnpm --filter @workspace/frontend build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs --from=builder /app/apps/frontend/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --chown=nextjs:nodejs --from=builder /app/apps/frontend/public ./apps/frontend/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/frontend/server.js"]

