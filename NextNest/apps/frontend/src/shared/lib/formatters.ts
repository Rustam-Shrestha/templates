import type { CurrencyCode } from "@workspace/contracts";

export const formatters = {
  /**
   * Format money from integer minor units (BigInt) or decimal numbers into locale strings.
   * Complies with ADR 0002 integer minor unit architecture.
   */
  currency: (
    amountMinor: bigint | number | string,
    currency: CurrencyCode = "NPR"
  ): string => {
    let numericValue: number;

    if (typeof amountMinor === "bigint") {
      // Convert minor units (paisa/cents) to major units
      numericValue = Number(amountMinor) / 100;
    } else if (typeof amountMinor === "string") {
      const parsed = Number(amountMinor);
      numericValue = isNaN(parsed) ? 0 : parsed / 100;
    } else {
      numericValue = isNaN(amountMinor) ? 0 : amountMinor;
    }

    const currencyMap: Record<CurrencyCode, { symbol: string; locale: string }> = {
      NPR: { symbol: "रू", locale: "en-IN" },
      USD: { symbol: "$", locale: "en-US" },
      EUR: { symbol: "€", locale: "de-DE" },
      GBP: { symbol: "£", locale: "en-GB" }
    };

    const config = currencyMap[currency] ?? { symbol: currency, locale: "en-US" };

    return `${config.symbol} ${numericValue.toLocaleString(config.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },

  phone: (phoneStr: string): string => {
    if (!phoneStr) return "";
    return phoneStr.replace(/(\+\d{3})(\d{5})(\d{5})/, "$1 $2 $3");
  },

  pan: (panStr: string): string => {
    if (!panStr) return "";
    return panStr.toUpperCase().replace(/([A-Z]{4})([0-9]{4})([A-Z]{1})/, "$1 $2$3");
  },

  date: (dateVal: string | Date): string => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  },

  datetime: (dateVal: string | Date): string => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  },

  percentage: (decimalVal: number): string => {
    if (decimalVal === undefined || decimalVal === null || isNaN(decimalVal)) return "0%";
    const pct = decimalVal > 1 ? decimalVal : decimalVal * 100;
    return `${Math.round(pct)}%`;
  }
};

export default formatters;

