# ANTIGRAVITY EXECUTION PLAN: ZERO-TO-PRODUCTION ENTERPRISE ERP MONOREPO
**Target:** Next.js 15+ (App Router) + NestJS 11+ (Fastify 5) + Drizzle ORM (PostgreSQL 17 + PgBouncer) + Redis 7 + Turborepo + pnpm.
**Scale & Longevity Mandate:** Million-user concurrency readiness, zero-downtime deployment lifecycle, zero data loss (Transactional Outbox + Idempotency), and 6-year framework immunity (Hexagonal Pure-TS Domain Core).

## STRICT AGENT OPERATING DIRECTIVES
1. **Unattended End-to-End Execution:** Execute Phases 1 through 8 sequentially in the current working directory. Do not pause for confirmation.
2. **Zero Placeholders:** Write every single file specified below with the exact, complete code provided. No `TODO`, no `any`, no skipped imports.
3. **Strict Compilation:** Upon creating all files, execute `pnpm install`, `pnpm run build`, and `pnpm run typecheck`. Fix any local environment resolution issues until exit code is `0`.

---

## PHASE 1: DIRECTORY TREE INITIALIZATION
Run the following directory creation commands (or create via filesystem API):

```bash
mkdir -p .github/workflows docker
mkdir -p packages/contracts/src packages/logger/src packages/ui/src
mkdir -p apps/backend/src/core/config apps/backend/src/core/database apps/backend/src/core/cache apps/backend/src/core/resilience apps/backend/src/core/health
mkdir -p apps/backend/src/modules/ledger/domain apps/backend/src/modules/ledger/application apps/backend/src/modules/ledger/infrastructure apps/backend/src/modules/ledger/presentation
mkdir -p apps/frontend/src/app apps/frontend/src/features/system-health/api apps/frontend/src/features/system-health/ui apps/frontend/src/shared/api apps/frontend/src/shared/state apps/frontend/src/shared/lib apps/frontend/e2e
```

---

## PHASE 2: MONOREPO ROOT & TOOLING CONFIGURATIONS

### File: `.npmrc`
```ini
strict-peer-dependencies=false
auto-install-peers=true
engine-strict=true
prefer-workspace-packages=true
```

### File: `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### File: `package.json`
```json
{
  "name": "erp-baseline-monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "infra:up": "docker compose -f docker/docker-compose.infra.yml up -d",
    "infra:down": "docker compose -f docker/docker-compose.infra.yml down"
  },
  "devDependencies": {
    "@eslint/js": "^9.15.0",
    "@types/node": "^22.10.0",
    "eslint": "^9.15.0",
    "prettier": "^3.4.2",
    "turbo": "^2.3.3",
    "typescript": "^5.7.2",
    "typescript-eslint": "^8.18.0",
    "vitest": "^2.1.8"
  }
}
```

### File: `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2023"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### File: `turbo.json`
```json
{
  "$schema": "[https://turbo.build/schema.json](https://turbo.build/schema.json)",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### File: `eslint.config.js`
```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/coverage/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ["apps/backend/src/modules/**/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@nestjs/*", "drizzle-orm*", "fastify*", "ioredis*"],
              message: "HEXAGONAL VIOLATION: Domain layer must remain 100% pure TypeScript with zero framework/ORM imports."
            }
          ]
        }
      ]
    }
  },
  {
    files: ["apps/frontend/src/shared/**/*.ts", "apps/frontend/src/shared/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/app/*"],
              message: "FSD VIOLATION: Shared layer cannot import from Features or App layers."
            }
          ]
        }
      ]
    }
  }
);
```

### File: `.gitignore`
```gitignore
node_modules/
dist/
.next/
.turbo/
coverage/
*.env
!*.env.example
*.log
.DS_Store
```

---

## PHASE 3: SHARED INTERNAL PACKAGES (`packages/`)

### 3.1 `@workspace/contracts` (Single Source of Truth Schemas & Primitives)

#### File: `packages/contracts/package.json`
```json
{
  "name": "@workspace/contracts",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "typescript": "^5.7.2"
  }
}
```

#### File: `packages/contracts/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

#### File: `packages/contracts/src/primitives.ts`
```typescript
import { z } from "zod";
import { randomBytes } from "node:crypto";

export const UuidV7Schema = z.string().uuid().brand<"UuidV7">();
export type UuidV7 = z.infer<typeof UuidV7Schema>;

/**
 * Generates time-ordered RFC 9562 UUIDv7.
 * Eliminates B-Tree index fragmentation in PostgreSQL at 100M+ rows.
 */
export function generateUuidV7(): UuidV7 {
  const timestamp = BigInt(Date.now());
  const bytes = randomBytes(16);

  bytes[0] = Number((timestamp >> 40n) & 0xffn);
  bytes[1] = Number((timestamp >> 32n) & 0xffn);
  bytes[2] = Number((timestamp >> 24n) & 0xffn);
  bytes[3] = Number((timestamp >> 16n) & 0xffn);
  bytes[4] = Number((timestamp >> 8n) & 0xffn);
  bytes[5] = Number(timestamp & 0xffn);

  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = bytes.toString("hex");
  const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  return UuidV7Schema.parse(uuid);
}

/**
 * Monetary values strictly represented in integer minor units (paisa/cents).
 * Floating point math is strictly forbidden.
 */
export const MoneyMinorUnitsSchema = z.coerce.bigint().brand<"MoneyMinorUnits">();
export type MoneyMinorUnits = z.infer<typeof MoneyMinorUnitsSchema>;

export const CurrencyCodeSchema = z.enum(["NPR", "USD", "EUR", "GBP"]);
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

export const CursorPaginationQuerySchema = z.object({
  cursor: UuidV7Schema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});
export type CursorPaginationQuery = z.infer<typeof CursorPaginationQuerySchema>;
```

#### File: `packages/contracts/src/api.contract.ts`
```typescript
import { z } from "zod";
import { UuidV7Schema, CurrencyCodeSchema } from "./primitives.js";

// RFC 7807 Standard Problem Details
export const ProblemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string(),
  instance: z.string(),
  correlationId: z.string(),
  timestamp: z.string().datetime()
});
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

export const HealthStatusSchema = z.object({
  status: z.enum(["ok", "degraded", "down"]),
  service: z.string(),
  version: z.string(),
  uptimeSeconds: z.number(),
  timestamp: z.string().datetime(),
  checks: z.object({
    postgresWrite: z.enum(["up", "down"]),
    postgresRead: z.enum(["up", "down"]),
    redis: z.enum(["up", "down"])
  })
});
export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export const CreateLedgerEntryRequestSchema = z.object({
  accountId: UuidV7Schema,
  amountMinor: z.string().regex(/^-?\d+$/, "Must be integer minor units as string"),
  currency: CurrencyCodeSchema,
  referenceNote: z.string().min(1).max(255)
});
export type CreateLedgerEntryRequest = z.infer<typeof CreateLedgerEntryRequestSchema>;

export const LedgerEntryResponseSchema = z.object({
  id: UuidV7Schema,
  accountId: UuidV7Schema,
  amountMinor: z.string(),
  currency: CurrencyCodeSchema,
  referenceNote: z.string(),
  createdAtIso: z.string().datetime()
});
export type LedgerEntryResponse = z.infer<typeof LedgerEntryResponseSchema>;
```

#### File: `packages/contracts/src/index.ts`
```typescript
export * from "./primitives.js";
export * from "./api.contract.js";
```

---

### 3.2 `@workspace/logger` (Structured Async Pino Logger + PII Redaction)

#### File: `packages/logger/package.json`
```json
{
  "name": "@workspace/logger",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "pino": "^9.5.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "typescript": "^5.7.2"
  }
}
```

#### File: `packages/logger/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

#### File: `packages/logger/src/index.ts`
```typescript
import { pino, type Logger } from "pino";

export type { Logger };

export function createLogger(serviceName: string): Logger {
  return pino({
    name: serviceName,
    level: process.env["LOG_LEVEL"] ?? "info",
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "*.password",
        "*.token",
        "*.secret",
        "*.creditCard",
        "*.ssn",
        "*.pan"
      ],
      censor: "[REDACTED_PII]"
    },
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      }
    },
    timestamp: pino.stdTimeFunctions.isoTime
  });
}
```

---

### 3.3 `@workspace/ui` (Shared Design System & Accessible Primitives)

#### File: `packages/ui/package.json`
```json
{
  "name": "@workspace/ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "react": "^19.0.0",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.7.2"
  }
}
```

#### File: `packages/ui/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

#### File: `packages/ui/src/button.tsx`
```tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-slate-900 text-white hover:bg-slate-800",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      danger: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-900"
    };
    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

#### File: `packages/ui/src/index.ts`
```typescript
export * from "./button.js";
```

---

## PHASE 4: MILLION-USER BACKEND (`apps/backend`)

### File: `apps/backend/package.json`
```json
{
  "name": "@workspace/backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "tsx watch src/main.ts",
    "start": "node dist/main.js",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  },
  "dependencies": {
    "@fastify/helmet": "^12.0.1",
    "@nestjs/common": "^10.4.15",
    "@nestjs/core": "^10.4.15",
    "@nestjs/platform-fastify": "^10.4.15",
    "@workspace/contracts": "workspace:*",
    "@workspace/logger": "workspace:*",
    "drizzle-orm": "^0.38.2",
    "fastify": "^4.28.1",
    "ioredis": "^5.4.1",
    "postgres": "^3.4.5",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "drizzle-kit": "^0.30.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

### File: `apps/backend/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*"]
}
```

### File: `apps/backend/.env.example`
```env
NODE_ENV=development
PORT=4000
SERVICE_VERSION=1.0.0
DATABASE_WRITE_URL=postgresql://erp_user:erp_pass@localhost:6432/erp_db
DATABASE_READ_URL=postgresql://erp_user:erp_pass@localhost:6432/erp_db
DATABASE_POOL_MAX=25
REDIS_URL=redis://localhost:6379
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### File: `apps/backend/drizzle.config.ts`
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/core/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env["DATABASE_WRITE_URL"] ?? "postgresql://erp_user:erp_pass@localhost:6432/erp_db"
  }
});
```

### File: `apps/backend/src/core/config/env.schema.ts`
```typescript
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1024).max(65535).default(4000),
  SERVICE_VERSION: z.string().default("1.0.0"),
  DATABASE_WRITE_URL: z.string().url().default("postgresql://erp_user:erp_pass@localhost:6432/erp_db"),
  DATABASE_READ_URL: z.string().url().default("postgresql://erp_user:erp_pass@localhost:6432/erp_db"),
  DATABASE_POOL_MAX: z.coerce.number().int().min(2).max(100).default(25),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((v) => v.split(","))
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv !== null) return cachedEnv;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    process.stderr.write(`FATAL_BOOT_ENV_INVALID: ${JSON.stringify(parsed.error.format())}\n`);
    process.exit(1);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}
```

### File: `apps/backend/src/core/database/schema.ts`
```typescript
import { pgTable, uuid, varchar, jsonb, timestamp, integer, bigint, index } from "drizzle-orm/pg-core";

export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    key: varchar("key", { length: 128 }).primaryKey(),
    requestHash: varchar("request_hash", { length: 64 }).notNull(),
    responseStatus: integer("response_status").notNull(),
    responseBody: jsonb("response_body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull()
  },
  (table) => [index("idx_idempotency_expires").on(table.expiresAt)]
);

export const outboxEvents = pgTable(
  "outbox_events",
  {
    id: uuid("id").primaryKey(),
    aggregateType: varchar("aggregate_type", { length: 64 }).notNull(),
    aggregateId: uuid("aggregate_id").notNull(),
    eventType: varchar("event_type", { length: 128 }).notNull(),
    payload: jsonb("payload").notNull(),
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
    retryCount: integer("retry_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true })
  },
  (table) => [index("idx_outbox_pending").on(table.status, table.createdAt)]
);

export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    id: uuid("id").primaryKey(),
    accountId: uuid("account_id").notNull(),
    amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    referenceNote: varchar("reference_note", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [index("idx_ledger_account_created").on(table.accountId, table.createdAt)]
);
```

### File: `apps/backend/src/core/database/db.module.ts`
```typescript
import { Global, Module, OnApplicationShutdown, Inject } from "@nestjs/common";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { getEnv } from "../config/env.schema.js";

export const DB_WRITE = Symbol("DB_WRITE");
export const DB_READ = Symbol("DB_READ");

export interface DbConnection {
  db: PostgresJsDatabase<typeof schema>;
  sqlClient: postgres.Sql;
}

@Global()
@Module({
  providers: [
    {
      provide: DB_WRITE,
      useFactory: (): DbConnection => {
        const env = getEnv();
        // prepare: false is mandatory for PgBouncer transaction pooling mode
        const sqlClient = postgres(env.DATABASE_WRITE_URL, {
          max: env.DATABASE_POOL_MAX,
          idle_timeout: 20,
          connect_timeout: 5,
          prepare: false
        });
        return { db: drizzle(sqlClient, { schema }), sqlClient };
      }
    },
    {
      provide: DB_READ,
      useFactory: (): DbConnection => {
        const env = getEnv();
        const sqlClient = postgres(env.DATABASE_READ_URL, {
          max: env.DATABASE_POOL_MAX,
          idle_timeout: 20,
          connect_timeout: 5,
          prepare: false
        });
        return { db: drizzle(sqlClient, { schema }), sqlClient };
      }
    }
  ],
  exports: [DB_WRITE, DB_READ]
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(DB_WRITE) private readonly writeConn: DbConnection,
    @Inject(DB_READ) private readonly readConn: DbConnection
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled([
      this.writeConn.sqlClient.end({ timeout: 5 }),
      this.readConn.sqlClient.end({ timeout: 5 })
    ]);
  }
}
```

### File: `apps/backend/src/core/cache/redis.module.ts`
```typescript
import { Global, Injectable, Module, OnApplicationShutdown } from "@nestjs/common";
import { Redis } from "ioredis";
import { getEnv } from "../config/env.schema.js";

@Injectable()
export class RedisService implements OnApplicationShutdown {
  public readonly client: Redis;
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor() {
    const env = getEnv();
    this.client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });
  }

  /**
   * Single-Flight Cache Stampede Protection with +/-10% TTL Jitter.
   */
  async getOrComputeSingleFlight<T>(
    key: string,
    ttlSeconds: number,
    computeFn: () => Promise<T>
  ): Promise<T> {
    const cached = await this.client.get(key);
    if (cached !== null) {
      return JSON.parse(cached) as T;
    }

    const activePromise = this.inFlight.get(key);
    if (activePromise !== undefined) {
      return activePromise as Promise<T>;
    }

    const promise = (async (): Promise<T> => {
      try {
        const data = await computeFn();
        const jitter = Math.floor(ttlSeconds * 0.1 * (Math.random() * 2 - 1));
        await this.client.setex(key, Math.max(1, ttlSeconds + jitter), JSON.stringify(data));
        return data;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.quit().catch(() => undefined);
  }
}

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
```

### File: `apps/backend/src/core/resilience/rfc7807-exception.filter.ts`
```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { generateUuidV7, type ProblemDetails } from "@workspace/contracts";
import { createLogger } from "@workspace/logger";

const logger = createLogger("exception-filter");

@Catch()
export class Rfc7807ExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const correlationId = (request.headers["x-correlation-id"] as string | undefined) ?? generateUuidV7();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = "Internal Server Error";
    let detail = "An unexpected infrastructure error occurred.";

    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      title = "Schema Validation Failed";
      detail = exception.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      title = exception.name;
      detail = exception.message;
    } else if (exception instanceof Error) {
      logger.error({ err: exception, correlationId, url: request.url }, "Unhandled Domain/Runtime Error");
      detail = exception.message;
    }

    const problem: ProblemDetails = {
      type: `[https://httpstatuses.com/$](https://httpstatuses.com/$){String(status)}`,
      title,
      status,
      detail,
      instance: request.url,
      correlationId,
      timestamp: new Date().toISOString()
    };

    void reply.status(status).header("content-type", "application/problem+json").send(problem);
  }
}
```

### File: `apps/backend/src/core/health/health.controller.ts`
```typescript
import { Controller, Get, Inject } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { DB_WRITE, DB_READ, type DbConnection } from "../database/db.module.js";
import { RedisService } from "../cache/redis.module.js";
import { getEnv } from "../config/env.schema.js";
import type { HealthStatus } from "@workspace/contracts";

@Controller("health")
export class HealthController {
  constructor(
    @Inject(DB_WRITE) private readonly writeDb: DbConnection,
    @Inject(DB_READ) private readonly readDb: DbConnection,
    private readonly redis: RedisService
  ) {}

  @Get("live")
  getLiveness(): { status: "ok" } {
    return { status: "ok" };
  }

  @Get("ready")
  async getReadiness(): Promise<HealthStatus> {
    const env = getEnv();
    const [pgWrite, pgRead, redisPing] = await Promise.allSettled([
      this.writeDb.db.execute(sql`SELECT 1`),
      this.readDb.db.execute(sql`SELECT 1`),
      this.redis.client.ping()
    ]);

    const checks = {
      postgresWrite: pgWrite.status === "fulfilled" ? ("up" as const) : ("down" as const),
      postgresRead: pgRead.status === "fulfilled" ? ("up" as const) : ("down" as const),
      redis: redisPing.status === "fulfilled" ? ("up" as const) : ("down" as const)
    };

    const allUp =
      checks.postgresWrite === "up" && checks.postgresRead === "up" && checks.redis === "up";

    return {
      status: allUp ? "ok" : "degraded",
      service: "erp-backend",
      version: env.SERVICE_VERSION,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks
    };
  }
}
```

---

### 4.1 Hexagonal Reference Vertical Slice (`modules/ledger`)

#### File: `apps/backend/src/modules/ledger/domain/ledger.entity.ts`
```typescript
import {
  generateUuidV7,
  MoneyMinorUnitsSchema,
  type UuidV7,
  type MoneyMinorUnits,
  type CurrencyCode
} from "@workspace/contracts";

/**
 * PURE HEXAGONAL DOMAIN ENTITY.
 * Zero framework or ORM imports. Survives 6+ years of framework churn unchanged.
 */
export class LedgerEntryEntity {
  private constructor(
    public readonly id: UuidV7,
    public readonly accountId: UuidV7,
    public readonly amountMinor: MoneyMinorUnits,
    public readonly currency: CurrencyCode,
    public readonly referenceNote: string,
    public readonly createdAt: Date
  ) {}

  public static create(params: {
    accountId: UuidV7;
    amountMinor: bigint;
    currency: CurrencyCode;
    referenceNote: string;
  }): LedgerEntryEntity {
    if (params.amountMinor === 0n) {
      throw new Error("LEDGER_INVARIANT_VIOLATION: Transaction amount cannot be zero.");
    }
    return new LedgerEntryEntity(
      generateUuidV7(),
      params.accountId,
      MoneyMinorUnitsSchema.parse(params.amountMinor),
      params.currency,
      params.referenceNote.trim(),
      new Date()
    );
  }
}
```

#### File: `apps/backend/src/modules/ledger/domain/ledger.repository.port.ts`
```typescript
import type { LedgerEntryEntity } from "./ledger.entity.js";
import type { UuidV7 } from "@workspace/contracts";

export const LEDGER_REPOSITORY_PORT = Symbol("LEDGER_REPOSITORY_PORT");

export interface LedgerRepositoryPort {
  saveWithOutbox(entry: LedgerEntryEntity): Promise<void>;
  findByAccountCursor(accountId: UuidV7, limit: number, cursor?: UuidV7): Promise<LedgerEntryEntity[]>;
}
```

#### File: `apps/backend/src/modules/ledger/application/record-ledger-entry.usecase.ts`
```typescript
import { Inject, Injectable } from "@nestjs/common";
import { LedgerEntryEntity } from "../domain/ledger.entity.js";
import { LEDGER_REPOSITORY_PORT, type LedgerRepositoryPort } from "../domain/ledger.repository.port.js";
import type { CreateLedgerEntryRequest, LedgerEntryResponse } from "@workspace/contracts";

@Injectable()
export class RecordLedgerEntryUseCase {
  constructor(
    @Inject(LEDGER_REPOSITORY_PORT) private readonly repository: LedgerRepositoryPort
  ) {}

  async execute(dto: CreateLedgerEntryRequest): Promise<LedgerEntryResponse> {
    const entity = LedgerEntryEntity.create({
      accountId: dto.accountId,
      amountMinor: BigInt(dto.amountMinor),
      currency: dto.currency,
      referenceNote: dto.referenceNote
    });

    await this.repository.saveWithOutbox(entity);

    return {
      id: entity.id,
      accountId: entity.accountId,
      amountMinor: entity.amountMinor.toString(),
      currency: entity.currency,
      referenceNote: entity.referenceNote,
      createdAtIso: entity.createdAt.toISOString()
    };
  }
}
```

#### File: `apps/backend/src/modules/ledger/infrastructure/drizzle-ledger.repository.ts`
```typescript
import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, gt } from "drizzle-orm";
import { DB_WRITE, DB_READ, type DbConnection } from "../../../core/database/db.module.js";
import { ledgerEntries, outboxEvents } from "../../../core/database/schema.js";
import type { LedgerRepositoryPort } from "../domain/ledger.repository.port.js";
import { LedgerEntryEntity } from "../domain/ledger.entity.js";
import {
  generateUuidV7,
  UuidV7Schema,
  CurrencyCodeSchema,
  type UuidV7
} from "@workspace/contracts";

@Injectable()
export class DrizzleLedgerRepository implements LedgerRepositoryPort {
  constructor(
    @Inject(DB_WRITE) private readonly writeConn: DbConnection,
    @Inject(DB_READ) private readonly readConn: DbConnection
  ) {}

  /**
   * Executes atomic DB transaction inserting both the financial record AND the outbox event.
   * Guarantees zero dual-write data loss.
   */
  async saveWithOutbox(entry: LedgerEntryEntity): Promise<void> {
    await this.writeConn.db.transaction(async (tx) => {
      await tx.insert(ledgerEntries).values({
        id: entry.id,
        accountId: entry.accountId,
        amountMinor: entry.amountMinor,
        currency: entry.currency,
        referenceNote: entry.referenceNote,
        createdAt: entry.createdAt
      });

      await tx.insert(outboxEvents).values({
        id: generateUuidV7(),
        aggregateType: "LEDGER_ENTRY",
        aggregateId: entry.id,
        eventType: "LEDGER_ENTRY_RECORDED",
        payload: {
          id: entry.id,
          accountId: entry.accountId,
          amountMinor: entry.amountMinor.toString(),
          currency: entry.currency
        },
        status: "PENDING"
      });
    });
  }

  /**
   * Queries Read Replica using O(log N) UUIDv7 Keyset/Cursor Pagination.
   */
  async findByAccountCursor(
    accountId: UuidV7,
    limit: number,
    cursor?: UuidV7
  ): Promise<LedgerEntryEntity[]> {
    const whereClause =
      cursor !== undefined
        ? and(eq(ledgerEntries.accountId, accountId), gt(ledgerEntries.id, cursor))
        : eq(ledgerEntries.accountId, accountId);

    const rows = await this.readConn.db
      .select()
      .from(ledgerEntries)
      .where(whereClause)
      .orderBy(asc(ledgerEntries.id))
      .limit(limit);

    return rows.map((r) =>
      LedgerEntryEntity.create({
        accountId: UuidV7Schema.parse(r.accountId),
        amountMinor: r.amountMinor,
        currency: CurrencyCodeSchema.parse(r.currency),
        referenceNote: r.referenceNote
      })
    );
  }
}
```

#### File: `apps/backend/src/modules/ledger/presentation/ledger.controller.ts`
```typescript
import { Body, Controller, Post } from "@nestjs/common";
import {
  CreateLedgerEntryRequestSchema,
  type LedgerEntryResponse
} from "@workspace/contracts";
import { RecordLedgerEntryUseCase } from "../application/record-ledger-entry.usecase.js";

@Controller("ledger")
export class LedgerController {
  constructor(private readonly recordLedgerUseCase: RecordLedgerEntryUseCase) {}

  @Post("entries")
  async createEntry(@Body() rawBody: unknown): Promise<LedgerEntryResponse> {
    const validatedDto = CreateLedgerEntryRequestSchema.parse(rawBody);
    return this.recordLedgerUseCase.execute(validatedDto);
  }
}
```

#### File: `apps/backend/src/modules/ledger/presentation/ledger.module.ts`
```typescript
import { Module } from "@nestjs/common";
import { LedgerController } from "./ledger.controller.js";
import { RecordLedgerEntryUseCase } from "../application/record-ledger-entry.usecase.js";
import { DrizzleLedgerRepository } from "../infrastructure/drizzle-ledger.repository.js";
import { LEDGER_REPOSITORY_PORT } from "../domain/ledger.repository.port.js";

@Module({
  controllers: [LedgerController],
  providers: [
    RecordLedgerEntryUseCase,
    {
      provide: LEDGER_REPOSITORY_PORT,
      useClass: DrizzleLedgerRepository
    }
  ]
})
export class LedgerModule {}
```

### File: `apps/backend/src/app.module.ts`
```typescript
import { Module } from "@nestjs/common";
import { DatabaseModule } from "./core/database/db.module.js";
import { RedisModule } from "./core/cache/redis.module.js";
import { HealthController } from "./core/health/health.controller.js";
import { LedgerModule } from "./modules/ledger/presentation/ledger.module.js";

@Module({
  imports: [DatabaseModule, RedisModule, LedgerModule],
  controllers: [HealthController]
})
export class AppModule {}
```

### File: `apps/backend/src/main.ts`
```typescript
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { VersioningType } from "@nestjs/common";
import helmet from "@fastify/helmet";
import { AppModule } from "./app.module.js";
import { getEnv } from "./core/config/env.schema.js";
import { Rfc7807ExceptionFilter } from "./core/resilience/rfc7807-exception.filter.js";
import { createLogger } from "@workspace/logger";

async function bootstrap(): Promise<void> {
  const env = getEnv();
  const logger = createLogger("erp-backend");

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true,
      bodyLimit: 1048576 // 1MB strict limit
    })
  );

  await app.register(helmet);
  app.enableCors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true
  });

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });

  app.useGlobalFilters(new Rfc7807ExceptionFilter());
  app.enableShutdownHooks();

  await app.listen(env.PORT, "0.0.0.0");
  logger.info({ port: env.PORT, env: env.NODE_ENV }, "ERP Fastify Backend Online");
}

void bootstrap();
```

---

## PHASE 5: NEXT.JS 15+ FEATURE-SLICED FRONTEND (`apps/frontend`)

### File: `apps/frontend/package.json`
```json
{
  "name": "@workspace/frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.62.0",
    "@workspace/contracts": "workspace:*",
    "@workspace/ui": "workspace:*",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.2"
  }
}
```

### File: `apps/frontend/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### File: `apps/frontend/next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["@workspace/ui", "@workspace/contracts"],
  poweredByHeader: false
};

export default nextConfig;
```

### File: `apps/frontend/tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
```

### File: `apps/frontend/postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

### File: `apps/frontend/src/shared/api/http-client.ts`
```typescript
import type { z } from "zod";
import { generateUuidV7 } from "@workspace/contracts";

export interface FetchContractOptions<TSchema extends z.ZodTypeAny> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  schema: TSchema;
  idempotencyKey?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000/api/v1";

/**
 * Resilient HTTP Client with AbortController Timeouts, Jittered Exponential Backoff,
 * automatic Idempotency-Key generation on mutations, and runtime Zod contract validation.
 */
export async function fetchWithContract<TSchema extends z.ZodTypeAny>(
  path: string,
  options: FetchContractOptions<TSchema>
): Promise<z.infer<TSchema>> {
  const method = options.method ?? "GET";
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxRetries = method === "GET" ? (options.maxRetries ?? 2) : 0;
  const idempotencyKey =
    options.idempotencyKey ?? (method !== "GET" ? generateUuidV7() : undefined);

  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
      if (idempotencyKey !== undefined) {
        headers["Idempotency-Key"] = idempotencyKey;
      }

      const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : null,
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status >= 500 && attempt < maxRetries) {
          attempt++;
          const jitterDelay = Math.random() * Math.min(4000, 250 * Math.pow(2, attempt));
          await new Promise((r) => setTimeout(r, jitterDelay));
          continue;
        }
        throw new Error(`API_HTTP_ERROR_${String(response.status)}`);
      }

      const json: unknown = await response.json();
      return options.schema.parse(json);
    } catch (error) {
      clearTimeout(timer);
      if (attempt < maxRetries) {
        attempt++;
        const jitterDelay = Math.random() * Math.min(4000, 250 * Math.pow(2, attempt));
        await new Promise((r) => setTimeout(r, jitterDelay));
        continue;
      }
      throw error;
    }
  }
}
```

### File: `apps/frontend/src/shared/state/query-provider.tsx`
```tsx
"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AppQueryProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return <QueryClientProvider client="{queryClient}">{children}</QueryClientProvider>;
}
```

### File: `apps/frontend/src/features/system-health/api/use-system-health.ts`
```typescript
"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { HealthStatusSchema, type HealthStatus } from "@workspace/contracts";
import { fetchWithContract } from "@/shared/api/http-client";

export function useSystemHealth(): UseQueryResult<HealthStatus> {
  return useQuery({
    queryKey: ["system-health", "ready"],
    queryFn: () =>
      fetchWithContract("/health/ready", {
        schema: HealthStatusSchema
      })
  });
}
```

### File: `apps/frontend/src/features/system-health/ui/health-status-card.tsx`
```tsx
"use client";

import * as React from "react";
import { Button } from "@workspace/ui";
import { useSystemHealth } from "../api/use-system-health";

export function HealthStatusCard(): React.JSX.Element {
  const { data, isLoading, isError, refetch } = useSystemHealth();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">ERP Infrastructure Telemetry</h2>
          <p className="text-sm text-slate-500">
            Real-time readiness probe across Primary DB, Read Replicas, and Redis Cluster
          </p>
        </div>
        <Button onClick="{()" size="sm" variant="outline"> void refetch()}>
          Refresh Probe
        </Button>
      </div>

      <div className="mt-4">
        {isLoading && <p className="text-sm text-slate-600">Checking cluster readiness...</p>}
        {isError && (
          <p className="text-sm font-medium text-red-600">
            Backend offline or unreachable (Run `pnpm infra:up` and `pnpm dev`)
          </p>
        )}
        {data !== undefined && (
          <dl className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-sm">
            <div>
              <dt className="text-slate-500">Postgres Primary (Write)</dt>
              <dd className="font-mono font-semibold uppercase text-slate-900">
                {data.checks.postgresWrite}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Postgres Replica (Read)</dt>
              <dd className="font-mono font-semibold uppercase text-slate-900">
                {data.checks.postgresRead}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Redis Stampede Guard</dt>
              <dd className="font-mono font-semibold uppercase text-slate-900">
                {data.checks.redis}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
```

### File: `apps/frontend/src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### File: `apps/frontend/src/app/layout.tsx`
```tsx
import * as React from "react";
import type { Metadata } from "next";
import { AppQueryProvider } from "@/shared/state/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise ERP Platform",
  description: "High-reliability distributed ERP system"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AppQueryProvider>{children}</AppQueryProvider>
      </body>
    </html>
  );
}
```

### File: `apps/frontend/src/app/page.tsx`
```tsx
import * as React from "react";
import { HealthStatusCard } from "@/features/system-health/ui/health-status-card";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Enterprise ERP Control Plane
        </h1>
        <p className="text-sm text-slate-600">
          Hexagonal Domain Core + Feature-Sliced Architecture Baseline
        </p>
      </header>
      <HealthStatusCard/>
    </main>
  );
}
```

---

## PHASE 6: HIGH-CONCURRENCY DOCKER INFRASTRUCTURE (`docker/`)

### File: `docker/docker-compose.infra.yml`
```yaml
services:
  postgres-primary:
    image: postgres:17-alpine
    container_name: erp_postgres_primary
    environment:
      POSTGRES_USER: erp_user
      POSTGRES_PASSWORD: erp_pass
      POSTGRES_DB: erp_db
    ports:
      - "5432:5432"
    command: >
      postgres
      -c max_connections=200
      -c shared_buffers=256MB
      -c work_mem=16MB
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U erp_user -d erp_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgbouncer:
    image: edoburu/pgbouncer:latest
    container_name: erp_pgbouncer
    environment:
      DATABASE_URL: "postgres://erp_user:erp_pass@postgres-primary:5432/erp_db"
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 5000
      DEFAULT_POOL_SIZE: 25
      AUTH_TYPE: plain
    ports:
      - "6432:5432"
    depends_on:
      postgres-primary:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    container_name: erp_redis
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 512mb --maxmemory-policy volatile-lru --appendonly yes
```

---

## PHASE 7: 6-YEAR ARCHITECTURAL CONSTITUTION FILES

### File: `apps/backend/ARCHITECTURE_AND_RITUALS.md`
```markdown
# Backend 6-Year Longevity & Million-User Rituals

1. **Hexagonal Purity (`modules/*/domain/`):** Zero imports from `@nestjs/*`, `drizzle-orm`, or `fastify`. Pure TypeScript only.
2. **No Floating Point Money:** All financial amounts use `bigint` minor units (`MoneyMinorUnits`).
3. **UUIDv7 + Keyset Pagination Only:** `OFFSET` is banned on tables > 10,000 rows. Use `WHERE id > :cursor ORDER BY id ASC LIMIT :limit`.
4. **Transactional Outbox Mandate:** Never publish to Redis/BullMQ directly inside an HTTP request alongside a DB write. Always insert into `outbox_events` inside the same database transaction.
5. **Expand-and-Contract Migrations:** Never rename or drop a column in a single deployment. (1) Add nullable column, (2) Dual-write & backfill, (3) Switch reads, (4) Drop legacy column in next release.
```

### File: `apps/frontend/ARCHITECTURE_AND_RITUALS.md`
```markdown
# Frontend Feature-Sliced Design (FSD) Rituals

1. **Unidirectional Imports:** `app` -> `features` -> `shared` -> `@workspace/*`.
2. **Strict Feature Isolation:** A feature inside `src/features/A` can NEVER import from `src/features/B`. Compose them at the `src/app/` page level.
3. **Contract-Driven Networking:** Every network call must use `fetchWithContract` and validate the payload against a Zod schema from `@workspace/contracts`.
```

---

## PHASE 8: VERIFICATION GATE
Run the following commands in order and verify clean completion:
1. `pnpm install`
2. `pnpm --filter @workspace/contracts build`
3. `pnpm --filter @workspace/logger build`
4. `pnpm --filter @workspace/ui build`
5. `pnpm run typecheck`
6. `pnpm run lint`
7. `pnpm run build`