import type { Metadata } from 'next'
import { CaseStudyView } from '@/views/Views'
import { getProject, getProjects } from '@/lib/github'
import { pageMeta } from '@/lib/seo'

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await getProject(slug)
  return pageMeta({ lang: 'en', path: `/work/${slug}/`, title: p?.title, description: p ? p.summary['en'] || undefined : undefined })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CaseStudyView lang="en" slug={slug} />
}
