import { describe, expect, it } from "vitest";
import {
  adToBs,
  bsStringToIsoAd,
  bsToAd,
  getFirstWeekdayOfBsMonth,
  getTodayBs,
  parseBsString,
  validateBsDate
} from "./converter";
import { neToNumber, numberToNe } from "./bs-data";

describe("Bikram Sambat (BS) <-> Gregorian (AD) Converter", () => {
  describe("Anchor Reference Checkpoint", () => {
    it("converts 2000-01-01 BS exactly to 1943-04-14 AD (Wednesday)", () => {
      const ad = bsToAd({ year: 2000, month: 1, day: 1 });
      expect(ad.toISOString().slice(0, 10)).toBe("1943-04-14");
      expect(ad.getUTCDay()).toBe(3);

      const bs = adToBs("1943-04-14");
      expect(bs.year).toBe(2000);
      expect(bs.month).toBe(1);
      expect(bs.day).toBe(1);
      expect(bs.formatted).toBe("2000-01-01");
      expect(bs.dayOfWeek).toBe(3);
    });
  });

  describe("Mandatory Historical & Future Checkpoints", () => {
    it("checkpoint 2080-01-01 BS <-> 2023-04-14 AD", () => {
      expect(bsStringToIsoAd("2080-01-01")).toBe("2023-04-14");
      const bs = adToBs("2023-04-14");
      expect(bs.formatted).toBe("2080-01-01");
      expect(bs.monthNameEn).toBe("Baisakh");
      expect(bs.monthNameNe).toBe("बैशाख");
    });

    it("checkpoint 2081-01-01 BS <-> 2024-04-13 AD", () => {
      expect(bsStringToIsoAd("2081-01-01")).toBe("2024-04-13");
      const bs = adToBs("2024-04-13");
      expect(bs.formatted).toBe("2081-01-01");
    });

    it("checkpoint 2082-01-01 BS <-> 2025-04-14 AD", () => {
      expect(bsStringToIsoAd("2082-01-01")).toBe("2025-04-14");
      const bs = adToBs("2025-04-14");
      expect(bs.formatted).toBe("2082-01-01");
    });

    it("checkpoint 2083-07-27 BS <-> 2026-11-13 AD", () => {
      expect(bsStringToIsoAd("2083-07-27")).toBe("2026-11-13");
      const bs = adToBs("2026-11-13");
      expect(bs.formatted).toBe("2083-07-27");
      expect(bs.formattedNe).toBe("२०८३-०७-२७");
      expect(bs.monthNameEn).toBe("Kartik");
      expect(bs.monthNameNe).toBe("कात्तिक");
    });
  });

  describe("Year Boundary Transitions (Chaitra to Baisakh)", () => {
    it("handles last day of 2080 BS (2080-12-30) to 2081-01-01 BS seamlessly", () => {
      const chaitraLast = bsToAd({ year: 2080, month: 12, day: 30 });
      expect(chaitraLast.toISOString().slice(0, 10)).toBe("2024-04-12");

      const baisakhFirst = bsToAd({ year: 2081, month: 1, day: 1 });
      expect(baisakhFirst.toISOString().slice(0, 10)).toBe("2024-04-13");

      const roundTrip1 = adToBs(chaitraLast);
      expect(roundTrip1.formatted).toBe("2080-12-30");

      const roundTrip2 = adToBs(baisakhFirst);
      expect(roundTrip2.formatted).toBe("2081-01-01");
    });

    it("handles transition across leap year 2024 AD (Feb 29)", () => {
      const leapDayAd = "2024-02-29";
      const bs = adToBs(leapDayAd);
      const reconstructedAd = bsToAd({ year: bs.year, month: bs.month, day: bs.day });
      expect(reconstructedAd.toISOString().slice(0, 10)).toBe(leapDayAd);
    });
  });

  describe("Historical Dates (Before 2000 BS: 1970–1999 BS)", () => {
    it("converts 1999-12-30 BS to 1943-04-13 AD (day before anchor)", () => {
      const bsDate = { year: 1999, month: 12, day: 30 };
      const ad = bsToAd(bsDate);
      expect(ad.toISOString().slice(0, 10)).toBe("1943-04-13");

      const back = adToBs("1943-04-13");
      expect(back.formatted).toBe("1999-12-30");
    });

    it("round-trips 1975-01-01 BS correctly", () => {
      const ad = bsToAd({ year: 1975, month: 1, day: 1 });
      const bs = adToBs(ad);
      expect(bs.formatted).toBe("1975-01-01");
    });
  });

  describe("Validation & Error Handling", () => {
    it("rejects day exceeding month max", () => {
      expect(() => validateBsDate({ year: 2080, month: 7, day: 31 })).toThrow(/invalid for month 7/i);
    });

    it("rejects out-of-range years", () => {
      expect(() => validateBsDate({ year: 1969, month: 1, day: 1 })).toThrow(/between 1970 and 2100/i);
      expect(() => validateBsDate({ year: 2101, month: 1, day: 1 })).toThrow(/between 1970 and 2100/i);
    });

    it("rejects invalid month numbers", () => {
      expect(() => validateBsDate({ year: 2083, month: 13, day: 1 })).toThrow(/between 1 and 12/i);
      expect(() => validateBsDate({ year: 2083, month: 0, day: 1 })).toThrow(/between 1 and 12/i);
    });
  });

  describe("Numeral Conversion & Parsing", () => {
    it("converts numbers to Devanagari numerals and back", () => {
      expect(numberToNe(2083)).toBe("२०८३");
      expect(numberToNe("2083-07-27")).toBe("२०८३-०७-२७");
      expect(neToNumber("२०८३-०७-२७")).toBe("2083-07-27");
    });

    it("parses Devanagari BS date string directly", () => {
      const parsed = parseBsString("२०८३-०७-२७");
      expect(parsed).toEqual({ year: 2083, month: 7, day: 27 });
    });
  });

  describe("Helper Functions", () => {
    it("getFirstWeekdayOfBsMonth returns accurate weekday", () => {
      expect(getFirstWeekdayOfBsMonth(2083, 1)).toBe(2);
    });

    it("getTodayBs returns valid BS date", () => {
      const today = getTodayBs();
      expect(today.year).toBeGreaterThanOrEqual(2080);
      expect(today.month).toBeGreaterThanOrEqual(1);
      expect(today.month).toBeLessThanOrEqual(12);
      expect(today.day).toBeGreaterThanOrEqual(1);
      expect(today.formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

