import { z } from "zod";
import { UuidV7Schema, CurrencyCodeSchema } from "./primitives.js";

export const LoanPurposeSchema = z.enum(["PERSONAL", "BUSINESS", "EDUCATION", "HOME"]);
export type LoanPurpose = z.infer<typeof LoanPurposeSchema>;

export const LoanStatusSchema = z.enum([
  "SUBMITTED",
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "DISBURSED",
  "ACTIVE",
  "CLOSED"
]);
export type LoanStatus = z.infer<typeof LoanStatusSchema>;

export const LoanApplicationRequestSchema = z.object({
  borrowerId: UuidV7Schema,
  amountMinor: z.string().regex(/^[1-9]\d*$/, "Must be a positive integer in minor units"),
  currency: CurrencyCodeSchema,
  purpose: LoanPurposeSchema,
  termMonths: z.coerce.number().int().min(6).max(60),
  monthlyIncomeMinor: z.string().regex(/^[1-9]\d*$/).optional(),
  employmentYears: z.coerce.number().min(0).optional()
});
export type LoanApplicationRequest = z.infer<typeof LoanApplicationRequestSchema>;

export const LoanDecisionRequestSchema = z.object({
  loanId: UuidV7Schema,
  decision: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
  rejectionReason: z.string().min(10).optional(),
  interestRateBasisPoints: z.coerce.number().int().min(0).max(10000).optional()
});
export type LoanDecisionRequest = z.infer<typeof LoanDecisionRequestSchema>;

