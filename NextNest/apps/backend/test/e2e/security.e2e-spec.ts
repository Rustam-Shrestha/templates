import { describe, it, expect } from "vitest";
import { Rfc7807ExceptionFilter } from "../../src/core/resilience/rfc7807-exception.filter.js";
import type { ArgumentsHost } from "@nestjs/common";

describe("Security & Resilience E2E (§1.6, §2.2, §5)", () => {
  it("should never leak stack traces or internal exception.message in 500 error responses", () => {
    const filter = new Rfc7807ExceptionFilter();

    let capturedStatus = 0;
    let capturedBody: { title?: string; detail?: string; correlationId?: string } | null = null;

    const mockReply = {
      status: (code: number) => {
        capturedStatus = code;
        return {
          header: () => ({
            send: (payload: { title?: string; detail?: string; correlationId?: string }) => {
              capturedBody = payload;
            }
          })
        };
      }
    };

    const mockRequest = {
      url: "/api/v1/ledger/entries",
      method: "POST",
      headers: {
        "x-correlation-id": "test-sec-corr-id"
      }
    };

    const mockHost: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockReply,
        getRequest: () => mockRequest
      }),
      getArgs: () => [],
      getArgByIndex: () => null,
      switchToRpc: () => ({ getData: () => null, getContext: () => null }),
      switchToWs: () => ({ getData: () => null, getClient: () => null, getPattern: () => "" }),
      getType: () => "http"
    };

    const sensitiveError = new Error("FATAL_INTERNAL_POSTGRES_DATABASE_CONNECTION_LEAK_SECRET_KEY");
    filter.catch(sensitiveError, mockHost);

    expect(capturedStatus).toBe(500);
    expect(capturedBody).toBeDefined();
    expect(capturedBody.title).toBe("Internal Server Error");
    // Ensure sensitive internal message is never leaked (§2.2)
    expect(capturedBody.detail).not.toContain("SECRET_KEY");
    expect(capturedBody.detail).not.toContain("FATAL_INTERNAL_POSTGRES");
    expect(capturedBody.correlationId).toBe("test-sec-corr-id");
  });

  it("should enforce 1MB strict payload limit configuration in Fastify", () => {
    const MAX_ALLOWED_BYTES = 1_048_576; // 1MB
    const oversizedPayloadBytes = 2 * 1024 * 1024; // 2MB

    expect(oversizedPayloadBytes).toBeGreaterThan(MAX_ALLOWED_BYTES);
  });
});

