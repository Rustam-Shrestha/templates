import { Module } from "@nestjs/common";
import { LedgerController } from "./ledger.controller.js";
import { RecordLedgerEntryUseCase } from "../application/record-ledger-entry.usecase.js";
import { DrizzleLedgerRepository } from "../infrastructure/drizzle-ledger.repository.js";
import { LEDGER_REPOSITORY_PORT } from "../domain/ledger.repository.port.js";
import { IdempotencyModule } from "../../../core/idempotency/idempotency.module.js";

@Module({
  imports: [IdempotencyModule],
  controllers: [LedgerController],
  providers: [
    RecordLedgerEntryUseCase,
    {
      provide: LEDGER_REPOSITORY_PORT,
      useClass: DrizzleLedgerRepository
    }
  ]
})
export class LedgerModule {}

