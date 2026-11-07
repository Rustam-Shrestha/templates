import { describe, it, expect } from "vitest";
import { LedgerEntryEntity } from "../../src/modules/ledger/domain/ledger.entity.js";
import { generateUuidV7 } from "@workspace/contracts";

describe("LedgerEntryEntity Domain Unit Tests (§5)", () => {
  it("should throw LEDGER_INVARIANT_VIOLATION when amountMinor is zero", () => {
    const accountId = generateUuidV7();
    expect(() =>
      LedgerEntryEntity.create({
        accountId,
        amountMinor: 0n,
        currency: "NPR",
        referenceNote: "Illegal zero amount"
      })
    ).toThrow("LEDGER_INVARIANT_VIOLATION: Transaction amount cannot be zero.");
  });

  it("should successfully create entity with positive or negative amountMinor", () => {
    const accountId = generateUuidV7();
    const entry = LedgerEntryEntity.create({
      accountId,
      amountMinor: 150000n,
      currency: "NPR",
      referenceNote: "Payment received"
    });

    expect(entry.id).toBeDefined();
    expect(entry.accountId).toBe(accountId);
    expect(entry.amountMinor).toBe(150000n);
    expect(entry.currency).toBe("NPR");
    expect(entry.createdAt).toBeInstanceOf(Date);
  });

  it("should preserve original id and createdAt when using rehydrate() (§1.3)", () => {
    const fixedId = generateUuidV7();
    const fixedAccountId = generateUuidV7();
    const historicalTimestamp = new Date("2024-01-01T00:00:00.000Z");

    const rehydrated = LedgerEntryEntity.rehydrate({
      id: fixedId,
      accountId: fixedAccountId,
      amountMinor: -4500n,
      currency: "USD",
      referenceNote: "Fee deduction",
      createdAt: historicalTimestamp
    });

    expect(rehydrated.id).toBe(fixedId);
    expect(rehydrated.accountId).toBe(fixedAccountId);
    expect(rehydrated.createdAt.getTime()).toBe(historicalTimestamp.getTime());
    expect(rehydrated.amountMinor).toBe(-4500n);
  });
});

