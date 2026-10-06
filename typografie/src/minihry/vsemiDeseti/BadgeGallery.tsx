import { useEffect, useRef, useState } from 'react'
import {
  clearBadgeCache,
  fingerLabelForChar,
  galleryChars,
  renderBadge,
} from './badge'
import type { LayoutVariant } from './layout'

type BadgeGalleryProps = {
  onBack: () => void
}

export function BadgeGallery({ onBack }: BadgeGalleryProps) {
  const [variant, setVariant] = useState<LayoutVariant>('cs-QWERTZ')
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    clearBadgeCache()
    const host = gridRef.current
    if (!host) return
    host.replaceChildren()
    for (const ch of galleryChars()) {
      const card = document.createElement('div')
      card.className = 'vd-gallery-card'
      const canvas = renderBadge(ch, variant, {
        scale: 0.85,
        reducedMotion: true,
      })
      canvas.className = 'vd-gallery-badge'
      const cap = document.createElement('div')
      cap.className = 'vd-gallery-cap'
      const finger = fingerLabelForChar(ch, variant)
      cap.textContent = `${ch === ' ' ? 'mezerník' : ch} — ${finger}`
      card.append(canvas, cap)
      host.append(card)
    }
  }, [variant])

  return (
    <main className="page page-minihry page-vd-gallery">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Zpět
      </button>
      <header className="page-header">
        <h1>Galerie odznaků</h1>
        <p>DEV kontrola přiřazení prstů a čitelnosti.</p>
      </header>
      <div className="minihry-hub-actions">
        <button
          type="button"
          className={`minihry-diff-btn${variant === 'cs-QWERTZ' ? '' : ' secondary-btn'}`}
          onClick={() => setVariant('cs-QWERTZ')}
        >
          cs-QWERTZ
        </button>
        <button
          type="button"
          className={`minihry-diff-btn${variant === 'cs-QWERTY' ? '' : ' secondary-btn'}`}
          style={
            variant === 'cs-QWERTY'
              ? undefined
              : { background: 'var(--toolbar)', color: 'var(--ink)' }
          }
          onClick={() => setVariant('cs-QWERTY')}
        >
          cs-QWERTY
        </button>
      </div>
      <div ref={gridRef} className="vd-gallery-grid" />
    </main>
  )
}
