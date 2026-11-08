import { CertificatesView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'en', path: '/certificates/', title: ({ en: 'Certificates', id: 'Sertifikat' })['en'], description: ({ en: 'Certificates earned by Timotius Kusuma Wardana Putra: IBM, SAP & ASEAN Foundation, Indonesia Web3 Hackathon.', id: 'Sertifikat Timotius Kusuma Wardana Putra: IBM, SAP & ASEAN Foundation, Indonesia Web3 Hackathon.' })['en'] })

export default function Page() {
  return <CertificatesView lang="en" />
}
