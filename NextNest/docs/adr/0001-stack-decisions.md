# ADR 0001: Core Architecture & Technology Stack Decisions

## Status
Accepted

## Context
An enterprise ERP platform demands 6+ years of architectural stability, million-user horizontal scalability, resilient financial ledger operations, and zero data loss. We evaluated multiple backend frameworks, frontend architectures, ORMs, and background workers.

## Decisions

### 1. Backend: NestJS 11 on Fastify 5
- **Chosen:** NestJS 11 on Fastify 5 (`@nestjs/platform-fastify`, Fastify 5).
- **Alternatives Considered:** Plain Fastify (no native DI or module boundaries), Express (inferior throughput and async overhead).
- **Rationale:** NestJS enforces strict modular dependency injection and hexagonal ports/adapters. Fastify 5 provides high HTTP throughput, schema serialization speed, and native low-overhead plugin architectures.

### 2. Frontend: Next.js 15 App Router + React 19
- **Chosen:** Next.js 15 App Router with Feature-Sliced Design (FSD).
- **Alternatives Considered:** Vite SPA (lacks SSR/streaming for server telemetry and initial dashboard loads), Remix (smaller ecosystem fit for this stack).
- **Rationale:** App Router enables server-side streaming for dense ERP reporting, strict RSC boundaries, and standalone Docker deployment.

### 3. Schema & Validation: Zod 4 Everywhere
- **Chosen:** Zod 4 across all monorepo packages.
- **Alternatives Considered:** Zod 3 (deprecated legacy patterns), Valibot (smaller React Hook Form and OpenAPI integration ecosystem).
- **Rationale:** Unifying on Zod 4 prevents type discrepancies across workspace boundaries.

### 4. Styling: Tailwind 4
- **Chosen:** Tailwind 4 with `@tailwindcss/postcss`.
- **Alternatives Considered:** Tailwind 3 (deprecated config model), CSS Modules (lacks unified token sharing).
- **Rationale:** CSS-first configuration via `@import "tailwindcss"` and `@source` keeps token compilation fast and eliminates JS config drift.

### 5. ORM: Drizzle ORM on `postgres.js`
- **Chosen:** Drizzle ORM with `postgres.js` driver.
- **Alternatives Considered:** Prisma (heavy engine runtime, codegen overhead), Kysely (lacks migration framework).
- **Rationale:** Drizzle provides zero-overhead query compilation, direct SQL transparency, and seamless PgBouncer transaction pooling compatibility (`prepare: false`).

### 6. Background Work: Transactional Outbox + BullMQ on Redis
- **Chosen:** Transactional Outbox database table polled by a standalone relay worker publishing to BullMQ on Redis.
- **Alternatives Considered:** Direct publish inside HTTP requests (guaranteed dual-write data loss on network partition), Kafka/Debezium (unjustified operational overhead for initial operational baseline).
- **Rationale:** Atomic database commits guarantee zero financial event loss. BullMQ provides Redis-based queue deduplication (`jobId = event.id`).
