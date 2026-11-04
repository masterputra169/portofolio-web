import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/github'
import { abs } from '@/lib/seo'
import { href } from '@/content/i18n'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()
  const paths = ['/', '/work/', '/journey/', '/about/', '/certificates/', ...projects.map((p) => `/work/${p.slug}/`)]
  const now = new Date()
  return paths.map((path) => ({
    url: abs(href('en', path)),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/work/') && path !== '/work/' ? 0.7 : 0.8,
    alternates: { languages: { en: abs(href('en', path)), id: abs(href('id', path)) } },
  }))
}
