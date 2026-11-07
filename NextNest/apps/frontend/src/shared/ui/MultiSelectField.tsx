"use client";

import React, { useState, useRef, useMemo } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

export interface Option {
  label: string;
  value: string;
}

export interface MultiSelectFieldProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelection?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function MultiSelectField({
  label,
  placeholder = "Select options...",
  options,
  value = [],
  onChange,
  maxSelection,
  disabled = false,
  error,
  className = ""
}: MultiSelectFieldProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setSearchTerm("");
  });

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOptions = useMemo(() => {
    return options.filter((opt) => value.includes(opt.value));
  }, [options, value]);

  const handleToggle = (val: string): void => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      if (maxSelection && value.length >= maxSelection) {
        return;
      }
      onChange([...value, val]);
    }
  };

  const handleRemove = (e: React.MouseEvent, val: string): void => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div ref={containerRef} className={`flex flex-col space-y-1.5 w-full ${className}`.trim()}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}

      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        }}
        className={`relative flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border p-1.5 text-sm transition-colors cursor-pointer bg-white ${
          error
            ? "border-red-500 bg-red-50/20"
            : isOpen
            ? "border-slate-900 ring-1 ring-slate-900"
            : "border-slate-300 hover:border-slate-400"
        } ${disabled ? "cursor-not-allowed bg-slate-100 opacity-60" : ""}`}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-slate-400 text-sm px-1.5">{placeholder}</span>
        ) : (
          selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800"
            >
              {opt.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, opt.value)}
                  className="rounded hover:bg-slate-200 p-0.5"
                  aria-label={`Remove ${opt.label}`}
                >
                  <X className="h-3 w-3 text-slate-500" />
                </button>
              )}
            </span>
          ))
        )}

        <div className="ml-auto pr-1 flex items-center">
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 w-full rounded-md border border-slate-200 bg-white shadow-lg p-1 animate-in fade-in-0 zoom-in-95">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full rounded border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 mb-1"
            />

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-2 text-center text-xs text-slate-400">No options found</div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  const isAtMax = Boolean(maxSelection && value.length >= maxSelection && !isSelected);

                  return (
                    <div
                      key={opt.value}
                      onClick={() => !isAtMax && handleToggle(opt.value)}
                      className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 font-semibold text-slate-900"
                          : isAtMax
                          ? "opacity-40 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-slate-900" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

export default MultiSelectField;

