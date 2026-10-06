import type { PageSpec } from '../levels/types'
import { normalizePages } from './pagesPreviewParse'

type PagesPreviewProps = {
  pages: PageSpec[] | unknown[]
  caption?: string
}

const PUPIL_CAPTION =
  'Šedý pruh = nadpis. Odsazený řádek = začátek odstavce. Krátký řádek = konec odstavce.'

export function PagesPreview({ pages, caption }: PagesPreviewProps) {
  const normalized = normalizePages(pages as unknown[])
  const figCaption =
    caption && /H\s*=|Pn\s*=/.test(caption) ? PUPIL_CAPTION : (caption ?? PUPIL_CAPTION)

  return (
    <figure className="pages-preview">
      <div className="pages-row">
        {normalized.map((page) => (
          <div key={page.number} className="page-card">
            <div className="page-card-body">
              {page.blocks.map((block, i) => {
                if (block.kind === 'heading') {
                  return (
                    <div key={i} className="page-heading-bar" />
                  )
                }
                return (
                  <div key={i} className="page-para">
                    {Array.from({ length: block.lines }, (_, li) => {
                      const first = li === 0 && block.starts
                      const last = li === block.lines - 1 && block.ends
                      return (
                        <div
                          key={li}
                          className={`page-line${first ? ' is-indent' : ''}${last ? ' is-short' : ''}`}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className="page-number">{page.number}</div>
          </div>
        ))}
      </div>
      {figCaption ? <figcaption>{figCaption}</figcaption> : null}
    </figure>
  )
}
