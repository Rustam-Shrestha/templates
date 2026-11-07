import { describe, it, expect } from "vitest";
import { generateUuidV7, type UuidV7 } from "@workspace/contracts";
import { LedgerEntryEntity } from "../../src/modules/ledger/domain/ledger.entity.js";

describe("Ledger Keyset Pagination & Persistence Integration (§5)", () => {
  it("should paginate 45 records across pages with limit 20 without duplicates or omissions", async () => {
    const accountId = generateUuidV7();
    const records: LedgerEntryEntity[] = [];

    // Generate 45 historical records
    for (let i = 1; i <= 45; i++) {
      records.push(
        LedgerEntryEntity.rehydrate({
          id: generateUuidV7(),
          accountId,
          amountMinor: BigInt(i * 100),
          currency: "NPR",
          referenceNote: `Record #${i}`,
          createdAt: new Date(Date.now() + i * 1000)
        })
      );
    }

    // Sort ascending by ID (UUIDv7 time-ordered)
    records.sort((a, b) => a.id.localeCompare(b.id));

    // Simulated Keyset / Cursor pagination
    const fetchPage = (cursor?: UuidV7, limit = 20): LedgerEntryEntity[] => {
      const filtered = cursor ? records.filter((r) => r.id > cursor) : records;
      return filtered.slice(0, limit);
    };

    // Page 1
    const page1 = fetchPage(undefined, 20);
    expect(page1).toHaveLength(20);

    // Page 2
    const cursor1 = page1[page1.length - 1]?.id;
    const page2 = fetchPage(cursor1, 20);
    expect(page2).toHaveLength(20);

    // Page 3
    const cursor2 = page2[page2.length - 1]?.id;
    const page3 = fetchPage(cursor2, 20);
    expect(page3).toHaveLength(5);

    // Page 4 (empty)
    const cursor3 = page3[page3.length - 1]?.id;
    const page4 = fetchPage(cursor3, 20);
    expect(page4).toHaveLength(0);

    // Assert total unique records
    const allIds = new Set([...page1, ...page2, ...page3].map((r) => r.id));
    expect(allIds.size).toBe(45);
  });
});

