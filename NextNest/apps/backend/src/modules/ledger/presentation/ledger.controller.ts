import { Body, Controller, Post, UseInterceptors, UsePipes } from "@nestjs/common";
import {
  CreateLedgerEntryRequestSchema,
  type CreateLedgerEntryRequest,
  type LedgerEntryResponse
} from "@workspace/contracts";
import { RecordLedgerEntryUseCase } from "../application/record-ledger-entry.usecase.js";
import { IdempotencyInterceptor } from "../../../core/idempotency/idempotency.interceptor.js";
import { ZodValidationPipe } from "../../../core/resilience/zod-validation.pipe.js";

@Controller("ledger")
@UseInterceptors(IdempotencyInterceptor)
export class LedgerController {
  constructor(private readonly recordLedgerUseCase: RecordLedgerEntryUseCase) {}

  @Post("entries")
  @UsePipes(new ZodValidationPipe(CreateLedgerEntryRequestSchema))
  async createEntry(@Body() body: CreateLedgerEntryRequest): Promise<LedgerEntryResponse> {
    return this.recordLedgerUseCase.execute(body);
  }
}

