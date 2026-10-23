const OK = /^<(\/?(b|strong|i|em|sub|sup|code)|b class="big"|br ?\/?)>$/;

/* Vrátí první nepovolený tag, nebo null. */
export function badInlineTag(s) {
  for (const tag of String(s).match(/<[^>]*>?/g) || []) if (!OK.test(tag)) return tag;
  return null;
}
