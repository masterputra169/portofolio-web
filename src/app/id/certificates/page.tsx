import { CertificatesView } from '@/views/Views'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({ lang: 'id', path: '/certificates/', title: ({ en: 'Certificates', id: 'Sertifikat' })['id'], description: ({ en: 'Certificates earned by Timotius Kusuma Wardana Putra: IBM, SAP & ASEAN Foundation, Indonesia Web3 Hackathon.', id: 'Sertifikat Timotius Kusuma Wardana Putra: IBM, SAP & ASEAN Foundation, Indonesia Web3 Hackathon.' })['id'] })

export default function Page() {
  return <CertificatesView lang="id" />
}
