import { z } from "zod";
import { UuidV7Schema, CurrencyCodeSchema } from "./primitives.js";

// RFC 7807 Standard Problem Details
export const ProblemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string(),
  instance: z.string(),
  correlationId: z.string(),
  timestamp: z.iso.datetime()
});
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

export const HealthStatusSchema = z.object({
  status: z.enum(["ok", "degraded", "down"]),
  service: z.string(),
  version: z.string(),
  uptimeSeconds: z.number(),
  timestamp: z.iso.datetime(),
  checks: z.object({
    postgresWrite: z.enum(["up", "down"]),
    postgresRead: z.enum(["up", "down"]),
    redis: z.enum(["up", "down"]),
    topology: z.literal("single_database_shared_endpoint")
  })
});
export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export const CreateLedgerEntryRequestSchema = z.object({
  accountId: UuidV7Schema,
  amountMinor: z
    .string()
    .regex(
      /^(?:0|-?[1-9]\d*)$/,
      "Must be integer minor units as string (decimals, exponents, and negative zero are forbidden)"
    ),
  currency: CurrencyCodeSchema,
  referenceNote: z.string().min(1).max(255)
});
export type CreateLedgerEntryRequest = z.infer<typeof CreateLedgerEntryRequestSchema>;

export const LedgerEntryResponseSchema = z.object({
  id: UuidV7Schema,
  accountId: UuidV7Schema,
  amountMinor: z.string(),
  currency: CurrencyCodeSchema,
  referenceNote: z.string(),
  createdAtIso: z.iso.datetime()
});
export type LedgerEntryResponse = z.infer<typeof LedgerEntryResponseSchema>;

