import { JourneyView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'id', path: '/journey/', title: ({ en: 'Journey', id: 'Perjalanan' })['id'], description: ({ en: 'Crypto, developer and AI explorer journeys of Timotius Kusuma Wardana Putra.', id: 'Perjalanan crypto, developer, dan AI explorer Timotius Kusuma Wardana Putra.' })['id'] })

export default function Page() {
  return <JourneyView lang="id" />
}
