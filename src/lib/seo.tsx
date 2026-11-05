import type { Metadata } from 'next'
import type { Lang, Project } from '@/content/types'
import { CERTIFICATES, EXPERTISE, FAQ, SITE, SOCIALS } from '@/content/site'
import { href, t } from '@/content/i18n'

export const abs = (path: string) => `${SITE.url}${path}`

/** Per-page metadata with canonical + hreflang alternates for both languages. */
export function pageMeta({ lang, path, title, description }: { lang: Lang; path: string; title?: string; description?: string }): Metadata {
  const desc = description ?? t(SITE.identity, lang)
  const url = abs(href(lang, path))
  return {
    title: title ?? { absolute: `${SITE.name} — ${t(SITE.role, lang)}` },
    description: desc,
    alternates: {
      canonical: url,
      languages: { en: abs(href('en', path)), id: abs(href('id', path)), 'x-default': abs(href('en', path)) },
    },
    openGraph: {
      type: 'profile',
      url,
      title: title ?? `${SITE.name} (${SITE.alias})`,
      description: desc,
      siteName: 'masterputra.tech',
      locale: lang === 'en' ? 'en_US' : 'id_ID',
      images: [{ url: abs('/og.jpg'), width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: { card: 'summary_large_image', site: '@masterputra6969', creator: '@masterputra6969', images: [abs('/og.jpg')] },
  }
}

export function personJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': abs('/#person'),
    name: SITE.name,
    alternateName: [SITE.alias, SITE.shortName],
    url: SITE.url,
    image: abs(SITE.photoJpg),
    jobTitle: t(SITE.role, lang),
    description: t(SITE.identity, lang),
    address: { '@type': 'PostalAddress', addressLocality: 'Kediri', addressRegion: 'East Java', addressCountry: 'ID' },
    affiliation: { '@type': 'CollegeOrUniversity', name: 'Universitas Dian Nuswantoro' },
    memberOf: { '@type': 'Organization', name: 'Web3 Developer Jogja' },
    knowsAbout: [...EXPERTISE.shipping, 'Web3', 'Machine learning', 'Prediction markets', 'On-chain analytics'],
    sameAs: SOCIALS.map((s) => s.url),
    ...(SITE.email ? { email: `mailto:${SITE.email}` } : {}),
    hasCredential: CERTIFICATES.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.title,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      ...(c.verify ? { url: c.verify } : {}),
    })),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: SITE.url,
    name: 'masterputra.tech',
    inLanguage: ['en', 'id'],
    author: { '@id': abs('/#person') },
  }
}

export function faqJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: t(f.q, lang), acceptedAnswer: { '@type': 'Answer', text: t(f.a, lang) } })),
  }
}

export function profilePageJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs(href(lang, '/about/')),
    inLanguage: lang,
    mainEntity: { '@id': abs('/#person') },
    dateModified: process.env.NEXT_PUBLIC_BUILD_DATE,
  }
}

export function projectJsonLd(p: Project, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': p.repoUrl ? 'SoftwareSourceCode' : 'CreativeWork',
    name: p.title,
    description: t(p.summary, lang),
    url: abs(href(lang, `/work/${p.slug}/`)),
    author: { '@id': abs('/#person') },
    ...(p.repoUrl ? { codeRepository: p.repoUrl } : {}),
    ...(p.language ? { programmingLanguage: p.language } : {}),
    keywords: p.stack.join(', '),
    inLanguage: lang,
  }
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
