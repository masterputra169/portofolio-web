import type { ReactNode } from 'react'
import { RootDocument, rootMetadata, rootViewport } from '@/components/RootDocument'

export const metadata = rootMetadata
export const viewport = rootViewport

export default function IndonesianLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="id">{children}</RootDocument>
}
