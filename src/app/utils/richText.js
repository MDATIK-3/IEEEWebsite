/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function looksLikeHtml(value) {
  return typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value);
}
