"use client";

import React from "react";

export interface ToggleButtonProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  labelOn?: string;
  labelOff?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function ToggleButton({
  enabled,
  onChange,
  label,
  labelOn = "Active",
  labelOff = "Inactive",
  size = "md",
  disabled = false,
  className = ""
}: ToggleButtonProps): React.JSX.Element {
  const sizeConfig = {
    sm: { track: "h-5 w-9", thumb: "h-3.5 w-3.5", translate: "translate-x-4", offset: "translate-x-0.5" },
    md: { track: "h-6 w-11", thumb: "h-4.5 w-4.5", translate: "translate-x-5.5", offset: "translate-x-0.5" },
    lg: { track: "h-7 w-14", thumb: "h-5.5 w-5.5", translate: "translate-x-7.5", offset: "translate-x-1" }
  }[size];

  const handleToggle = (): void => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`.trim()}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          sizeConfig.track
        } ${enabled ? "bg-slate-900" : "bg-slate-200"}`}
      >
        <span
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0 transition-transform ${
            sizeConfig.thumb
          } ${enabled ? sizeConfig.translate : sizeConfig.offset}`}
        />
      </button>

      {(label || labelOn || labelOff) && (
        <span
          onClick={handleToggle}
          className={`text-xs font-medium cursor-pointer ${
            disabled ? "text-slate-400 cursor-not-allowed" : "text-slate-700"
          }`}
        >
          {label ?? (enabled ? labelOn : labelOff)}
        </span>
      )}
    </div>
  );
}

export default ToggleButton;

