import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { ChevronDown } from '@/assets/icons'
import { useScrollToTop } from '@/hooks'
import { cn } from '@/utils'

export interface BackToTopProps {
  threshold?: number
  className?: string
}

export const BackToTop: React.FC<BackToTopProps> = ({ threshold = 300, className = '' }) => {
  const [visible, setVisible] = useState(false)
  const { scrollToTop } = useScrollToTop(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  if (!visible) return null

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Scroll back to top"
      className={cn(
        'fixed bottom-6 right-6 z-40 p-2.5 rounded-[8px] bg-white border border-[#E5E7EB] text-[#374151] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:text-[#166534] hover:border-[#166534] hover:-translate-y-0.5 transition-all duration-150 animate-in fade-in h-auto w-auto',
        className
      )}
    >
      <ChevronDown className="size-4 rotate-180" />
    </Button>
  )
}

export default BackToTop
