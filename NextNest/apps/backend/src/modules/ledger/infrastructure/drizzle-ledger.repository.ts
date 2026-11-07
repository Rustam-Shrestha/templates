import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, gt } from "drizzle-orm";
import { DB_WRITE, DB_READ, type DbConnection } from "../../../core/database/db.module.js";
import { ledgerEntries, outboxEvents } from "../../../core/database/schema.js";
import type { LedgerRepositoryPort } from "../domain/ledger.repository.port.js";
import { LedgerEntryEntity } from "../domain/ledger.entity.js";
import {
  generateUuidV7,
  UuidV7Schema,
  CurrencyCodeSchema,
  type UuidV7
} from "@workspace/contracts";

@Injectable()
export class DrizzleLedgerRepository implements LedgerRepositoryPort {
  constructor(
    @Inject(DB_WRITE) private readonly writeConn: DbConnection,
    @Inject(DB_READ) private readonly readConn: DbConnection
  ) {}

  /**
   * Executes atomic DB transaction inserting both the financial record AND the outbox event.
   * Guarantees zero dual-write data loss.
   */
  async saveWithOutbox(entry: LedgerEntryEntity): Promise<void> {
    await this.writeConn.db.transaction(async (tx) => {
      await tx.insert(ledgerEntries).values({
        id: entry.id,
        accountId: entry.accountId,
        amountMinor: entry.amountMinor,
        currency: entry.currency,
        referenceNote: entry.referenceNote,
        createdAt: entry.createdAt
      });

      await tx.insert(outboxEvents).values({
        id: generateUuidV7(),
        aggregateType: "LEDGER_ENTRY",
        aggregateId: entry.id,
        eventType: "LEDGER_ENTRY_RECORDED",
        payload: {
          id: entry.id,
          accountId: entry.accountId,
          amountMinor: entry.amountMinor.toString(),
          currency: entry.currency
        },
        status: "PENDING"
      });
    });
  }

  /**
   * Queries Read Replica using O(log N) UUIDv7 Keyset/Cursor Pagination.
   * Strictly uses LedgerEntryEntity.rehydrate to preserve stored identities and timestamps (§1.3).
   */
  async findByAccountCursor(
    accountId: UuidV7,
    limit: number,
    cursor?: UuidV7
  ): Promise<LedgerEntryEntity[]> {
    const whereClause =
      cursor !== undefined
        ? and(eq(ledgerEntries.accountId, accountId), gt(ledgerEntries.id, cursor))
        : eq(ledgerEntries.accountId, accountId);

    const rows = await this.readConn.db
      .select()
      .from(ledgerEntries)
      .where(whereClause)
      .orderBy(asc(ledgerEntries.id))
      .limit(limit);

    return rows.map((r) =>
      LedgerEntryEntity.rehydrate({
        id: UuidV7Schema.parse(r.id),
        accountId: UuidV7Schema.parse(r.accountId),
        amountMinor: r.amountMinor,
        currency: CurrencyCodeSchema.parse(r.currency),
        referenceNote: r.referenceNote,
        createdAt: r.createdAt
      })
    );
  }
}

