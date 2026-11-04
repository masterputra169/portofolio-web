'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Lang } from '@/content/types'
import { UI, href, t } from '@/content/i18n'
import { openTerminal } from './Terminal'

function counterpart(pathname: string, lang: Lang) {
  if (lang === 'id') {
    const p = pathname.replace(/^\/id(?=\/|$)/, '')
    return p === '' ? '/' : p
  }
  return `/id${pathname === '/' ? '/' : pathname}`
}

export function Header({ lang, hidden = false }: { lang: Lang; hidden?: boolean }) {
  const pathname = usePathname() || '/'
  const nav = UI.nav
  return (
    <header className="site-header" data-intro-hidden={hidden ? 'true' : undefined} id="site-header">
      <Link className="brand" href={href(lang, '/')}>
        masterputra<b>.tech</b>
      </Link>
      <nav aria-label="Main">
        <Link className="hide-sm" href={href(lang, '/work/')}>{t(nav.work, lang)}</Link>
        <Link className="hide-sm" href={href(lang, '/journey/')}>{t(nav.journey, lang)}</Link>
        <Link className="hide-sm" href={href(lang, '/about/')}>{t(nav.about, lang)}</Link>
        <button className="btn" type="button" onClick={openTerminal}>{t(UI.terminal, lang)}</button>
        <Link className="btn" href={counterpart(pathname, lang)} hrefLang={lang === 'en' ? 'id' : 'en'} lang={lang === 'en' ? 'id' : 'en'}>
          {lang === 'en' ? 'ID' : 'EN'}
          <span className="sr">{t(UI.langSwitch, lang)}</span>
        </Link>
      </nav>
    </header>
  )
}
