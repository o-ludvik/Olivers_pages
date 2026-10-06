import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    showHiddenChars: {
      setShowHiddenChars: (enabled: boolean) => ReturnType
    }
  }
}

const key = new PluginKey('showHiddenChars')

/** Build inline decorations for U+00A0 when show-hidden is on. */
export function nbspDecorations(doc: {
  descendants: (
    f: (node: { isText: boolean; text?: string }, pos: number) => void,
  ) => void
}): DecorationSet {
  const decos: Decoration[] = []
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return
    for (let i = 0; i < node.text.length; i++) {
      if (node.text[i] === '\u00A0') {
        decos.push(
          Decoration.inline(pos + i, pos + i + 1, { class: 'nbsp-mark' }),
        )
      }
    }
  })
  return DecorationSet.create(doc as Parameters<typeof DecorationSet.create>[0], decos)
}

export const ShowHiddenChars = Extension.create({
  name: 'showHiddenChars',

  addStorage() {
    return { enabled: false }
  },

  addCommands() {
    return {
      setShowHiddenChars:
        (enabled: boolean) =>
        ({ editor }) => {
          this.storage.enabled = enabled
          // Force decoration recompute
          editor.view.dispatch(editor.state.tr.setMeta(key, enabled))
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const ext = this
    return [
      new Plugin({
        key,
        props: {
          decorations(state) {
            if (!ext.storage.enabled) return DecorationSet.empty
            return nbspDecorations(state.doc)
          },
        },
      }),
    ]
  },
})
