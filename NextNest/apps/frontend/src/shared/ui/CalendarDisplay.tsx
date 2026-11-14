"use client";

import React, { memo, useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export interface CalendarDisplayProps {
  date?: Date;
  locale?: string;
  className?: string;
  onClick?: () => void;
}

export const CalendarDisplay = memo(function CalendarDisplay({
  date,
  locale = "en-US",
  className = "",
  onClick
}: CalendarDisplayProps) {
  const [currentDate, setCurrentDate] = useState<Date>(date || new Date());

  useEffect(() => {
    if (date) {
      setCurrentDate(date);
    }
  }, [date]);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(currentDate);

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors ${
        onClick ? "cursor-pointer hover:bg-slate-50 hover:text-slate-900" : ""
      } ${className}`.trim()}
    >
      <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
      <span>{formattedDate}</span>
    </div>
  );
});

export default CalendarDisplay;

