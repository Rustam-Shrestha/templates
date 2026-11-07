import { describe, it, expect } from "vitest";
import { HealthStatusSchema } from "@workspace/contracts";

describe("HealthStatusCard & Contract Parsing Tests (§5)", () => {
  it("should validate and parse compliant HealthStatus telemetry payload", () => {
    const mockTelemetry = {
      status: "ok",
      service: "erp-backend",
      version: "1.0.0",
      uptimeSeconds: 3600,
      timestamp: new Date().toISOString(),
      checks: {
        postgresWrite: "up",
        postgresRead: "up",
        redis: "up",
        topology: "single_database_shared_endpoint"
      }
    };

    const parsed = HealthStatusSchema.safeParse(mockTelemetry);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.checks.postgresWrite).toBe("up");
      expect(parsed.data.checks.redis).toBe("up");
    }
  });

  it("should fail validation if telemetry structure is corrupted", () => {
    const invalidTelemetry = {
      status: "unknown",
      service: "erp-backend"
    };

    const parsed = HealthStatusSchema.safeParse(invalidTelemetry);
    expect(parsed.success).toBe(false);
  });
});

