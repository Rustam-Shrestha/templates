import { Card, CardContent, CardFooter } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { ExternalLinkIcon, GithubIcon, ArrowRight } from '@/assets/icons'
import { cn } from '@/utils'

export interface ProjectItem {
  id: string
  number?: string
  title: string
  category: string
  tagline: string
  description: string
  overview?: string
  pipeline?: string[]
  metrics?: string[]
  tags: string[]
  image?: string
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
}

export interface ProjectCardProps {
  project: ProjectItem
  className?: string
  onOpenDetails?: (project: ProjectItem) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  className = '',
  onOpenDetails,
}) => {
  return (
    <Card hoverEffect className={cn('flex flex-col h-full overflow-hidden bg-white group', className)}>
      {/* Thumbnail with Frosted Glass Hover Overlay */}
      {project.image && (
        <div
          className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#F5F7F6] border-b border-[#E5E7EB] cursor-pointer"
          onClick={() => onOpenDetails?.(project)}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none'
            }}
          />

          {/* Frosted Glass View Details Overlay */}
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="text-xs font-semibold font-mono text-white px-3 py-1.5 rounded-[6px] bg-white/20 border border-white/30 backdrop-blur-md shadow-xs">
              View Details
            </span>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {project.number && (
              <Badge size="sm" variant="secondary" className="bg-[#111827] text-white border-transparent">
                {project.number}
              </Badge>
            )}
            <Badge size="sm" variant="outline" className="bg-white/95 text-[#111827]">
              {project.category}
            </Badge>
          </div>

          {project.featured && (
            <div className="absolute top-3 right-3 z-10">
              <Badge size="sm" variant="primary" dot>
                FEATURED
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <CardContent className="flex-1 pt-5 pb-3">
        <h3
          className={cn(
            'font-heading text-lg font-bold text-[#111827] group-hover:text-[#166534] transition-colors leading-snug',
            onOpenDetails && 'cursor-pointer'
          )}
          onClick={() => onOpenDetails?.(project)}
        >
          {project.title}
        </h3>

        <p className="text-xs font-medium text-[#166534] mt-1.5 font-mono">
          {project.tagline}
        </p>

        <p className="text-sm text-[#6B7280] mt-3 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Quantifiable Metrics with Centralized Icon */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-3.5 space-y-1.5 py-2 px-3 rounded-[6px] bg-[#F5F7F6] border border-[#E5E7EB]">
            {project.metrics.map((metric, i) => (
              <div key={i} className="text-xs font-mono text-[#374151] flex items-center gap-1.5">
                <ArrowRight className="size-3 text-[#166534] shrink-0" />
                <span>{metric}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags using Reusable Badge Component */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <Badge key={tag} size="sm" variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* Footer with Details button, Code and Demo buttons */}
      <CardFooter className="pt-3 pb-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<GithubIcon className="size-3.5 text-[#6B7280]" />}
                >
                  Code
                </Button>
              </a>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onOpenDetails?.(project)
              }}
            >
              Details
            </Button>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto"
            >
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ExternalLinkIcon className="size-3" />}
              >
                Live Demo
              </Button>
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
