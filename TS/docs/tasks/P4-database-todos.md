# Phase 4: Database & Todos Module

## Files to Create

- `docker-compose.yml` (Postgres 17 service with healthcheck)
- `backend/drizzle.config.ts`
- `backend/src/db/client.ts`
- `backend/src/db/schema/index.ts`
- `backend/src/db/schema/todos.ts`
- `backend/src/plugins/db.ts`
- `backend/src/modules/todos/todos.repo.ts`
- `backend/src/modules/todos/todos.service.ts`
- `backend/src/modules/todos/todos.routes.ts`
- `backend/test/integration/todos.test.ts`
- Run `npm run db:generate -w backend` to generate and commit migrations in `backend/src/db/migrations/`.

## Acceptance Criteria

- Keyset pagination works on `(created_at DESC, id DESC)` without `OFFSET`.
- No SQL string concatenation.
- `/health/ready` verifies database connectivity with `SELECT 1`.
- Tests pass cleanly against real/test DB.
