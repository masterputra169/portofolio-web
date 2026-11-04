import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'

export const dynamic = 'force-static'

/** Every crawler is welcome — search engines and AI assistants alike (SEO + GEO). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
