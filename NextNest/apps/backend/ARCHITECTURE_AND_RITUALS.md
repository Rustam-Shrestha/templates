# Backend 6-Year Longevity & Million-User Rituals

1. **Hexagonal Purity (`modules/*/domain/`):** Zero imports from `@nestjs/*`, `drizzle-orm`, or `fastify`. Pure TypeScript only. Domain may import only `@workspace/contracts`, `node:crypto`, and `zod`.
2. **No Floating Point Money:** All financial amounts use `bigint` minor units (`MoneyMinorUnits`). Floating points are strictly rejected at the HTTP boundary.
3. **UUIDv7 + Keyset Pagination Only:** `OFFSET` is banned on tables > 10,000 rows. Use `WHERE id > :cursor ORDER BY id ASC LIMIT :limit`.
4. **Transactional Outbox Mandate:** Never publish to Redis/BullMQ directly inside an HTTP request alongside a DB write. Always insert into `outbox_events` inside the same database transaction.
5. **Expand-and-Contract Migrations:** Never rename or drop a column in a single deployment. (1) Add nullable column, (2) Dual-write & backfill, (3) Switch reads, (4) Drop legacy column in next release.
6. **Strict Connection Pooling:** All database clients must adhere to connection pool arithmetic ($N \times P \times R \le \text{MAX\_CLIENT\_CONN}$) with `prepare: false` for PgBouncer.
7. **Idempotency Enforcement:** All mutating endpoints must validate the `Idempotency-Key` header and execute through the composite `(scope, key)` state machine.

