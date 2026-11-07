import "reflect-metadata";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { getEnv } from "./core/config/env.schema.js";
import { outboxEvents } from "./core/database/schema.js";
import { createLogger } from "@workspace/logger";

const logger = createLogger("outbox-relay-worker");

export async function runOutboxRelay(): Promise<void> {
  const env = getEnv();

  const sqlClient = postgres(env.DATABASE_WRITE_URL, {
    max: 5,
    prepare: false,
    connection: {
      statement_timeout: 5000
    }
  });
  const db = drizzle(sqlClient);

  const redisConnection = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });

  const eventQueue = new Queue("ledger-events", {
    connection: redisConnection
  });

  let isRunning = true;

  const shutdown = async (): Promise<void> => {
    logger.info("Outbox worker shutting down gracefully...");
    isRunning = false;
    await eventQueue.close();
    await redisConnection.quit().catch(() => undefined);
    await sqlClient.end({ timeout: 5 }).catch(() => undefined);
    logger.info("Outbox worker terminated.");
  };

  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());

  logger.info("Outbox Relay Worker online. Polling FOR UPDATE SKIP LOCKED...");

  while (isRunning) {
    let batchSize = 0;

    try {
      await db.transaction(async (tx) => {
        // §4.2: Select batch with FOR UPDATE SKIP LOCKED
        const pendingRows = await tx.execute<{
          id: string;
          aggregate_type: string;
          aggregate_id: string;
          event_type: string;
          payload: unknown;
          retry_count: number;
        }>(sql`
          SELECT id, aggregate_type, aggregate_id, event_type, payload, retry_count
          FROM ${outboxEvents}
          WHERE status = 'PENDING' AND retry_count < 10
          ORDER BY created_at ASC
          LIMIT 100
          FOR UPDATE SKIP LOCKED
        `);

        batchSize = pendingRows.length;
        if (batchSize === 0) return;

        logger.info({ batchSize }, "Relaying outbox event batch to BullMQ");

        for (const row of pendingRows) {
          try {
            // Deduplicate on jobId = event.id (§4.2)
            await eventQueue.add(
              row.event_type,
              {
                id: row.id,
                aggregateType: row.aggregate_type,
                aggregateId: row.aggregate_id,
                payload: row.payload
              },
              {
                jobId: row.id,
                removeOnComplete: true,
                removeOnFail: false
              }
            );

            await tx.execute(sql`
              UPDATE ${outboxEvents}
              SET status = 'PUBLISHED', processed_at = NOW()
              WHERE id = ${row.id}
            `);
          } catch (err) {
            const nextRetries = row.retry_count + 1;
            const newStatus = nextRetries >= 10 ? "DEAD" : "PENDING";
            logger.error({ err, eventId: row.id, nextRetries, newStatus }, "Failed to relay event");

            await tx.execute(sql`
              UPDATE ${outboxEvents}
              SET retry_count = ${nextRetries},
                  status = ${newStatus}
              WHERE id = ${row.id}
            `);
          }
        }
      });
    } catch (error) {
      logger.error({ error }, "Error during outbox relay batch transaction");
    }

    if (!isRunning) break;

    // §4.2: Poll interval 500 ms when batch was non-empty, otherwise 2000 ms
    const sleepMs = batchSize > 0 ? 500 : 2000;
    await new Promise((r) => setTimeout(r, sleepMs));
  }
}

// Only auto-run if directly invoked
if (process.argv[1]?.endsWith("worker.ts") || process.argv[1]?.endsWith("worker.js")) {
  void runOutboxRelay();
}

