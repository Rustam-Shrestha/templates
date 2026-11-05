import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { SocialLinks } from '@/components/SocialLinks'
import { ArrowRight, Download } from '@/assets/icons'
import { SITE_CONFIG } from '@/utils'
import { personalData } from '@/data'
import { cn } from '@/utils'

export interface HeroProps {
  className?: string
  name?: string
  role?: string
  tagline?: string
  onContactClick?: () => void
}

export const Hero: React.FC<HeroProps> = ({
  className = '',
  name = personalData.name,
  role = personalData.title,
  tagline = personalData.tagline,
  onContactClick,
}) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 bg-grid-pattern',
        className
      )}
    >
      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            {/* Status / Category Monospace Label */}
            <Badge
              variant="primary"
              dot
              size="md"
              className="mb-6 font-mono text-xs font-semibold rounded-[6px] px-3 py-1 border-[#BBF7D0]"
            >
              AVAILABLE FOR MACHINE LEARNING, DATA SCIENCE & FULL-STACK ROLES
            </Badge>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-extrabold tracking-tight text-[#111827] leading-[1.08] font-heading">
              {name.split(' (')[0]}{' '}
              <span className="text-[#166534]">
                ({name.includes('(') ? name.split('(')[1].replace(')', '') : 'Rustam'})
              </span>
            </h1>

            {/* Role Subtitle */}
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-[#374151]">
              {role}
            </h2>

            {/* Tagline */}
            <p className="mt-5 text-base sm:text-lg text-[#6B7280] max-w-2xl leading-relaxed">
              {tagline}
            </p>

            {/* Metrics Quick Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl py-4 border-y border-[#E5E7EB]">
              {personalData.stats.map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#111827]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-mono uppercase text-[#6B7280] tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="size-4" />}
                onClick={() => {
                  const el = document.getElementById('projects')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Project Showcase
              </Button>

              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Download className="size-4" />}
                onClick={() => {
                  if (SITE_CONFIG.resumeUrl) {
                    window.open(SITE_CONFIG.resumeUrl, '_blank')
                  }
                }}
              >
                Download CV
              </Button>

              {onContactClick ? (
                <Button variant="ghost" size="lg" onClick={onContactClick}>
                  Get in Touch
                </Button>
              ) : (
                <a href="#contact">
                  <Button variant="ghost" size="lg">
                    Contact
                  </Button>
                </a>
              )}
            </div>

            {/* Social Connectivity */}
            <div className="mt-8 pt-4 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#9CA3AF]">
                Profiles ·
              </span>
              <SocialLinks size="sm" />
            </div>
          </div>

          {/* Profile Card / Avatar Column */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <Card className="relative w-full max-w-sm bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="w-full aspect-square rounded-[8px] overflow-hidden bg-[#F5F7F6] border border-[#E5E7EB] flex items-center justify-center">
                <img
                  src={personalData.avatar}
                  alt={personalData.name}
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback avatar placeholder
                    (e.target as HTMLElement).style.display = 'none'
                  }}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase text-[#6B7280]">Location</p>
                  <p className="text-sm font-semibold text-[#111827]">{personalData.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono uppercase text-[#6B7280]">Education</p>
                  <p className="text-sm font-semibold text-[#111827]">BCA (TU)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero
