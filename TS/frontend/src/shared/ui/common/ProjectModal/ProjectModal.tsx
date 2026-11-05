import React from 'react'
import { Modal } from '@/components/Modal'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { GithubIcon, ExternalLinkIcon, CheckCircle2 } from '@/assets/icons'
import type { ProjectItem } from '@/components/ProjectCard'

export interface ProjectModalProps {
  project: ProjectItem | null
  isOpen: boolean
  onClose: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          {project.number && (
            <span className="font-mono text-xs font-bold text-[#166534]">
              {project.number}
            </span>
          )}
          <span className="truncate">{project.title}</span>
        </div>
      }
      description={project.tagline}
    >
      <div className="space-y-4">
        {/* High-Resolution Project Image Display (compact height) */}
        {project.image && (
          <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-[8px] bg-[#F5F7F6] border border-[#E5E7EB]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <Badge size="sm" variant="outline" className="bg-white/95 backdrop-blur-xs text-[#111827] shadow-xs">
                {project.category}
              </Badge>
              {project.featured && (
                <Badge size="sm" variant="primary" dot className="shadow-xs">
                  FEATURED
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* System Overview & In-Depth Description */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#166534] font-bold mb-1.5">
            System Overview & Architecture
          </h4>
          <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
            {project.overview || project.description}
          </p>
        </div>

        {/* Architectural Pipeline & Algorithmic Steps */}
        {project.pipeline && project.pipeline.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#166534] font-bold mb-2">
              Architectural Pipeline & Algorithmic Steps
            </h4>
            <div className="space-y-1.5">
              {project.pipeline.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 sm:p-2.5 rounded-[6px] bg-[#F9FAFB] border border-[#E5E7EB]"
                >
                  <span className="font-mono text-[11px] font-bold text-[#166534] px-1.5 py-0.5 rounded bg-[#DCFCE7] shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs text-[#374151] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Metrics & Performance Benchmarks */}
        {project.metrics && project.metrics.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#166534] font-bold mb-2">
              Verified Metrics & Performance Benchmarks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-[6px] bg-[#F5F7F6] border border-[#E5E7EB] text-xs font-mono text-[#374151]"
                >
                  <CheckCircle2 className="size-3.5 text-[#166534] shrink-0" />
                  <span className="truncate">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Technology Badges */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#6B7280] font-semibold mb-1.5">
            Technologies & Stack
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} size="sm" variant="secondary" className="font-mono text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2.5 sticky bottom-0 bg-white/95 backdrop-blur-xs pb-1">
          <div className="flex flex-wrap items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<GithubIcon className="size-3.5" />}
                >
                  View GitHub
                </Button>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<ExternalLinkIcon className="size-3" />}
                >
                  Live Demo
                </Button>
              </a>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ProjectModal
