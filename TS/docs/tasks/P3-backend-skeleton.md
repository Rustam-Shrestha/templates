# Phase 3: Backend Skeleton Setup

## Files to Create

- `backend/tsconfig.json` & `backend/tsconfig.build.json`
- `backend/scripts/copy-migrations.js`
- `backend/src/config/env.ts`
- `backend/src/core/errors.ts`
- `backend/src/core/error-handler.ts`
- `backend/src/core/logger.ts`
- `backend/src/core/pagination.ts`
- `backend/src/plugins/sensible.ts`
- `backend/src/plugins/helmet.ts`
- `backend/src/plugins/cors.ts`
- `backend/src/plugins/rate-limit.ts`
- `backend/src/plugins/under-pressure.ts`
- `backend/src/plugins/validation.ts`
- `backend/src/modules/health/health.routes.ts`
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/types/fastify.d.ts`
- `backend/.env.example`
- `backend/test/helpers/build-test-app.ts`
- `backend/test/unit/skeleton.test.ts`

## Acceptance Criteria

- `npm run lint -w backend` passes.
- `npm run typecheck -w backend` passes.
- `npm test -w backend` passes with assertions on `/health/live` returning 200, 404 envelope format, rate limiting, and security headers.
