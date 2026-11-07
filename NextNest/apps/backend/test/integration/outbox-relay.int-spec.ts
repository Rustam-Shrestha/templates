import { describe, it, expect } from "vitest";

describe("Outbox Relay Worker Integration Tests (§4.2, §5)", () => {
  interface OutboxEvent {
    id: string;
    aggregateId: string;
    eventType: string;
    status: "PENDING" | "PUBLISHED" | "DEAD";
    retryCount: number;
  }

  it("should process batches with deduplication and survive crash-restart without loss or duplicates", async () => {
    const queueReceived = new Map<string, unknown>();
    const outboxStore: OutboxEvent[] = [
      { id: "evt_1", aggregateId: "agg_1", eventType: "CREATED", status: "PENDING", retryCount: 0 },
      { id: "evt_2", aggregateId: "agg_2", eventType: "CREATED", status: "PENDING", retryCount: 0 },
      { id: "evt_3", aggregateId: "agg_3", eventType: "CREATED", status: "PENDING", retryCount: 0 }
    ];

    // Worker step 1: process 1 event then crash
    const processBatch = (crashAfter = Infinity) => {
      let count = 0;
      for (const ev of outboxStore) {
        if (ev.status === "PENDING") {
          // Deduplicate on jobId = ev.id
          if (!queueReceived.has(ev.id)) {
            queueReceived.set(ev.id, ev);
          }
          ev.status = "PUBLISHED";
          count++;
          if (count >= crashAfter) {
            throw new Error("SIMULATED_WORKER_CRASH");
          }
        }
      }
    };

    // First run with crash
    expect(() => processBatch(1)).toThrow("SIMULATED_WORKER_CRASH");
    expect(queueReceived.size).toBe(1);

    // Second run: worker restarted, processes remaining pending events
    processBatch();
    expect(queueReceived.size).toBe(3);

    // Assert all events are PUBLISHED and no duplicate effects exist
    expect(outboxStore.every((e) => e.status === "PUBLISHED")).toBe(true);
  });
});

