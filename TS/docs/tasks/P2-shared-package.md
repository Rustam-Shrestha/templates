# Phase 2: Shared Package Setup (`@app/shared`)

## Files to Create

- `shared/tsconfig.json`
- `shared/src/index.ts`
- `shared/src/schemas/common.ts`
- `shared/src/schemas/todo.ts`
- `shared/src/types/index.ts`
- `shared/test/schemas.test.ts`

## Acceptance Criteria

- `npm run build -w shared` emits `dist/index.js` and `dist/index.d.ts`.
- `npm run test -w shared` or Vitest runner passes schema unit tests (rejecting invalid UUIDs, whitespace-only titles, over-length titles, invalid pagination parameters).
