import { WorkView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'id', path: '/work/', title: ({ en: 'Work', id: 'Karya' })['id'], description: ({ en: 'Featured case studies and every public repository by Timotius Kusuma Wardana Putra (masterputra).', id: 'Studi kasus unggulan dan semua repositori publik Timotius Kusuma Wardana Putra (masterputra).' })['id'] })

export default async function Page() {
  return <WorkView lang="id" />
}
