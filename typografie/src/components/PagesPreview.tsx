import type { PageSpec } from '../levels/types'

type PagesPreviewProps = {
  pages: PageSpec[]
  caption?: string
}

export function PagesPreview({ pages, caption }: PagesPreviewProps) {
  return (
    <figure className="pages-preview">
      <div className="pages-row">
        {pages.map((page) => (
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
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
