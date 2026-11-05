# Phase 5: Frontend Skeleton Setup

## Files to Create

- `frontend/vite.config.ts` (React plugin, Tailwind v4 plugin, `@` alias, API proxy)
- `frontend/tsconfig.json`, `frontend/tsconfig.app.json`, `frontend/tsconfig.node.json`
- `frontend/index.html`
- `frontend/src/styles/index.css` (`@import "tailwindcss";`, no legacy tailwind.config)
- `frontend/src/config/env.ts` (Validated with Zod)
- `frontend/src/lib/cn.ts` (clsx + tailwind-merge)
- `frontend/src/lib/api/errors.ts`
- `frontend/src/lib/api/client.ts` (`apiFetch` with timeout, parse, validate)
- `frontend/src/lib/query-keys.ts`
- `frontend/src/app/query-client.ts`
- `frontend/src/app/providers.tsx`
- `frontend/src/app/router.tsx`
- `frontend/src/main.tsx`
- `frontend/src/components/ui/` (Button, Input, Card, Checkbox, Dialog, Skeleton, EmptyState, ErrorState)
- `frontend/src/components/layout/` (AppShell, PageHeader)
- `frontend/src/test/setup.ts`, `frontend/src/test/msw/handlers.ts`

## Acceptance Criteria

- `npm run lint -w frontend` passes.
- `npm run typecheck -w frontend` passes.
- `npm run build -w frontend` succeeds producing clean dist bundle.
