import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Briefcase, ArrowRight } from '@/assets/icons'
import { cn } from '@/utils'

export interface ExperienceItem {
  id: string
  number?: string
  role: string
  company: string
  location?: string
  period: string
  type?: string
  description: string
  highlights?: string[]
  technologies?: string[]
}

export interface TimelineProps {
  items: ExperienceItem[]
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={cn('relative pl-6 sm:pl-8 border-l border-[#E5E7EB] space-y-8 sm:space-y-12 my-6', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative group">
          {/* Timeline node */}
          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#166534] shadow-xs group-hover:border-[#166534] transition-colors">
            <Briefcase className="size-3.5" />
          </div>

          <Card hoverEffect className="p-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-4 border-b border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge size="sm" variant="primary">
                    0{index + 1}
                  </Badge>
                  <h4 className="font-heading text-lg font-bold text-[#111827]">
                    {item.role}
                  </h4>
                </div>
                <p className="text-sm font-semibold text-[#166534]">
                  {item.company} {item.location && <span className="text-[#6B7280] font-normal">· {item.location}</span>}
                </p>
              </div>

              <div className="self-start sm:self-center">
                <Badge size="sm" variant="secondary">
                  {item.period}
                </Badge>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#4B5563] leading-relaxed">
              {item.description}
            </p>

            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-3.5 space-y-2 list-none text-xs sm:text-sm text-[#4B5563]">
                {item.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <ArrowRight className="size-3 text-[#166534] shrink-0 mt-1" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-5 pt-3.5 border-t border-[#E5E7EB]">
                {item.technologies.map((tech) => (
                  <Badge key={tech} size="sm" variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  )
}

export default Timeline
