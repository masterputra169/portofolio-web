import { AboutView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'en', path: '/about/', title: ({ en: 'About', id: 'Tentang' })['en'] })

export default function Page() {
  return <AboutView lang="en" />
}
