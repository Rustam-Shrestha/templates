import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils'

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:
    'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
  secondary:
    'bg-[#F5F7F6] text-[#374151] border-[#E5E7EB]',
  outline:
    'bg-transparent text-[#4B5563] border-[#E5E7EB]',
  success:
    'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]',
  warning:
    'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
  danger:
    'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
}

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-[#166534]',
  secondary: 'bg-[#6B7280]',
  outline: 'bg-[#9CA3AF]',
  success: 'bg-[#16A34A]',
  warning: 'bg-[#D97706]',
  danger: 'bg-[#DC2626]',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono',
  md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'md',
  dot = false,
  icon,
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

export default Badge
