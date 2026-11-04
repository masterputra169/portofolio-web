'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // close the mobile menu on navigation, Escape, or a click outside it
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  const links = [
    { key: 'work', label: t(nav.work, lang), path: '/work/' },
    { key: 'journey', label: t(nav.journey, lang), path: '/journey/' },
    { key: 'about', label: t(nav.about, lang), path: '/about/' },
  ]
  const current = (path: string) => (pathname === href(lang, path) ? 'page' : undefined)

  return (
    <header className="site-header" data-intro-hidden={hidden ? 'true' : undefined} id="site-header">
      <Link className="brand" href={href(lang, '/')}>
        masterputra<b>.tech</b>
      </Link>
      <nav aria-label={lang === 'en' ? 'Main' : 'Utama'}>
        {links.map((l) => (
          <Link key={l.key} className="hide-sm" href={href(lang, l.path)} aria-current={current(l.path)}>{l.label}</Link>
        ))}
        <div className="mnav-wrap" ref={menuRef}>
          <button className="btn mnav-btn" type="button" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)}>
            {open ? (lang === 'en' ? 'close' : 'tutup') : 'menu'}
          </button>
          <ul id="mnav" className="mnav" hidden={!open}>
            {[...links, { key: 'certificates', label: t(nav.certificates, lang), path: '/certificates/' }].map((l) => (
              <li key={l.key}>
                <Link href={href(lang, l.path)} aria-current={current(l.path)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <button className="btn" type="button" onClick={openTerminal} aria-label={lang === 'en' ? 'Open terminal' : 'Buka terminal'}>&gt;_<span className="hide-sm">&nbsp;terminal</span></button>
        <Link className="btn" href={counterpart(pathname, lang)} hrefLang={lang === 'en' ? 'id' : 'en'} lang={lang === 'en' ? 'id' : 'en'}>
          {lang === 'en' ? 'ID' : 'EN'}
          <span className="sr">{t(UI.langSwitch, lang)}</span>
        </Link>
      </nav>
    </header>
  )
}
