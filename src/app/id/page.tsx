import { HomeView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'id', path: '/' })

export default async function Page() {
  return <HomeView lang="id" />
}
