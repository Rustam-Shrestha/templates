import { describe, expect, it } from "vitest";
import { PasswordHasher } from "./password-hasher.js";

describe("PasswordHasher", () => {
  it("hashes password with bcrypt and verifies matching plaintext", async () => {
    const raw = "SecurePass123!@#";
    const hashed = await PasswordHasher.hash(raw, 10); // 10 rounds in tests for speed

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(raw);
    expect(hashed.startsWith("$2")).toBe(true);

    const isMatch = await PasswordHasher.verify(raw, hashed);
    expect(isMatch).toBe(true);

    const isMismatch = await PasswordHasher.verify("WrongPassword", hashed);
    expect(isMismatch).toBe(false);
  });

  it("throws when hashing an empty string", async () => {
    await expect(PasswordHasher.hash("")).rejects.toThrow("Password to hash must not be empty");
  });

  it("returns false when verifying empty inputs", async () => {
    expect(await PasswordHasher.verify("", "some-hash")).toBe(false);
    expect(await PasswordHasher.verify("pass", "")).toBe(false);
  });
});

