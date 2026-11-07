import { Module } from "@nestjs/common";
import { DatabaseModule } from "./core/database/db.module.js";
import { RedisModule } from "./core/cache/redis.module.js";
import { HealthController } from "./core/health/health.controller.js";
import { MetricsController } from "./core/metrics/metrics.controller.js";
import { LedgerModule } from "./modules/ledger/presentation/ledger.module.js";
import { IdempotencyModule } from "./core/idempotency/idempotency.module.js";

@Module({
  imports: [DatabaseModule, RedisModule, IdempotencyModule, LedgerModule],
  controllers: [HealthController, MetricsController]
})
export class AppModule {}

