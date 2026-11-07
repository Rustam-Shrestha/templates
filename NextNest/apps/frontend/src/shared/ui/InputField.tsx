"use client";

import React, { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  compact?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      name,
      label,
      type = "text",
      value,
      placeholder,
      error,
      helperText,
      startIcon,
      endIcon,
      compact = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const controlId = id || name || generatedId;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`flex flex-col w-full min-w-0 ${compact ? "space-y-0.5" : "space-y-1.5"} ${className}`.trim()}>
        {label && (
          <label
            htmlFor={controlId}
            className={`text-xs font-semibold uppercase tracking-wider ${
              disabled ? "text-slate-400" : error ? "text-red-600" : "text-slate-700"
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full min-w-0">
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {startIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={controlId}
            name={name}
            type={resolvedType}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${controlId}-error` : helperText ? `${controlId}-helper` : undefined}
            className={`w-full rounded-md border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
              compact ? "h-8 px-2.5 py-1 text-xs" : "h-10 px-3 py-2"
            } ${startIcon ? "pl-9" : ""} ${isPassword || endIcon ? "pr-10" : ""} ${
              error
                ? "border-red-500 bg-red-50/30 text-red-900 focus:ring-red-500 placeholder:text-red-300"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-400"
            }`}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : endIcon ? (
            <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
              {endIcon}
            </div>
          ) : null}
        </div>

        {error ? (
          <p id={`${controlId}-error`} className="text-xs text-red-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${controlId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;

