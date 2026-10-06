import Heading from '@tiptap/extension-heading'

export const StyledHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      paraStyle: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-para-style'),
        renderHTML: (attributes) =>
          attributes.paraStyle
            ? { 'data-para-style': attributes.paraStyle }
            : {},
      },
    }
  },
})
