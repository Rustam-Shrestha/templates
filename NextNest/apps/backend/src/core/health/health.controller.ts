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

    const timeoutPromise = <T>(promise: Promise<T>, ms = 1000): Promise<T> =>
      Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
      ]);

    const [pgWrite, pgRead, redisPing] = await Promise.allSettled([
      timeoutPromise(this.writeDb.db.execute(sql`SELECT 1`)),
      timeoutPromise(this.readDb.db.execute(sql`SELECT 1`)),
      timeoutPromise(this.redis.client.ping())
    ]);

    const checks = {
      postgresWrite: pgWrite.status === "fulfilled" ? ("up" as const) : ("down" as const),
      postgresRead: pgRead.status === "fulfilled" ? ("up" as const) : ("down" as const),
      redis: redisPing.status === "fulfilled" ? ("up" as const) : ("down" as const),
      topology: "single_database_shared_endpoint" as const
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

