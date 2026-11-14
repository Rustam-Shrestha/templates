/**
 * Zero-dependency Bikram Sambat (BS) <-> Gregorian (AD) Date Converter Engine
 * Timezone-safe UTC day-offset arithmetic.
 */

import {
  ANCHOR_AD_MS,
  ANCHOR_BS_YEAR,
  BS_MONTH_DAYS,
  BS_MONTH_NAMES_EN,
  BS_MONTH_NAMES_NE,
  MAX_BS_YEAR,
  MILLISECONDS_PER_DAY,
  MIN_BS_YEAR,
  NEPAL_TIMEZONE_OFFSET_MINUTES,
  neToNumber,
  numberToNe
} from "./bs-data";

export interface BsDateInput {
  year: number;
  month: number;
  day: number;
}

export interface BsDateFull {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  monthNameEn: string;
  monthNameNe: string;
  formatted: string; // YYYY-MM-DD
  formattedNe: string; // २०८३-०७-२७
}

/**
 * Returns the total number of days in a specific BS month.
 */
export function getDaysInBsMonth(year: number, month: number): number {
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new Error(`BS Year ${year} is outside the supported range (${MIN_BS_YEAR} – ${MAX_BS_YEAR})`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`BS Month ${month} is invalid (must be 1 – 12)`);
  }
  const yearData = BS_MONTH_DAYS[year];
  if (!yearData) {
    throw new Error(`Missing BS month data for year ${year}`);
  }
  return yearData[month - 1];
}

/**
 * Returns total days in a given BS year.
 */
export function getDaysInBsYear(year: number): number {
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new Error(`BS Year ${year} is outside the supported range (${MIN_BS_YEAR} – ${MAX_BS_YEAR})`);
  }
  const yearData = BS_MONTH_DAYS[year];
  if (!yearData) {
    throw new Error(`Missing BS month data for year ${year}`);
  }
  return yearData.reduce((acc, days) => acc + days, 0);
}

/**
 * Validates a BS date input. Throws an Error if invalid.
 */
export function validateBsDate(bs: BsDateInput): void {
  const { year, month, day } = bs;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error(`BS date components must be integers: ${JSON.stringify(bs)}`);
  }
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new Error(`BS Year ${year} must be between ${MIN_BS_YEAR} and ${MAX_BS_YEAR}`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`BS Month ${month} must be between 1 and 12`);
  }
  const maxDays = getDaysInBsMonth(year, month);
  if (day < 1 || day > maxDays) {
    throw new Error(`BS Day ${day} is invalid for month ${month} of year ${year} (max ${maxDays} days)`);
  }
}

/**
 * Parses a BS date string in "YYYY-MM-DD" format (supports ASCII or Devanagari digits).
 */
export function parseBsString(bsStr: string): BsDateInput {
  if (!bsStr || typeof bsStr !== "string") {
    throw new Error(`Invalid BS date string: ${bsStr}`);
  }
  const normalized = neToNumber(bsStr.trim());
  const parts = normalized.split("-").map((p) => Number(p));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid BS date format '${bsStr}'. Expected 'YYYY-MM-DD'`);
  }
  const [year, month, day] = parts as [number, number, number];
  validateBsDate({ year, month, day });
  return { year, month, day };
}

/**
 * Formats a BS Date into an ISO-like YYYY-MM-DD string.
 */
export function formatBsDate(bs: BsDateInput): string {
  const y = String(bs.year).padStart(4, "0");
  const m = String(bs.month).padStart(2, "0");
  const d = String(bs.day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Converts a Bikram Sambat (BS) date to a Gregorian (AD) Date in UTC.
 * Zero-dependency, pure UTC day-offset arithmetic.
 */
export function bsToAd(bs: BsDateInput): Date {
  validateBsDate(bs);
  const { year, month, day } = bs;

  if (year >= ANCHOR_BS_YEAR) {
    let daysFromAnchor = 0;
    // Add full years
    for (let y = ANCHOR_BS_YEAR; y < year; y++) {
      daysFromAnchor += getDaysInBsYear(y);
    }
    // Add months in current year
    for (let m = 1; m < month; m++) {
      daysFromAnchor += getDaysInBsMonth(year, m);
    }
    // Add days in current month (1-based to 0-based offset)
    daysFromAnchor += day - 1;

    const targetUtcMs = ANCHOR_AD_MS + daysFromAnchor * MILLISECONDS_PER_DAY;
    return new Date(targetUtcMs);
  } else {
    // Before anchor year 2000 BS
    let daysBackward = 0;
    // Full years between year + 1 and 1999
    for (let y = year + 1; y < ANCHOR_BS_YEAR; y++) {
      daysBackward += getDaysInBsYear(y);
    }
    // Months in year from month + 1 to 12
    for (let m = month + 1; m <= 12; m++) {
      daysBackward += getDaysInBsMonth(year, m);
    }
    // Days from day to end of month
    daysBackward += getDaysInBsMonth(year, month) - day + 1;

    const targetUtcMs = ANCHOR_AD_MS - daysBackward * MILLISECONDS_PER_DAY;
    return new Date(targetUtcMs);
  }
}

/**
 * Converts a BS Date string ("YYYY-MM-DD") to an AD Date ISO string ("YYYY-MM-DD").
 */
export function bsStringToIsoAd(bsStr: string): string {
  const bs = parseBsString(bsStr);
  const adDate = bsToAd(bs);
  const y = adDate.getUTCFullYear();
  const m = String(adDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(adDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Converts a Gregorian (AD) Date or ISO date string to Bikram Sambat (BS).
 * Pure UTC date math without local timezone interference.
 */
export function adToBs(adDate: Date | string): BsDateFull {
  let utcMs: number;
  let dayOfWeek: number;

  if (typeof adDate === "string") {
    const parts = adDate.trim().slice(0, 10).split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      throw new Error(`Invalid AD date string '${adDate}'. Expected 'YYYY-MM-DD'`);
    }
    const [y, m, d] = parts as [number, number, number];
    utcMs = Date.UTC(y, m - 1, d);
    dayOfWeek = new Date(utcMs).getUTCDay();
  } else if (adDate instanceof Date && !Number.isNaN(adDate.getTime())) {
    utcMs = Date.UTC(adDate.getUTCFullYear(), adDate.getUTCMonth(), adDate.getUTCDate());
    dayOfWeek = adDate.getUTCDay();
  } else {
    throw new Error(`Invalid AD Date provided: ${String(adDate)}`);
  }

  const diffDays = Math.round((utcMs - ANCHOR_AD_MS) / MILLISECONDS_PER_DAY);

  let year = ANCHOR_BS_YEAR;
  let month = 1;
  let day = 1;

  if (diffDays >= 0) {
    let remaining = diffDays;
    while (remaining >= getDaysInBsYear(year)) {
      remaining -= getDaysInBsYear(year);
      year++;
      if (year > MAX_BS_YEAR) {
        throw new Error(`AD date is beyond supported BS range (max ${MAX_BS_YEAR} BS)`);
      }
    }
    while (remaining >= getDaysInBsMonth(year, month)) {
      remaining -= getDaysInBsMonth(year, month);
      month++;
    }
    day = remaining + 1;
  } else {
    let remaining = -diffDays;
    year = ANCHOR_BS_YEAR - 1;
    while (remaining > getDaysInBsYear(year)) {
      remaining -= getDaysInBsYear(year);
      year--;
      if (year < MIN_BS_YEAR) {
        throw new Error(`AD date is before supported BS range (min ${MIN_BS_YEAR} BS)`);
      }
    }
    month = 12;
    while (remaining > getDaysInBsMonth(year, month)) {
      remaining -= getDaysInBsMonth(year, month);
      month--;
    }
    day = getDaysInBsMonth(year, month) - remaining + 1;
  }

  const formatted = formatBsDate({ year, month, day });
  const formattedNe = numberToNe(formatted);
  const monthNameEn = BS_MONTH_NAMES_EN[month - 1] ?? "";
  const monthNameNe = BS_MONTH_NAMES_NE[month - 1] ?? "";

  return {
    year,
    month,
    day,
    dayOfWeek,
    monthNameEn,
    monthNameNe,
    formatted,
    formattedNe
  };
}

/**
 * Returns today's date in Bikram Sambat, synced to Nepal Standard Time (UTC+05:45 by default).
 */
export function getTodayBs(timeZoneOffsetMinutes = NEPAL_TIMEZONE_OFFSET_MINUTES): BsDateFull {
  const now = new Date();
  // Adjust wall clock to specified timezone offset (default Nepal: 345 minutes)
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60_000;
  const nstMs = utcNow + timeZoneOffsetMinutes * 60_000;
  const nstDate = new Date(nstMs);
  const nstAdString = `${nstDate.getFullYear()}-${String(nstDate.getMonth() + 1).padStart(2, "0")}-${String(
    nstDate.getDate()
  ).padStart(2, "0")}`;
  return adToBs(nstAdString);
}

/**
 * Returns the weekday of the 1st day of a given BS month.
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
 */
export function getFirstWeekdayOfBsMonth(year: number, month: number): number {
  const adFirstDay = bsToAd({ year, month, day: 1 });
  return adFirstDay.getUTCDay();
}
