# ADR 0003: Connection Pool Arithmetic & PgBouncer Configuration

## Status
Accepted

## Context
Under high concurrent loads (up to millions of users), unconstrained database connection creation exhausts PostgreSQL worker threads and memory. A disciplined connection pooling model is required.

## Pool Arithmetic Formula
Let:
- $N$ = Number of application process instances.
- $P$ = `DATABASE_POOL_MAX` per application pool (configured in application config).
- $R$ = Number of connection pools per application process ($R = 1$ when read and write target the same PgBouncer endpoint, $R = 2$ if dedicated read/write endpoints exist).
- $S$ = `DEFAULT_POOL_SIZE` in PgBouncer (server-side persistent connections to PostgreSQL).

### Governing Invariants
1. **Client Connection Demand:**
   $$\text{Client Demand} = N \times P \times R \le \text{MAX\_CLIENT\_CONN}$$
   In PgBouncer configuration, `MAX_CLIENT_CONN` is set to `5000`.

2. **PostgreSQL Server Connections:**
   $$S + 10 \text{ (admin/migrations/monitoring)} \le \text{max\_connections}$$
   PostgreSQL `max_connections` is configured to `200`. PgBouncer `DEFAULT_POOL_SIZE` is set to `25`.
   $$25 + 10 = 35 \le 200 \quad \text{(Safe)}$$

3. **Instance Capacity Limits:**
   With $P = 25$ and $R = 2$, each application instance demands up to $50$ client connections to PgBouncer.
   PgBouncer comfortably supports:
   $$N_{\text{max}} = \frac{5000}{50} = 100 \text{ concurrent app instances}$$
   while PostgreSQL maintains only 25 active backend worker processes in transaction pooling mode.

## PgBouncer Rules
- **Mode:** `transaction` pooling (`POOL_MODE: transaction`).
- **Driver Constraint:** `prepare: false` is mandatory in `postgres.js` to prevent prepared statement leakage across pooled backend sessions.
- **Statement Timeout:** Default `5000ms` statement timeout enforced at the connection level.
- **Replica Topology Note:** In the initial local development topology, `DATABASE_READ_URL` routes to the primary PostgreSQL instance. It must be explicitly noted in health telemetry and documentation that read and write share a single database until a streaming read replica container is provisioned.

