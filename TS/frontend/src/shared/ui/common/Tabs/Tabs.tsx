import { Badge } from '@/components/Badge'
import { cn } from '@/utils'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-[8px] bg-[#F5F7F6] border border-[#E5E7EB] shrink-0',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer',
              isActive
                ? 'bg-white text-[#166534] font-semibold shadow-xs border border-[#E5E7EB]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-white/50'
            )}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <Badge
                size="sm"
                variant={isActive ? 'primary' : 'secondary'}
                className="text-[10px] px-1.5 py-0 font-bold"
              >
                {tab.count}
              </Badge>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
