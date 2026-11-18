import Image from 'next/image'
import { FIGURES } from './figures'

type Visual = { name: string; image?: string; figure?: string }

/** 16:9 project visual: a photo wins, otherwise the SVG figure, otherwise
 *  nothing. Dropping a photo in and setting `image` replaces the figure. */
export default function ProjectVisual({
  project,
  sizes,
  className = '',
}: {
  project: object & { name: string }
  sizes: string
  className?: string
}) {
  const { name, image, figure } = project as Visual
  const Figure = figure ? FIGURES[figure] : undefined
  if (!image && !Figure) return null

  return (
    <div className={`relative aspect-video overflow-hidden bg-overlay border border-edge-subtle ${className}`}>
      {image ? (
        <Image src={image} alt={name} fill sizes={sizes} className="object-cover" />
      ) : (
        Figure && <Figure />
      )}
    </div>
  )
}
