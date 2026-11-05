import { useState, useRef } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { ChevronLeft, ChevronRight, Eye } from '@/assets/icons'
import { galleryData } from '@/data'
import { cn } from '@/utils'

export interface GalleryItem {
  id: string
  image: string
  alt?: string
}

export interface GalleryProps {
  items?: GalleryItem[]
  className?: string
}

export const Gallery: React.FC<GalleryProps> = ({
  items = galleryData,
  className = '',
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 360
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#166534]" />
          <span className="text-xs font-mono font-medium text-[#6B7280]">
            Scroll or drag to explore ({items.length} photos)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleScroll('left')}
            aria-label="Previous photo"
            className="w-8 h-8 p-0 flex items-center justify-center text-[#374151]"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleScroll('right')}
            aria-label="Next photo"
            className="w-8 h-8 p-0 flex items-center justify-center text-[#374151]"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {items.map((item) => (
          <Card
            key={item.id}
            hoverEffect
            onClick={() => setSelectedItem(item)}
            className="group shrink-0 w-[240px] sm:w-[280px] snap-start bg-white cursor-pointer overflow-hidden rounded-[10px] p-2 border border-[#E5E7EB] hover:border-[#166534]/40 transition-all duration-300"
          >
            <div className="relative aspect-[4/5] bg-[#F5F7F6] rounded-[6px] overflow-hidden">
              <img
                src={item.image}
                alt={item.alt || 'Personal photo'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />

              <div className="absolute inset-0 bg-[#0F172A]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white/95 text-xs font-mono font-medium text-[#111827] shadow-sm backdrop-blur-xs">
                  <Eye className="size-3.5 text-[#166534]" />
                  View Photo
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Lightbox Preview */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          size="lg"
        >
          <div className="space-y-3 pt-2">
            <div className="w-full max-h-[75vh] rounded-[8px] overflow-hidden bg-[#0F172A] flex items-center justify-center">
              <img
                src={selectedItem.image}
                alt={selectedItem.alt || 'Full size photo'}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Gallery
