import { describe, expect, it, vi } from 'vitest'
import { createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { GameInput, type GameInputHandle } from './components/GameInput'

describe('composition §1.3', () => {
  it('does not commit during composition; commits on compositionend', async () => {
    const commits: string[] = []
    const values: string[] = []
    const handle = createRef<GameInputHandle>()
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)

    await act(async () => {
      root.render(
        <GameInput
          ref={handle}
          value=""
          onValueChange={(v) => values.push(v)}
          onCommit={(v) => commits.push(v)}
        />,
      )
    })

    const input = host.querySelector('input')!
    expect(input).toBeTruthy()

    await act(async () => {
      input.dispatchEvent(
        new CompositionEvent('compositionstart', { bubbles: true }),
      )
      // simulate interim Ctrl+Shift+U text
      Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!.call(input, 'u201e')
      input.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          data: 'u201e',
          inputType: 'insertCompositionText',
          isComposing: true,
        }),
      )
    })

    expect(commits).toEqual([])

    await act(async () => {
      Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!.call(input, '„')
      input.dispatchEvent(
        new CompositionEvent('compositionend', {
          bubbles: true,
          data: '„',
        }),
      )
    })

    expect(commits.at(-1)).toBe('„')
    root.unmount()
    host.remove()
    vi.unstubAllGlobals()
  })
})
