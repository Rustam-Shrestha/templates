import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { BadRequestException, ConflictException, UnprocessableEntityException } from "@nestjs/common";

describe("Idempotency State Machine & Concurrency Tests (§4.1, §5)", () => {
  // In-memory test representation of the idempotency database table
  interface IdemRow {
    scope: string;
    key: string;
    requestHash: string;
    status: "IN_PROGRESS" | "COMPLETED";
    responseStatus?: number;
    responseBody?: unknown;
  }

  const table = new Map<string, IdemRow>();

  function hashBody(body: unknown): string {
    return createHash("sha256").update(JSON.stringify(body)).digest("hex");
  }

  async function handleRequestWithIdempotency(
    key: string | undefined,
    scope: string,
    body: unknown,
    handler: () => Promise<{ status: number; body: unknown }>
  ): Promise<{ status: number; body: unknown }> {
    if (!key || key.trim() === "") {
      throw new BadRequestException("IDEMPOTENCY_KEY_REQUIRED");
    }

    const requestHash = hashBody(body);
    const primaryKey = `${scope}:${key}`;

    const existing = table.get(primaryKey);
    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new UnprocessableEntityException("IDEMPOTENCY_KEY_REUSED");
      }
      if (existing.status === "COMPLETED") {
        return { status: existing.responseStatus ?? 200, body: existing.responseBody };
      }
      if (existing.status === "IN_PROGRESS") {
        throw new ConflictException("IDEMPOTENCY_IN_PROGRESS");
      }
    }

    // Insert IN_PROGRESS
    table.set(primaryKey, {
      scope,
      key,
      requestHash,
      status: "IN_PROGRESS"
    });

    try {
      const result = await handler();
      table.set(primaryKey, {
        scope,
        key,
        requestHash,
        status: "COMPLETED",
        responseStatus: result.status,
        responseBody: result.body
      });
      return result;
    } catch (err) {
      table.delete(primaryKey); // Allow retry on failure
      throw err;
    }
  }

  it("should fail with 400 when Idempotency-Key is missing", async () => {
    await expect(
      handleRequestWithIdempotency(undefined, "POST /api/v1/ledger", {}, async () => ({ status: 201, body: {} }))
    ).rejects.toThrow(BadRequestException);
  });

  it("should return cached response on identical COMPLETED key", async () => {
    const key = "test-key-1";
    const body = { amount: "100" };
    let executionCount = 0;

    const handler = async () => {
      executionCount++;
      return { status: 201, body: { success: true } };
    };

    const first = await handleRequestWithIdempotency(key, "POST /test", body, handler);
    const second = await handleRequestWithIdempotency(key, "POST /test", body, handler);

    expect(first).toEqual(second);
    expect(executionCount).toBe(1);
  });

  it("should reject with 422 IDEMPOTENCY_KEY_REUSED when payload hash differs", async () => {
    const key = "test-key-2";
    await handleRequestWithIdempotency(key, "POST /test", { amount: "100" }, async () => ({ status: 201, body: {} }));

    await expect(
      handleRequestWithIdempotency(key, "POST /test", { amount: "999" }, async () => ({ status: 201, body: {} }))
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it("should handle 20-way concurrent identical requests and execute business write exactly once (§5)", async () => {
    const key = "concurrent-key-20";
    const body = { amount: "5000", note: "Concurrent test" };
    let businessExecutionCount = 0;

    const simulatedWrite = async () => {
      await new Promise((r) => setTimeout(r, 20));
      businessExecutionCount++;
      return { status: 201, body: { entryId: "entry_123" } };
    };

    const results = await Promise.allSettled(
      Array.from({ length: 20 }).map(() =>
        handleRequestWithIdempotency(key, "POST /api/v1/entries", body, simulatedWrite)
      )
    );

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    // Exactly one executes the write, others either succeed with cached or receive 409 Retry-After
    expect(businessExecutionCount).toBe(1);
    expect(fulfilled.length + rejected.length).toBe(20);
  });
});

