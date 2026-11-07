import { z } from "zod";

export const UuidV7Schema = z.uuid().brand<"UuidV7">();
export type UuidV7 = z.infer<typeof UuidV7Schema>;

/**
 * Generates time-ordered RFC 9562 UUIDv7.
 * Eliminates B-Tree index fragmentation in PostgreSQL at 100M+ rows.
 * Cross-platform: operates in both Node.js and Browser environments via standard Web Crypto.
 */
export function generateUuidV7(): UuidV7 {
  const timestamp = BigInt(Date.now());
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);

  bytes[0] = Number((timestamp >> 40n) & 0xffn);
  bytes[1] = Number((timestamp >> 32n) & 0xffn);
  bytes[2] = Number((timestamp >> 24n) & 0xffn);
  bytes[3] = Number((timestamp >> 16n) & 0xffn);
  bytes[4] = Number((timestamp >> 8n) & 0xffn);
  bytes[5] = Number(timestamp & 0xffn);

  // Version 7: 0b0111xxxx
  const b6 = bytes[6] ?? 0;
  bytes[6] = (b6 & 0x0f) | 0x70;
  // Variant: 0b10xxxxxx
  const b8 = bytes[8] ?? 0;
  bytes[8] = (b8 & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  return UuidV7Schema.parse(uuid);
}

/**
 * Monetary values strictly represented in integer minor units (paisa/cents).
 * Floating point math is strictly forbidden.
 */
export const MoneyMinorUnitsSchema = z.coerce.bigint().brand<"MoneyMinorUnits">();
export type MoneyMinorUnits = z.infer<typeof MoneyMinorUnitsSchema>;

export const CurrencyCodeSchema = z.enum(["NPR", "USD", "EUR", "GBP"]);
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

export const CursorPaginationQuerySchema = z.object({
  cursor: UuidV7Schema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});
export type CursorPaginationQuery = z.infer<typeof CursorPaginationQuerySchema>;

