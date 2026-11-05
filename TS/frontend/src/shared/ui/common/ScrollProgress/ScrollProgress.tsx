import { useState, useEffect } from 'react'
import { cn } from '@/utils'

export interface ScrollProgressProps {
  className?: string
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ className = '' }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight === 0) return
      const scrollPercent = (totalScroll / windowHeight) * 100
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent pointer-events-none', className)}
    >
      <div
        className="h-full bg-[#166534] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ScrollProgress
