import { cn } from '@/utils'

export interface SectionTitleProps {
  number?: string
  badge?: string
  title: string
  highlight?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  number,
  badge,
  title,
  highlight,
  description,
  align = 'left',
  className = '',
}) => {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {(number || badge) && (
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs tracking-wider uppercase text-[#166534] font-semibold">
            {number && badge ? `${number} · ${badge}` : (number || badge)}
          </span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#111827] leading-[1.15]">
        {title}{' '}
        {highlight && (
          <span className="text-[#166534]">
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
