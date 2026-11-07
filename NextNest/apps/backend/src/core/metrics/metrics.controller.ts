import { Controller, Get, Inject } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { DB_READ, type DbConnection } from "../database/db.module.js";
import { outboxEvents } from "../database/schema.js";

@Controller("metrics")
export class MetricsController {
  constructor(@Inject(DB_READ) private readonly readDb: DbConnection) {}

  @Get()
  async getMetrics(): Promise<string> {
    const result = await this.readDb.db
      .select({ count: sql<number>`count(*)::int` })
      .from(outboxEvents)
      .where(sql`${outboxEvents.status} = 'PENDING'`);

    const pendingCount = result[0]?.count ?? 0;
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    return `# HELP outbox_pending Number of pending outbox events awaiting relay
# TYPE outbox_pending gauge
outbox_pending ${pendingCount}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds counter
process_uptime_seconds ${Math.floor(uptime)}

# HELP process_resident_memory_bytes Resident memory size in bytes
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes ${memory.rss}
`;
  }
}

