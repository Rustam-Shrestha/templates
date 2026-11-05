import { Link, useLocation } from 'react-router-dom'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { useUIStore } from '@/store'
import { NAV_ITEMS, SITE_CONFIG } from '@/utils'
import { Menu, X, Download } from '@/assets/icons'
import { cn } from '@/utils'

export interface NavbarProps {
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const location = useLocation()
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md transition-colors',
        className
      )}
    >
      <Container size="xl">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo / Brand Name */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 group font-heading font-extrabold text-base sm:text-lg text-[#111827]"
          >
            <img
              src="./images/logo.png"
              alt="Santosh Shrestha Logo"
              className="w-8 h-8 rounded-[6px] object-contain shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <span className="tracking-tight group-hover:text-[#166534] transition-colors">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-[6px] text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F5F7F6]'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="size-3.5" />}
              onClick={() => {
                if (SITE_CONFIG.resumeUrl) {
                  window.open(SITE_CONFIG.resumeUrl, '_blank')
                }
              }}
            >
              Resume
            </Button>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="p-2 h-9 w-9"
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'px-4 py-2.5 rounded-[6px] text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#DCFCE7] text-[#166534] font-semibold'
                      : 'text-[#374151] hover:bg-[#F5F7F6]'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="pt-3 mt-2 border-t border-[#E5E7EB]">
              <Button
                fullWidth
                variant="primary"
                size="md"
                leftIcon={<Download className="size-4" />}
                onClick={() => {
                  closeMobileMenu()
                  if (SITE_CONFIG.resumeUrl) {
                    window.open(SITE_CONFIG.resumeUrl, '_blank')
                  }
                }}
              >
                Download CV (PDF)
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
