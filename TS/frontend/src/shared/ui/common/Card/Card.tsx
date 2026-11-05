import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
  variant?: 'surface' | 'alt' | 'outline'
  children?: ReactNode
}

export const Card: React.FC<CardProps> = ({
  className = '',
  hoverEffect = false,
  variant = 'surface',
  children,
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-white border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
    alt: 'bg-[#F5F7F6] border-[#E5E7EB]',
    outline: 'bg-transparent border-[#E5E7EB]',
  }

  return (
    <div
      className={cn(
        'rounded-[12px] border transition-all duration-200',
        variantStyles[variant],
        hoverEffect &&
          'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={cn('p-6 pb-3', className)} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3
    className={cn('text-lg font-bold text-[#111827] tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
)

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p
    className={cn('text-sm text-[#6B7280] mt-1 leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
)

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={cn(
      'p-6 pt-0 flex items-center justify-between border-t border-[#E5E7EB] mt-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export default Card
