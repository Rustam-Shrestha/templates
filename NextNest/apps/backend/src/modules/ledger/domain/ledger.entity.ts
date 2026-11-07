import {
  generateUuidV7,
  MoneyMinorUnitsSchema,
  type UuidV7,
  type MoneyMinorUnits,
  type CurrencyCode
} from "@workspace/contracts";

/**
 * PURE HEXAGONAL DOMAIN ENTITY.
 * Zero framework or ORM imports. Survives 6+ years of framework churn unchanged.
 */
export class LedgerEntryEntity {
  private constructor(
    public readonly id: UuidV7,
    public readonly accountId: UuidV7,
    public readonly amountMinor: MoneyMinorUnits,
    public readonly currency: CurrencyCode,
    public readonly referenceNote: string,
    public readonly createdAt: Date
  ) {}

  /**
   * Factory for creating a brand new ledger transaction.
   * Generates new time-ordered UUIDv7 and sets current timestamp.
   */
  public static create(params: {
    accountId: UuidV7;
    amountMinor: bigint;
    currency: CurrencyCode;
    referenceNote: string;
  }): LedgerEntryEntity {
    if (params.amountMinor === 0n) {
      throw new Error("LEDGER_INVARIANT_VIOLATION: Transaction amount cannot be zero.");
    }
    return new LedgerEntryEntity(
      generateUuidV7(),
      params.accountId,
      MoneyMinorUnitsSchema.parse(params.amountMinor),
      params.currency,
      params.referenceNote.trim(),
      new Date()
    );
  }

  /**
   * Factory for rehydrating an existing entity from persistent storage (§1.3).
   * Strictly preserves existing ID and timestamps without fabricating new values.
   */
  public static rehydrate(params: {
    id: UuidV7;
    accountId: UuidV7;
    amountMinor: bigint;
    currency: CurrencyCode;
    referenceNote: string;
    createdAt: Date;
  }): LedgerEntryEntity {
    return new LedgerEntryEntity(
      params.id,
      params.accountId,
      MoneyMinorUnitsSchema.parse(params.amountMinor),
      params.currency,
      params.referenceNote,
      params.createdAt
    );
  }
}

