import { describe, it, expect } from "vitest";
import { generateUuidV7, UuidV7Schema, CreateLedgerEntryRequestSchema } from "./index.js";

describe("Contracts & Primitives (§5 Specification)", () => {
  it("should generate valid RFC 9562 UUIDv7 with version nibble 7 and variant 10xx", () => {
    const id = generateUuidV7();
    expect(UuidV7Schema.safeParse(id).success).toBe(true);

    const parts = id.split("-");
    expect(parts).toHaveLength(5);

    // Version is in 3rd segment, high nibble: xxxx -> 7xxx
    const timeHiAndVersion = parts[2] ?? "";
    expect(timeHiAndVersion[0]).toBe("7");

    // Variant is in 4th segment, high 2 bits: 10xxxxxx -> 8, 9, a, or b
    const clockSeqHi = parts[3] ?? "";
    const firstChar = clockSeqHi[0]?.toLowerCase() ?? "";
    expect(["8", "9", "a", "b"]).toContain(firstChar);
  });

  it("should reject invalid amountMinor strings: decimals, empty, exponents, negative zero", () => {
    const invalidAmounts = ["1.5", "", "1e3", "-0", "0123", "abc", " 100", "100 "];

    for (const amount of invalidAmounts) {
      const result = CreateLedgerEntryRequestSchema.safeParse({
        accountId: generateUuidV7(),
        amountMinor: amount,
        currency: "NPR",
        referenceNote: "Test rejection"
      });
      expect(result.success).toBe(false);
    }
  });

  it("should accept valid positive and negative integer minor unit strings", () => {
    const validAmounts = ["1500", "-500", "1000000000", "-9999999999"];

    for (const amount of validAmounts) {
      const result = CreateLedgerEntryRequestSchema.safeParse({
        accountId: generateUuidV7(),
        amountMinor: amount,
        currency: "USD",
        referenceNote: "Valid entry"
      });
      expect(result.success).toBe(true);
    }
  });
});

