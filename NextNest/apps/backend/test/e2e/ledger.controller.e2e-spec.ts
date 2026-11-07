import { describe, it, expect, vi } from "vitest";
import { ZodValidationPipe } from "../../src/core/resilience/zod-validation.pipe.js";
import { CreateLedgerEntryRequestSchema, generateUuidV7 } from "@workspace/contracts";
import { RecordLedgerEntryUseCase } from "../../src/modules/ledger/application/record-ledger-entry.usecase.js";
import { LedgerController } from "../../src/modules/ledger/presentation/ledger.controller.js";

describe("Ledger Controller & Contract E2E (§5)", () => {
  it("should validate valid request payloads via ZodValidationPipe and return 201 equivalent response", async () => {
    const mockUseCase = {
      execute: vi.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: generateUuidV7(),
          accountId: dto.accountId,
          amountMinor: dto.amountMinor,
          currency: dto.currency,
          referenceNote: dto.referenceNote,
          createdAtIso: new Date().toISOString()
        })
      )
    } as unknown as RecordLedgerEntryUseCase;

    const controller = new LedgerController(mockUseCase);
    const pipe = new ZodValidationPipe(CreateLedgerEntryRequestSchema);

    const validPayload = {
      accountId: generateUuidV7(),
      amountMinor: "1500",
      currency: "NPR",
      referenceNote: "Valid deposit"
    };

    const transformed = pipe.transform(validPayload);
    const response = await controller.createEntry(transformed as typeof validPayload);

    expect(response.amountMinor).toBe("1500");
    expect(response.currency).toBe("NPR");
    expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should reject invalid request payload with ZodError (translating to RFC 7807 400 ProblemDetails)", () => {
    const pipe = new ZodValidationPipe(CreateLedgerEntryRequestSchema);

    expect(() =>
      pipe.transform({
        accountId: "invalid-not-uuid",
        amountMinor: "1.5", // Decimals forbidden
        currency: "XYZ", // Invalid currency
        referenceNote: ""
      })
    ).toThrow();
  });
});

