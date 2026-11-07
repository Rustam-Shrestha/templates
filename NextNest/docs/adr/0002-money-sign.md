# ADR 0002: Financial Ledger Money Representation and Sign Convention

## Status
Accepted

## Context
Floating-point arithmetic in financial enterprise systems introduces catastrophic rounding drift. Furthermore, ambiguous sign conventions across debit/credit entries cause irreversible reconciliation bugs.

## Decision

### 1. Integer Minor Units (`BigInt`)
- All currency amounts are strictly stored and computed as **integer minor units** (e.g., paisa for NPR, cents for USD/EUR, pence for GBP).
- Floating-point representations (`number`) are strictly forbidden in domain and database layers.
- Serialization across HTTP boundaries uses string-encoded integers (`amountMinor: string`), validated via regex `/^-?\d+$/`. Arbitrary decimal representations like `"1.5"`, exponential notation `"1e3"`, empty strings `""`, or negative zeros `"-0"` are rejected at validation.

### 2. Sign Convention
- **Positive integers (`amountMinor > 0n`):** Represent an **increase / debit** to the ledger account.
- **Negative integers (`amountMinor < 0n`):** Represent a **decrease / credit** to the ledger account.
- **Zero amount (`amountMinor === 0n`):** Strictly rejected as an invariant violation (`LEDGER_INVARIANT_VIOLATION: Transaction amount cannot be zero.`).

## Consequences
- Clean balance aggregation via standard SQL `SUM(amount_minor)`.
- Zero floating-point rounding errors.
- Unambiguous invariant verification across all domain entities.

