import { CvView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'id', path: '/cv/', title: 'CV', description: 'Curriculum vitae Timotius Kusuma Wardana Putra (masterputra), Web3 developer dari Kediri, Indonesia. Lihat atau unduh PDF-nya.' })

export default function Page() {
  return <CvView lang="id" />
}
