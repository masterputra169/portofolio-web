import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from 'next/font/google'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Terminal } from '@/components/Terminal'
import { SITE } from '@/content/site'
import { JsonLd, personJsonLd, websiteJsonLd } from '@/lib/seo'
import './globals.css'

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Web3 developer`, template: `%s · ${SITE.alias}` },
  description: SITE.identity.en,
  applicationName: 'masterputra.tech',
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  keywords: ['Timotius Kusuma Wardana Putra', 'masterputra', 'Web3 developer', 'Kediri', 'Indonesia', 'Solana', 'Polymarket', 'XGBoost', 'Next.js'],
  icons: { icon: '/favicon.svg', apple: '/images/avatar.jpg' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#07080A', colorScheme: 'dark' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* .js lets CSS hide what the intro reveals, from the first paint. If the app never hydrates
            (blocked or failed scripts), drop it after 10 s so the page falls back to its static layout. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.hasAttribute('data-hydrated'))d.classList.remove('js')},10000)",
          }}
        />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={personJsonLd('en')} />
        <SmoothScroll />
        {children}
        <Terminal />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  )
}
