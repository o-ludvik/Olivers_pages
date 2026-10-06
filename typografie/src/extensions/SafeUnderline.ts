import Underline from '@tiptap/extension-underline'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * TipTap default binds `Mod-U` (Ctrl+Shift+U) and parses CSS underline from the DOM.
 * On Linux that fights Unicode input and leaves a flickering underline.
 */
export const SafeUnderline = Underline.extend({
  parseHTML() {
    return [{ tag: 'u' }]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-u': () => this.editor.commands.toggleUnderline(),
    }
  },
})

function stripImeUnderlineStyles(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
    if (el.tagName === 'U' || el.tagName === 'A') return
    const style = el.style
    const deco = `${style.textDecoration} ${style.textDecorationLine}`
    if (!/underline/i.test(deco)) return
    style.textDecoration = 'none'
    style.textDecorationLine = 'none'
    style.textDecorationColor = ''
    style.textDecorationStyle = ''
    style.textDecorationThickness = ''
    if (!(style.cssText || '').trim()) el.removeAttribute('style')
  })
}

/** Clear IME/composition underline leftovers in the DOM and document marks. */
export const ImeUnderlineCleanup = Extension.create({
  name: 'imeUnderlineCleanup',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imeUnderlineCleanup'),
        props: {
          handleDOMEvents: {
            compositionend: (view, event) => {
              const mark = view.state.schema.marks.underline
              const data = event.data ?? ''
              const cleanup = () => {
                stripImeUnderlineStyles(view.dom as HTMLElement)
                if (!mark) return
                const { state, dispatch } = view
                let tr = state.tr
                const end = state.selection.from
                const fromPos = Math.max(0, end - Math.max(data.length, 1))
                if (fromPos < end) tr = tr.removeMark(fromPos, end, mark)
                tr = tr.removeStoredMark(mark)
                if (tr.docChanged || tr.storedMarksSet) dispatch(tr)
              }
              // Chromium applies composition styles asynchronously
              queueMicrotask(cleanup)
              window.setTimeout(cleanup, 0)
              window.setTimeout(cleanup, 50)
              return false
            },
            input: (view) => {
              // Cheap: strip stray inline underline styles after each input
              stripImeUnderlineStyles(view.dom as HTMLElement)
              return false
            },
          },
        },
      }),
    ]
  },
})
