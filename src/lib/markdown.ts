import { marked } from 'marked'

const ABS = /^(?:[a-z]+:)?\/\//i

/** Render a repo README to HTML and make relative links/images absolute. */
export function renderReadme(md: string, rawBase: string, repoUrl: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/(<img[^>]+src=")([^"]+)"/gi, (_m, pre: string, src: string) => `${pre}${ABS.test(src) || src.startsWith('data:') ? src : rawBase + src.replace(/^\.?\//, '')}" loading="lazy"`)
    .replace(/(<a[^>]+href=")([^"#][^"]*)"/gi, (_m, pre: string, url: string) =>
      `${pre}${ABS.test(url) || url.startsWith('mailto:') ? url : `${repoUrl}/blob/HEAD/${url.replace(/^\.?\//, '')}`}"`,
    )
}
