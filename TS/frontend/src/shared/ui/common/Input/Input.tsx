import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils'

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#374151]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#9CA3AF] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-10 rounded-[6px] border bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] transition-all duration-150 focus:outline-none',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              error
                ? 'border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:border-[#DC2626]'
                : 'border-[#CBD5E1] focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534]',
              disabled && 'opacity-60 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-[#9CA3AF] pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p className="text-xs font-medium text-[#DC2626]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6B7280]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, helperText, error, className = '', id, disabled, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#374151]"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full rounded-[6px] border bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] p-3 transition-all duration-150 focus:outline-none resize-y',
            error
              ? 'border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:border-[#DC2626]'
              : 'border-[#CBD5E1] focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534]',
            disabled && 'opacity-60 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs font-medium text-[#DC2626]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6B7280]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'

export default InputField
