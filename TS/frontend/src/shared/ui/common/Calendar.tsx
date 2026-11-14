"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarProps {
  selected?: Date | string | null;
  onSelect?: (date: Date, dateString: string) => void;
  minDate?: Date;
  maxDate?: Date;
  initialMonth?: Date;
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function Calendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  initialMonth,
  className = ""
}: CalendarProps): React.JSX.Element {
  const parsedSelected = useMemo(() => {
    if (!selected) return null;
    const d = typeof selected === "string" ? new Date(selected) : selected;
    return Number.isNaN(d.getTime()) ? null : d;
  }, [selected]);

  const selectedIso = useMemo(() => {
    return parsedSelected ? toIsoDate(parsedSelected) : "";
  }, [parsedSelected]);

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (parsedSelected) return new Date(parsedSelected.getFullYear(), parsedSelected.getMonth(), 1);
    if (initialMonth) return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleYearChange = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstWeekday = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  const todayIso = useMemo(() => toIsoDate(new Date()), []);

  const yearOptions = useMemo(() => {
    const currentY = new Date().getFullYear();
    const list: number[] = [];
    for (let y = currentY - 50; y <= currentY + 20; y++) {
      list.push(y);
    }
    return list;
  }, []);

  return (
    <div className={`w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-md select-none ${className}`.trim()}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-1">
          <select
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            aria-label="Select month"
            className="h-7 rounded border border-slate-200 bg-slate-50 px-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            aria-label="Select year"
            className="h-7 rounded border border-slate-200 bg-slate-50 px-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-0.5">
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

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAY_NAMES.map((wd) => (
          <div key={wd} className="text-[11px] font-semibold text-slate-400 py-0.5">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7 w-7" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const cellDate = new Date(year, month, dayNum);
          const cellIso = toIsoDate(cellDate);

          const isSelected = selectedIso === cellIso;
          const isToday = todayIso === cellIso;

          const isDisabled =
            (minDate && cellDate < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) ||
            (maxDate && cellDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()));

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              disabled={Boolean(isDisabled)}
              onClick={() => onSelect?.(cellDate, cellIso)}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-all ${
                isSelected
                  ? "bg-slate-900 text-white font-bold shadow-sm"
                  : isToday
                  ? "border border-slate-900 text-slate-900 font-bold bg-slate-50"
                  : isDisabled
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs">
        <button
          type="button"
          onClick={() => {
            const today = new Date();
            setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
            onSelect?.(today, toIsoDate(today));
          }}
          className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default Calendar;

