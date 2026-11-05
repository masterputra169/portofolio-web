import { CvView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'en', path: '/cv/', title: 'CV', description: 'Curriculum vitae of Timotius Kusuma Wardana Putra (masterputra), Web3 developer from Kediri, Indonesia. View or download the PDF.' })

export default function Page() {
  return <CvView lang="en" />
}
