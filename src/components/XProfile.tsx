'use client'

import { useEffect, useRef } from 'react'
import type { Lang } from '@/content/types'
import { SITE, SOCIALS } from '@/content/site'
import { UI, t } from '@/content/i18n'
import { bus } from '@/scene/bus'

const EVT = 'mp:xprofile'
/** Opens the X profile pop-up (mounted once per page by XProfileDialog). */
export const openXProfile = () => window.dispatchEvent(new CustomEvent(EVT))

const X = SOCIALS.find((s) => s.key === 'x')

/**
 * /about: the X avatar overlapping the bottom of the real photo, like a profile picture over a banner,
 * with the name and handle beside it. Avatar and text open the pop-up instead of leaving the site.
 */
export function XProfileBadge({ lang }: { lang: Lang }) {
  if (!X) return null
  return (
    <div className="xbadge">
      <button type="button" className="xbadge-av" onClick={openXProfile} aria-haspopup="dialog" aria-label={t(UI.viewProfile, lang)}>
        <img src={SITE.xProfile.avatar} alt="" width={104} height={104} />
      </button>
      <button type="button" className="xbadge-text" onClick={openXProfile} aria-haspopup="dialog">
        <span className="xbadge-aka">{t(UI.aka, lang)}</span>
        <b>{SITE.xProfile.name}</b>
        <span className="xbadge-handle">{X.handle}</span>
        <span className="xbadge-bio">{SITE.xProfile.bio}</span>
        <span className="xbadge-cta">{t(UI.viewProfile, lang)} →</span>
      </button>
    </div>
  )
}

/** Pop-up with the full profile artwork and the X profile snapshot. */
export function XProfileDialog({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const open = () => {
      if (dlg.open) return
      dlg.showModal()
      bus.lenis?.stop() // the page behind must not scroll; the dialog itself scrolls natively (data-lenis-prevent)
    }
    const onClose = () => { if (!bus.introPending) bus.lenis?.start() }
    // a click on the backdrop lands on the <dialog> itself; clicks on its content land on .xm
    const onClick = (e: MouseEvent) => { if (e.target === dlg) dlg.close() }
    window.addEventListener(EVT, open)
    dlg.addEventListener('close', onClose)
    dlg.addEventListener('click', onClick)
    return () => {
      window.removeEventListener(EVT, open)
      dlg.removeEventListener('close', onClose)
      dlg.removeEventListener('click', onClick)
    }
  }, [])

  if (!X) return null
  const snap = SITE.xProfile.snapshot
  return (
    <dialog ref={ref} className="xmodal" aria-labelledby="xm-title" data-lenis-prevent>
      <div className="xm">
        <button type="button" className="xm-close" onClick={() => ref.current?.close()} aria-label={t(UI.close, lang)}>×</button>
        <figure className="xm-art">
          <img src={SITE.xProfile.artwork.src} width={SITE.xProfile.artwork.width} height={SITE.xProfile.artwork.height} alt={t(UI.pfpAlt, lang)} loading="lazy" decoding="async" />
        </figure>
        <div className="xm-side">
          <div className="xm-head">
            <img src={SITE.xProfile.avatar} alt="" width={56} height={56} />
            <div>
              <h2 id="xm-title">{SITE.xProfile.name}</h2>
              <span>{X.handle}</span>
            </div>
          </div>
          <p className="xm-bio">{SITE.xProfile.bio}</p>
          <figure className="xm-snap">
            <img src={snap.src} width={snap.width} height={snap.height} alt={lang === 'en' ? 'Screenshot of the masterputra profile on X' : 'Tangkapan layar profil masterputra di X'} loading="lazy" decoding="async" />
            <figcaption>{t(UI.xSnapshot, lang).replace('{date}', t(snap.date, lang))}</figcaption>
          </figure>
          <a className="cta p" href={X.url} target="_blank" rel="me noopener">{t(UI.openOnX, lang)} ↗</a>
        </div>
      </div>
    </dialog>
  )
}
