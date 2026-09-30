import OrderedList from '@tiptap/extension-ordered-list'
import { wrappingInputRule } from '@tiptap/core'

/**
 * Only "1. " at the start of a line creates an ordered list.
 * Dates like "17. 10. 2001" must stay as normal text.
 * Further items (2., 3., …) come from Enter inside the list.
 */
export const SequentialOrderedList = OrderedList.extend({
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^1\.\s$/,
        type: this.type,
        getAttributes: () => ({ start: 1 }),
      }),
    ]
  },
})
