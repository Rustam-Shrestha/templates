import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  LinktreeIcon,
  MailIcon,
  GlobeIcon,
} from '@/assets/icons'
import { SOCIAL_LINKS } from '@/utils'
import { cn } from '@/utils'
import type { SocialLink } from '@/types'

export interface SocialLinksProps {
  links?: SocialLink[]
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const renderIcon = (platform: string, iconSizeClass: string) => {
  switch (platform.toLowerCase()) {
    case 'github':
      return <GithubIcon className={iconSizeClass} />
    case 'linkedin':
      return <LinkedinIcon className={iconSizeClass} />
    case 'twitter':
    case 'x':
      return <TwitterIcon className={iconSizeClass} />
    case 'linktree':
      return <LinktreeIcon className={iconSizeClass} />
    case 'email':
    case 'mail':
      return <MailIcon className={iconSizeClass} />
    default:
      return <GlobeIcon className={iconSizeClass} />
  }
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links = SOCIAL_LINKS,
  orientation = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'size-4',
    md: 'size-4.5',
    lg: 'size-5',
  }

  const buttonSizeClasses = {
    sm: 'w-8 h-8 rounded-[6px]',
    md: 'w-9 h-9 rounded-[8px]',
    lg: 'w-10 h-10 rounded-[8px]',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className={cn(
            'inline-flex items-center justify-center border border-[#E5E7EB] bg-white text-[#4B5563] hover:text-[#166534] hover:border-[#166534] hover:bg-[#F5F7F6] transition-all duration-150 shadow-2xs hover:-translate-y-0.5',
            buttonSizeClasses[size]
          )}
        >
          {link.icon || renderIcon(link.platform, iconSizeClasses[size])}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
