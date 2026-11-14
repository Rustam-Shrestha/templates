"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Globe } from "lucide-react";
import {
  BS_MONTH_NAMES_EN,
  BS_MONTH_NAMES_NE,
  BS_WEEKDAY_NAMES_EN,
  BS_WEEKDAY_NAMES_NE,
  MAX_BS_YEAR,
  MIN_BS_YEAR,
  numberToNe,
  neToNumber
} from "../../lib/bs-calendar/bs-data";
import {
  adToBs,
  bsStringToIsoAd,
  bsToAd,
  formatBsDate,
  getDaysInBsMonth,
  getFirstWeekdayOfBsMonth,
  getTodayBs,
  parseBsString
} from "../../lib/bs-calendar/converter";

export type BsDatePickerLocale = "en" | "ne";
export type NepaliDatePickerLocale = BsDatePickerLocale;

export interface NepaliDatePickerProps {
  label?: string;
  name?: string;
  value?: string; // YYYY-MM-DD (BS)
  defaultValue?: string;
  onChange?: (bsDateString: string, adIsoString: string, adDate: Date) => void;
  minYear?: number;
  maxYear?: number;
  locale?: BsDatePickerLocale;
  allowLocaleToggle?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export type BsDatePickerProps = NepaliDatePickerProps;

export const NepaliDatePicker = forwardRef<HTMLInputElement, NepaliDatePickerProps>(
  (
    {
      label,
      name,
      value: controlledValue,
      defaultValue,
      onChange,
      minYear = 1975,
      maxYear = 2095,
      locale: initialLocale = "en",
      allowLocaleToggle = true,
      placeholder = "YYYY-MM-DD",
      disabled = false,
      error,
      helperText,
      className = ""
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = name || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);

    const [locale, setLocale] = useState<BsDatePickerLocale>(initialLocale);
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(
      controlledValue !== undefined ? controlledValue : defaultValue || ""
    );
    const [viewYear, setViewYear] = useState<number>(2083);
    const [viewMonth, setViewMonth] = useState<number>(7);
    const [todayBs, setTodayBs] = useState<string>("");

    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    useEffect(() => {
      try {
        const today = getTodayBs();
        setTodayBs(today.formatted);
        if (!activeValue) {
          setViewYear(today.year);
          setViewMonth(today.month);
        } else {
          const parsed = parseBsString(activeValue);
          setViewYear(parsed.year);
          setViewMonth(parsed.month);
        }
      } catch {
        // Fallback default
      }
    }, []);

    useEffect(() => {
      if (controlledValue) {
        try {
          const parsed = parseBsString(controlledValue);
          setViewYear(parsed.year);
          setViewMonth(parsed.month);
        } catch {
          // Keep current view
        }
      }
    }, [controlledValue]);

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
      }
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("touchstart", handleOutsideClick);
      };
    }, [isOpen]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }, []);

    const adConversion = useMemo(() => {
      if (!activeValue) return { iso: "", date: null as Date | null, preview: "" };
      try {
        const iso = bsStringToIsoAd(activeValue);
        const date = bsToAd(parseBsString(activeValue));
        return {
          iso,
          date,
          preview: `AD: ${iso}`
        };
      } catch {
        return { iso: "", date: null as Date | null, preview: "" };
      }
    }, [activeValue]);

    const daysInCurrentMonth = useMemo(() => {
      return getDaysInBsMonth(viewYear, viewMonth);
    }, [viewYear, viewMonth]);

    const firstWeekdayOffset = useMemo(() => {
      return getFirstWeekdayOfBsMonth(viewYear, viewMonth);
    }, [viewYear, viewMonth]);

    const handleSelectDay = (day: number) => {
      if (disabled) return;
      const formatted = formatBsDate({ year: viewYear, month: viewMonth, day });
      try {
        const adIso = bsStringToIsoAd(formatted);
        const adDate = bsToAd({ year: viewYear, month: viewMonth, day });

        if (!isControlled) {
          setInternalValue(formatted);
        }
        onChange?.(formatted, adIso, adDate);
        setIsOpen(false);
      } catch (err) {
        console.error("Nepali Date Selection Error:", err);
      }
    };

    const handleQuickSelectToday = () => {
      if (disabled) return;
      try {
        const today = getTodayBs();
        setViewYear(today.year);
        setViewMonth(today.month);
        handleSelectDay(today.day);
      } catch (err) {
        console.error("Nepali Date Today Selection Error:", err);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      if (!isControlled) {
        setInternalValue("");
      }
      onChange?.("", "", new Date(NaN));
    };

    const handlePrevMonth = () => {
      if (viewMonth === 1) {
        if (viewYear > Math.max(minYear, MIN_BS_YEAR)) {
          setViewYear((prev) => prev - 1);
          setViewMonth(12);
        }
      } else {
        setViewMonth((prev) => prev - 1);
      }
    };

    const handleNextMonth = () => {
      if (viewMonth === 12) {
        if (viewYear < Math.min(maxYear, MAX_BS_YEAR)) {
          setViewYear((prev) => prev + 1);
          setViewMonth(1);
        }
      } else {
        setViewMonth((prev) => prev + 1);
      }
    };

    const yearOptions = useMemo(() => {
      const start = Math.max(minYear, MIN_BS_YEAR);
      const end = Math.min(maxYear, MAX_BS_YEAR);
      const list: number[] = [];
      for (let y = start; y <= end; y++) {
        list.push(y);
      }
      return list;
    }, [minYear, maxYear]);

    const activeParsed = useMemo(() => {
      if (!activeValue) return null;
      try {
        return parseBsString(activeValue);
      } catch {
        return null;
      }
    }, [activeValue]);

    const formattedDisplayValue = useMemo(() => {
      if (!activeValue) return "";
      return locale === "ne" ? numberToNe(activeValue) : activeValue;
    }, [activeValue, locale]);

    const monthNames = locale === "ne" ? BS_MONTH_NAMES_NE : BS_MONTH_NAMES_EN;
    const weekdayNames = locale === "ne" ? BS_WEEKDAY_NAMES_NE : BS_WEEKDAY_NAMES_EN;

    return (
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className={`relative flex flex-col w-full space-y-1.5 ${className}`.trim()}
      >
        {name && <input type="hidden" name={name} value={adConversion.iso} />}

        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className={`text-xs font-semibold uppercase tracking-wider ${
                disabled ? "text-slate-400" : error ? "text-red-600" : "text-slate-700"
              }`}
            >
              {label}
            </label>
            {adConversion.preview && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                {adConversion.preview}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center w-full min-w-0">
          <button
            type="button"
            id={inputId}
            ref={ref as unknown as React.Ref<HTMLButtonElement>}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            className={`flex items-center justify-between w-full h-10 px-3 text-sm rounded-md border transition-all text-left bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent ${
              disabled
                ? "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                : error
                ? "border-red-500 bg-red-50/20 text-red-900 focus:ring-red-500"
                : isOpen
                ? "border-slate-900 ring-1 ring-slate-900"
                : "border-slate-300 hover:border-slate-400 text-slate-900"
            }`}
          >
            <span className={activeValue ? "font-medium text-slate-900" : "text-slate-400"}>
              {formattedDisplayValue || (locale === "ne" ? numberToNe(placeholder) : placeholder)}
            </span>

            <div className="flex items-center gap-1.5 text-slate-400">
              {activeValue && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  aria-label="Clear date"
                  className="p-1 hover:text-slate-600 rounded-sm hover:bg-slate-100"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <CalendarIcon className="h-4 w-4 text-slate-500" />
            </div>
          </button>
        </div>

        {isOpen && (
          <div
            role="dialog"
            aria-label="Nepali Bikram Sambat Calendar"
            className="absolute z-50 top-full left-0 mt-1.5 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in-0 zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  aria-label="Select Nepali Month"
                  className="h-8 rounded border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {monthNames.map((name, idx) => (
                    <option key={name} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  aria-label="Select Nepali Year"
                  className="h-8 rounded border border-slate-200 bg-slate-50 px-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {locale === "ne" ? numberToNe(y) : y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-0.5">
                {allowLocaleToggle && (
                  <button
                    type="button"
                    onClick={() => setLocale((prev) => (prev === "en" ? "ne" : "en"))}
                    title="Toggle Nepali / English numerals"
                    className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 mr-0.5"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="p-1 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {weekdayNames.map((wd, i) => (
                <div
                  key={wd}
                  className={`text-[11px] font-semibold py-0.5 ${
                    i === 6 ? "text-red-500" : "text-slate-500"
                  }`}
                >
                  {wd}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstWeekdayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7 w-7" />
              ))}

              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected =
                  activeParsed &&
                  activeParsed.year === viewYear &&
                  activeParsed.month === viewMonth &&
                  activeParsed.day === dayNum;

                const currentFormatted = formatBsDate({
                  year: viewYear,
                  month: viewMonth,
                  day: dayNum
                });
                const isToday = currentFormatted === todayBs;

                const colIndex = (firstWeekdayOffset + i) % 7;
                const isSaturday = colIndex === 6;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white font-bold shadow-sm"
                        : isToday
                        ? "border border-slate-900 text-slate-900 font-bold bg-slate-50"
                        : isSaturday
                        ? "text-red-600 hover:bg-red-50"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {locale === "ne" ? numberToNe(dayNum) : dayNum}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={handleQuickSelectToday}
                className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {locale === "ne" ? "आज (Today)" : "Today (आज)"}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
              </button>
            </div>
          </div>
        )}

        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

NepaliDatePicker.displayName = "NepaliDatePicker";
export const BsDatePicker = NepaliDatePicker;
export default NepaliDatePicker;

