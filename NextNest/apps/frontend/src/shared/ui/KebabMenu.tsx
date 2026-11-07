"use client";

import React, { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

export interface KebabMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

export interface KebabMenuProps {
  items: KebabMenuItem[];
  align?: "left" | "right";
  className?: string;
  triggerAriaLabel?: string;
}

export function KebabMenu({
  items,
  align = "right",
  className = "",
  triggerAriaLabel = "Open action menu"
}: KebabMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={triggerAriaLabel}
        className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute z-50 mt-1 min-w-[160px] rounded-md border border-slate-200 bg-white p-1 shadow-lg focus:outline-none animate-in fade-in-0 zoom-in-95 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, idx) => (
            <button
              key={`${item.label}-${idx}`}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              className={`flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                item.destructive
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.icon && <span className="h-3.5 w-3.5 shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default KebabMenu;

