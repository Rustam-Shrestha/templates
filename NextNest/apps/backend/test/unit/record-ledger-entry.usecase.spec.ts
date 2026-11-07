import { describe, it, expect, vi } from "vitest";
import { RecordLedgerEntryUseCase } from "../../src/modules/ledger/application/record-ledger-entry.usecase.js";
import type { LedgerRepositoryPort } from "../../src/modules/ledger/domain/ledger.repository.port.js";
import { generateUuidV7 } from "@workspace/contracts";

describe("RecordLedgerEntryUseCase Unit Tests (§5)", () => {
  it("should call repository port once and return matching DTO", async () => {
    const mockRepo: LedgerRepositoryPort = {
      saveWithOutbox: vi.fn().mockResolvedValue(undefined),
      findByAccountCursor: vi.fn().mockResolvedValue([])
    };

    const useCase = new RecordLedgerEntryUseCase(mockRepo);
    const accountId = generateUuidV7();

    const result = await useCase.execute({
      accountId,
      amountMinor: "25000",
      currency: "USD",
      referenceNote: "Invoice settlement"
    });

    expect(mockRepo.saveWithOutbox).toHaveBeenCalledTimes(1);
    expect(result.accountId).toBe(accountId);
    expect(result.amountMinor).toBe("25000");
    expect(result.currency).toBe("USD");
    expect(result.referenceNote).toBe("Invoice settlement");
    expect(result.id).toBeDefined();
    expect(result.createdAtIso).toBeDefined();
  });
});

