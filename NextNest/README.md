# NextNest: Enterprise ERP Monorepo

Zero-to-production enterprise monorepo built with:
- **NestJS 11** on **Fastify 5**
- **Next.js 15 (App Router)** on **React 19**
- **Tailwind 4** (CSS-first, `@tailwindcss/postcss`)
- **Drizzle ORM** with `postgres.js` & PostgreSQL 17 + PgBouncer
- **Redis 7** with single-flight cache stampede guard & BullMQ Outbox relay worker
- **Zod 4** single source of truth schemas
- **Turborepo** & **pnpm 12**

---

## Architecture & Rituals
- **Hexagonal Purity:** Pure TypeScript domain models in `apps/backend/src/modules/*/domain` (strictly zero framework/ORM imports).
- **Transactional Outbox Pattern:** Zero dual-write data loss. Atomic database commits insert outbox events polled by `apps/backend/src/worker.ts` and relayed to BullMQ.
- **Idempotency State Machine:** Composite `(scope, key)` tracking in PostgreSQL with SHA-256 canonical body hashing.
- **Keyset Pagination:** $O(\log N)$ cursor pagination utilizing time-ordered RFC 9562 UUIDv7 IDs.
- **Feature-Sliced Design (FSD):** Strict layer isolation in `apps/frontend`.
- **Contribution & Modularity Standards:** Complete guide in [ARCHITECTURE_AND_CONTRIBUTING.md](ARCHITECTURE_AND_CONTRIBUTING.md).

## Architectural Decision Records (ADRs)
- [ADR 0001: Core Architecture & Technology Stack Decisions](docs/adr/0001-stack-decisions.md)
- [ADR 0002: Financial Ledger Money Representation and Sign Convention](docs/adr/0002-money-sign.md)
- [ADR 0003: Connection Pool Arithmetic & PgBouncer Configuration](docs/adr/0003-connection-pooling.md)
- [ADR 0004: Authentication and Authorization Roadmap](docs/adr/0004-auth.md)

---

## Security Disclaimer (§4.6)
> **WARNING:** This foundational baseline operates in an unauthenticated development mode. Do not expose mutation endpoints to public networks without implementing authentication guards (see [ADR 0004](docs/adr/0004-auth.md)).

---

## Infrastructure & Topology (§3.7)
In the initial development environment, `DATABASE_READ_URL` points to the primary PostgreSQL container via PgBouncer. A dedicated streaming read replica container should be provisioned for production horizontal read scaling.

---

## Getting Started

### 1. Start Infrastructure
```bash
pnpm infra:up
```

### 2. Install & Build
```bash
pnpm install
pnpm build
```

### 3. Run Dev Mode
```bash
pnpm dev
```

### 4. Run Outbox Worker
```bash
pnpm worker
```

### 5. Verification Gate
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

