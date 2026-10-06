import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) =>
              element.style.fontSize?.replace(/['"]+/g, '') || null,
            renderHTML: (attributes: { fontSize?: string | null }) => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ state, dispatch, tr }) => {
          const markType = state.schema.marks.textStyle
          if (!markType) return false
          const { empty, from, to } = state.selection
          const prev = markType.isInSet(state.storedMarks || state.selection.$from.marks())
          const attrs = { ...(prev?.attrs ?? {}), fontSize }
          if (empty) {
            // Stored mark → next typed character; also clear conflicting stored size
            tr = tr.removeStoredMark(markType).addStoredMark(markType.create(attrs))
          } else {
            tr = tr.addMark(from, to, markType.create(attrs))
          }
          dispatch?.(tr.scrollIntoView())
          return true
        },
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    }
  },
})
