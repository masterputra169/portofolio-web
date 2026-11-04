import { HomeView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'en', path: '/' })

export default async function Page() {
  return <HomeView lang="en" />
}
