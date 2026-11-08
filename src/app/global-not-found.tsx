import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { RootDocument, rootViewport } from '@/components/RootDocument'

export const metadata: Metadata = { title: '404 · block not found', robots: { index: false, follow: true } }
export const viewport = rootViewport

/** One static 404 for both languages (the site has two root layouts, so it lives here): English first, Indonesian beneath. */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <div className="page">
        <Header lang="en" />
        <main id="main" className="notfound">
          <span className="eyebrow">404 · block not found</span>
          <h1 className="page-title">This block was never mined.</h1>
          <p>The page you are looking for is not on this chain.</p>
          <p lang="id">Halaman yang kamu cari tidak ada di rantai ini.</p>
          <div className="notfound-links">
            <Link className="cta p" href="/">Back to genesis</Link>
            <Link className="cta" href="/work/">See the work</Link>
            <Link className="cta" href="/id/" lang="id">Beranda (ID)</Link>
          </div>
        </main>
        <Footer lang="en" />
      </div>
    </RootDocument>
  )
}
