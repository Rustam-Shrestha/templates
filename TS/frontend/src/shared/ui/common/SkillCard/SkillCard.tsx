import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { cn } from '@/utils'

export interface SkillGroup {
  category: string
  description?: string
  items: string[]
}

export interface SkillCardProps {
  skillGroup: SkillGroup
  number?: string
  className?: string
}

export const SkillCard: React.FC<SkillCardProps> = ({ skillGroup, number, className = '' }) => {
  return (
    <Card hoverEffect className={cn('p-6 bg-white flex flex-col justify-between group', className)}>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <h4 className="font-heading text-base font-bold text-[#111827] group-hover:text-[#166534] transition-colors">
            {skillGroup.category}
          </h4>

          {number && (
            <span className="font-mono text-xs font-semibold text-[#166534]">
              [{number}]
            </span>
          )}
        </div>

        {skillGroup.description && (
          <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">
            {skillGroup.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-4">
          {skillGroup.items.map((item) => (
            <Badge key={item} size="sm" variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default SkillCard
