# ADR 0001: PERN Monorepo Baseline Architecture & Technology Stack

## Context

We need a robust, scalable, modern, and type-safe foundation for fullstack web applications using the PERN (PostgreSQL, Express/Fastify, React, Node.js) paradigm. Previous iterations suffered from cross-package type drift, bloated configurations (e.g. Tailwind v3 legacy files), runtime overhead, and fragile data boundaries.

## Decisions

| Area                    | Choice                                                       | Considered Alternatives                                  | Failure Mode Prevented                          | Early Detection Signal                           |
| :---------------------- | :----------------------------------------------------------- | :------------------------------------------------------- | :---------------------------------------------- | :----------------------------------------------- |
| **Monorepo Engine**     | npm workspaces + Turborepo (`shared`, `backend`, `frontend`) | Polyrepo (drift), Nx (config weight)                     | Cross-package type drift, duplicate deps        | `tsc -b` fails in CI on shared contract change   |
| **Backend Framework**   | Fastify 5 + `fastify-type-provider-zod`                      | Express 5 (slower, manual middleware), NestJS (heavy DI) | Performance bottlenecks; migration cost         | Request/sec throughput benchmark                 |
| **Validation**          | Zod 4 in `@app/shared` used across backend and frontend      | Separate schemas (drift), class-validator                | Client accepts what server rejects              | Contract tests import shared schemas             |
| **Database Access**     | Drizzle ORM + `pg` driver with connection pool               | Prisma (heavier runtime, codegen), Kysely                | Opaque query shapes and hidden performance bugs | EXPLAIN ANALYZE on query plans                   |
| **Migrations**          | `drizzle-kit` forward-only in prod, verified scripts in dev  | Hand-written SQL only                                    | Drift between schema definitions and DB state   | CI migration verification against clean Postgres |
| **Frontend Build**      | Vite + React 19 SPA                                          | Next.js (RSC boundaries, server coupling), Remix         | Coupling frontend to Node server runtime        | Bundle analyzer budgets in CI                    |
| **Styling**             | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config)      | Tailwind v3 (CJS configs), CSS Modules                   | Config drift from legacy v3 leftovers           | Build fails if `tailwind.config.*` exists        |
| **Server State**        | TanStack Query v5 with optimistic mutations & rollback       | Redux Toolkit for server state, SWR                      | Stale UI state after mutations                  | Automated mutation rollback and cache tests      |
| **Form Handling**       | React Hook Form + Zod resolver (`@hookform/resolvers`)       | Formik (re-render heavy), unvalidated forms              | Validation mismatches                           | Shared schema validation on form submit          |
| **UI Kit & Primitives** | Radix UI primitives + CVA + `tailwind-merge` + Lucide        | MUI / Chakra (heavy runtime CSS-in-JS)                   | Inaccessible modals, focus trapping bugs        | Keyboard and a11y tests                          |
| **Logging**             | Pino (Fastify built-in) with header/cookie redaction         | Winston (slower, non-native)                             | Credential and cookie leaks in logs             | Redaction path test in CI                        |
| **Testing**             | Vitest, Testing Library, MSW, Playwright, Testcontainers     | Jest (slower ESM), mocked DB only                        | Passing unit tests hiding SQL runtime bugs      | Testcontainers running on real PostgreSQL 17     |

## Consequences

- End-to-end type safety from database column definitions to React form inputs.
- Single source of truth for domain schemas in `@app/shared`.
- Guaranteed reproducible builds with zero untracked runtime configurations.
