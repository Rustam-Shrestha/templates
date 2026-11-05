---
trigger: always_on
description: 'PERN Monorepo Baseline & Todo CRUD Rules, Architecture Contracts, and Acceptance Gates'
---

# GEMINI.md / AGENTS.md — PERN Monorepo Core Operating Rules

## 1. Verified Stack & Exact Dependency Versions

Confirmed via `npm view <pkg> version`:

- **Node.js**: `24.21.0` (LTS >=24.0.0, `.nvmrc` set to `24`)
- **PostgreSQL**: `17` (Alpine: `postgres:17-alpine`)
- **Monorepo Engine**: Turborepo `^2.11.10`, npm workspaces (`shared`, `backend`, `frontend`)
- **Backend Framework**: Fastify `^5.12.8` with `fastify-type-provider-zod` `^7.0.0`
- **Fastify Plugins**:
  - `@fastify/cors`: `^11.4.0`
  - `@fastify/helmet`: `^13.2.0`
  - `@fastify/rate-limit`: `^11.2.2`
  - `@fastify/sensible`: `^6.0.7`
  - `@fastify/under-pressure`: `^9.2.1`
- **Database & ORM**:
  - `drizzle-orm`: `^0.45.4`
  - `drizzle-kit`: `^0.31.11`
  - `pg`: `^8.23.1` (`@types/pg`: `^8.23.1`)
- **Validation**: `zod`: `^4.6.7` (used across `shared`, `backend`, and `frontend`)
- **Frontend SPA**:
  - `react`: `^19.3.1`, `react-dom`: `^19.3.1`
  - `vite`: `^8.3.5` or `^7.0.0`, `@vitejs/plugin-react`: `^6.2.1`
  - `tailwindcss`: `^4.3.4`, `@tailwindcss/vite`: `^4.3.4` (CSS-first, no `tailwind.config.*`)
  - `react-router`: `^7.5.0` (or `react-router-dom`: `^7.5.0`)
  - `@tanstack/react-query`: `^5.105.3`, `@tanstack/react-query-devtools`: `^5.105.3`
  - `react-hook-form`: `^7.91.0`, `@hookform/resolvers`: `^7.0.2`
  - `@radix-ui/react-checkbox`: `^1.4.1`, `@radix-ui/react-dialog`: `^1.3.1`, `@radix-ui/react-slot`: `^1.5.0`
  - `class-variance-authority`: `^0.7.1`, `clsx`: `^2.1.1`, `tailwind-merge`: `^3.7.0`
  - `lucide-react`: `^1.68.0`, `sonner`: `^2.0.8`
- **Testing & Tooling**:
  - `vitest`: `^4.0.0` or `^5.1.0`
  - `@testcontainers/postgresql`: `^12.2.1`
  - `typescript`: `^5.9.3`
  - `eslint`: `^9.21.0`, `@eslint/js`: `^9.21.0`, `typescript-eslint`: `^8.25.0`
  - `prettier`: `^3.5.0`
  - `husky`: `^9.1.7`, `lint-staged`: `^16.0.0`

---

## 2. Strict Hard Prohibitions

1. **NO `any`** anywhere in application code (permitted only in explicit `*.d.ts` shims if unavoidable).
2. **NO `@ts-ignore`** (use `@ts-expect-error` with an explanatory comment if strictly required for a third-party typing issue).
3. **NO floats for monetary or precision values** (use integer cents or numeric/decimal types).
4. **NO `tailwind.config.*` or `postcss.config.*`** files. Tailwind v4 is CSS-first (`@import "tailwindcss";` in `src/styles/index.css`).
5. **NO OFFSET pagination** in database queries. Keyset pagination on `(created_at DESC, id DESC)` is mandatory.
6. **NO SQL string concatenation**. All database queries must use Drizzle ORM query builders or parameterized `sql` tags.
7. **NO secrets committed**. Commit only `.env.example`.
8. **DO NOT COMMIT TO GIT**: Make working tree file modifications only. Do NOT run `git commit`.

---

## 3. Strict Verification & Progression Rule

- **Acceptance Gate**: Do NOT advance to Step N+1 until Step N's acceptance command passes cleanly.
- Standard verification command for packages:
  ```bash
  npm run lint && npm run typecheck && npm test
  ```
- Output modified file lists and command outputs at each phase checkpoint.

---

## 4. Architectural Boundaries & Contracts

- **`shared` (`@app/shared`)**: Exports Zod schemas and inferred TypeScript types only. Zero runtime dependencies other than `zod`.
- **`backend`**: Fastify 5 + Drizzle ORM.
  - `modules/*` may import `core`, `db`, `shared`.
  - `core` NEVER imports from `modules`.
  - Service layer contains domain logic with NO Fastify HTTP types or reply manipulation.
  - All SQL queries reside in repo files (`*.repo.ts`).
  - Standard error envelope: `{ error: { code, message, requestId, details? } }`.
- **`frontend`**: Vite SPA + React 19 + Tailwind CSS v4.
  - `features/*` may import `components/ui`, `components/layout`, and `lib`.
  - Nothing imports from `features/*` except `app/router.tsx`.
  - Server state managed via TanStack Query v5 with optimistic mutations and rollback.
  - All network calls pass through typed `apiFetch` validating responses with shared Zod schemas.

---

## 5. Phase Roadmap (P0 - P9)

- **P0**: Repo reset and cleanup (deletions, rename `backend-node` to `backend`, clean untracked artifacts).
- **P1**: Root tooling setup (`package.json`, `turbo.json`, `tsconfig.base.json`, `eslint.config.js`, `.prettierrc`).
- **P2**: Shared package (`@app/shared` with `common.ts` and `todo.ts` Zod schemas).
- **P3**: Backend skeleton (Fastify 5, plugins, env validation, error handler, health routes).
- **P4**: Database & todos module (Postgres 17, Drizzle schema, migration, repo, service, routes).
- **P5**: Frontend skeleton (Vite, React 19, Tailwind v4, API client, UI kit, AppShell).
- **P6**: Frontend todos feature (form, list, optimistic mutations, delete dialog, page).
- **P7**: Quality gates & CI (`.github/workflows/ci.yml`).
- **P8**: Docker containerization & orchestration (`Dockerfile`s, `nginx.conf`, `docker-compose.yml`).
- **P9**: Documentation & reuse (`README.md`, `docs/adr/0001-stack.md`, `docs/template-usage.md`).
