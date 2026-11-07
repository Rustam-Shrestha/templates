import { z } from "zod";
import { UuidV7Schema } from "./primitives.js";

export const KycDocumentTypeSchema = z.enum([
  "CITIZENSHIP_FRONT",
  "CITIZENSHIP_BACK",
  "PASSPORT",
  "NATIONAL_ID",
  "SELFIE",
  "OTHER"
]);
export type KycDocumentType = z.infer<typeof KycDocumentTypeSchema>;

export const KycSubmitRequestSchema = z.object({
  userId: UuidV7Schema,
  documents: z
    .array(
      z.object({
        type: KycDocumentTypeSchema,
        filePath: z.string(),
        mimeType: z.string(),
        sizeBytes: z.number().positive()
      })
    )
    .min(1, "At least one document is required")
});
export type KycSubmitRequest = z.infer<typeof KycSubmitRequestSchema>;

export const KycDecisionRequestSchema = z.object({
  applicationId: UuidV7Schema,
  decision: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
  rejectionReason: z.string().min(10, "Rejection reason must be at least 10 characters").optional()
});
export type KycDecisionRequest = z.infer<typeof KycDecisionRequestSchema>;

