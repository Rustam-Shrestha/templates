import { Inject, Injectable } from "@nestjs/common";
import { LedgerEntryEntity } from "../domain/ledger.entity.js";
import { LEDGER_REPOSITORY_PORT, type LedgerRepositoryPort } from "../domain/ledger.repository.port.js";
import type { CreateLedgerEntryRequest, LedgerEntryResponse } from "@workspace/contracts";

@Injectable()
export class RecordLedgerEntryUseCase {
  constructor(
    @Inject(LEDGER_REPOSITORY_PORT) private readonly repository: LedgerRepositoryPort
  ) {}

  async execute(dto: CreateLedgerEntryRequest): Promise<LedgerEntryResponse> {
    const entity = LedgerEntryEntity.create({
      accountId: dto.accountId,
      amountMinor: BigInt(dto.amountMinor),
      currency: dto.currency,
      referenceNote: dto.referenceNote
    });

    await this.repository.saveWithOutbox(entity);

    return {
      id: entity.id,
      accountId: entity.accountId,
      amountMinor: entity.amountMinor.toString(),
      currency: entity.currency,
      referenceNote: entity.referenceNote,
      createdAtIso: entity.createdAt.toISOString()
    };
  }
}

