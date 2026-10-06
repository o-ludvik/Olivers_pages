import { useEffect, useRef } from 'react'

type TextImageProps = {
  lines: string[]
  caption?: string
}

export function TextImage({ lines, caption }: TextImageProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const lineHeight = 28
    const padding = 20
    const font = '18px Georgia, "Times New Roman", serif'
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = font
    const width =
      Math.max(...lines.map((l) => ctx.measureText(l).width), 200) +
      padding * 2
    const height = lines.length * lineHeight + padding * 2
    canvas.width = Math.ceil(width * dpr)
    canvas.height = Math.ceil(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#f7f5f1'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#1a1a1a'
    ctx.font = font
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + (i + 0.75) * lineHeight)
    })
  }, [lines])

  return (
    <figure className="text-image">
      <canvas
        ref={ref}
        role="img"
        aria-label="Obrázek s textem k přepsání"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
