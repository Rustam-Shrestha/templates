import { describe, it, expect } from "vitest";
import { Writable } from "node:stream";
import { createLogger } from "./index.js";

describe("Structured Logger & PII Redaction (§2.5)", () => {
  it("should redact authorization headers and nested sensitive fields (password, token, ssn)", async () => {
    let captured = "";
    const stream = new Writable({
      write(chunk, _encoding, callback) {
        captured += chunk.toString();
        callback();
      }
    });

    const logger = createLogger("test-service", stream);

    logger.info({
      req: {
        headers: {
          authorization: "Bearer super-secret-jwt-token",
          cookie: "sessionId=abc123xyz"
        }
      },
      user: {
        id: "usr_123",
        password: "MyPlainPassword123!",
        token: "session-token-456",
        ssn: "000-12-3456"
      },
      payload: {
        secret: "confidential_key"
      }
    }, "User action logged");

    expect(captured).not.toContain("super-secret-jwt-token");
    expect(captured).not.toContain("sessionId=abc123xyz");
    expect(captured).not.toContain("MyPlainPassword123!");
    expect(captured).not.toContain("session-token-456");
    expect(captured).not.toContain("000-12-3456");
    expect(captured).not.toContain("confidential_key");

    expect(captured).toContain("[REDACTED_PII]");
  });
});

