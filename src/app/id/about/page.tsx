import { AboutView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'id', path: '/about/', title: ({ en: 'About', id: 'Tentang' })['id'] })

export default function Page() {
  return <AboutView lang="id" />
}
