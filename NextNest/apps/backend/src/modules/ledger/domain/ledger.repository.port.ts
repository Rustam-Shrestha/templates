import type { LedgerEntryEntity } from "./ledger.entity.js";
import type { UuidV7 } from "@workspace/contracts";

export const LEDGER_REPOSITORY_PORT = Symbol("LEDGER_REPOSITORY_PORT");

export interface LedgerRepositoryPort {
  saveWithOutbox(entry: LedgerEntryEntity): Promise<void>;
  findByAccountCursor(accountId: UuidV7, limit: number, cursor?: UuidV7): Promise<LedgerEntryEntity[]>;
}

