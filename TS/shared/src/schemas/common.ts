import { z } from 'zod';

export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' });

export const isoDateTimeSchema = z.string().datetime({ message: 'Invalid ISO 8601 datetime' });

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).optional(),
});

export const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string(),
    details: z.unknown().optional(),
  }),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;

