import { useMemo } from 'react'
import { htmlNotationToEditorHtml } from '../doc/parse'

type DocPreviewProps = {
  html: string
  mode: 'full' | 'wireframe'
  caption?: string
}

function blockCopy(e: React.ClipboardEvent | React.DragEvent | React.MouseEvent) {
  e.preventDefault()
}

export function DocPreview({ html, mode, caption }: DocPreviewProps) {
  const content = useMemo(() => htmlNotationToEditorHtml(html), [html])

  return (
    <figure className="doc-preview">
      <div
        className={`doc-preview-body mode-${mode}`}
        onCopy={blockCopy}
        onCut={blockCopy}
        onContextMenu={blockCopy}
        onDragStart={blockCopy}
      >
        {mode === 'wireframe' ? (
          <Wireframe html={content} />
        ) : (
          <div
            className="doc-preview-html"
            dangerouslySetInnerHTML={{ __html: stripLinks(content) }}
          />
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function stripLinks(html: string): string {
  return html.replace(/<a\b[^>]*>/gi, '<span class="fake-link">').replace(
    /<\/a>/gi,
    '</span>',
  )
}

function Wireframe({ html }: { html: string }) {
  const doc = new DOMParser().parseFromString(
    `<div id="r">${html}</div>`,
    'text/html',
  )
  const root = doc.getElementById('r')
  if (!root) return null
  return (
    <div className="wireframe">
      {Array.from(root.children).map((el, i) => {
        const tag = el.tagName.toLowerCase()
        const align =
          /text-align:\s*(center|right|justify)/i.exec(
            el.getAttribute('style') ?? '',
          )?.[1] ?? 'left'
        const text = el.textContent ?? ''
        const bold = el.querySelector('strong,b') != null
        const w = Math.min(100, Math.max(20, text.length * 2))
        if (tag === 'ul' || tag === 'ol') {
          return (
            <ul key={i} className="wire-list">
              {Array.from(el.querySelectorAll('li')).map((li, j) => (
                <li key={j}>
                  <span
                    className={`wire-bar${bold ? ' is-bold' : ''}`}
                    style={{ width: `${Math.min(90, (li.textContent?.length ?? 10) * 2)}%` }}
                  />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <div key={i} className={`wire-line align-${align}`}>
            <span
              className={`wire-bar style-${tag}${bold ? ' is-bold' : ''}`}
              style={{ width: `${w}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}
