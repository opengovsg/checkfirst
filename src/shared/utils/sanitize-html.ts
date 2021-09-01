import xss from 'xss'

const WHITELIST = {
  a: ['class', 'target', 'rel', 'href'],
  p: [],
}
export const sanitizeHtml = (html: string): string => {
  const sanitized = xss(html, {
    whiteList: WHITELIST,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  })

  return sanitized
}
