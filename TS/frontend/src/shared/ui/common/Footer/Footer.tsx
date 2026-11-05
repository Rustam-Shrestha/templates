import { Link } from 'react-router-dom'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { SocialLinks } from '@/components/SocialLinks'
import { useScrollToTop } from '@/hooks'
import { NAV_ITEMS, SITE_CONFIG } from '@/utils'
import { ChevronDown } from '@/assets/icons'
import { cn } from '@/utils'

export interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { scrollToTop } = useScrollToTop(false)

  return (
    <footer
      className={cn(
        'w-full border-t border-[#E5E7EB] bg-white transition-colors mt-auto',
        className
      )}
    >
      <Container size="xl" className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-8 border-b border-[#E5E7EB]">
          {/* Col 1: Brand */}
          <div className="space-y-1.5 text-center md:text-left">
            <Link
              to="/"
              className="flex items-center gap-2 font-heading text-lg font-bold text-[#111827] tracking-tight justify-center md:justify-start"
            >
              <img
                src="./images/logo.png"
                alt="Santosh Shrestha Logo"
                className="w-6 h-6 object-contain rounded-[4px] shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
              <span>{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-xs text-[#6B7280] max-w-sm leading-relaxed">
              Full-Stack Developer (MERN Stack) working in industry, based in Kathmandu, Nepal. Passionate about scalable web applications, clean architecture, and applied machine learning.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-xs sm:text-sm font-medium text-[#4B5563] hover:text-[#166534] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Social & Scroll To Top */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <SocialLinks size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="font-mono text-xs text-[#6B7280] hover:text-[#166534] h-7 px-2"
              rightIcon={<ChevronDown className="size-3.5 rotate-180" />}
            >
              [TOP]
            </Button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#9CA3AF] gap-4">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Clean architecture.</p>
          <p>React 19 · TypeScript · Tailwind CSS v4</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
