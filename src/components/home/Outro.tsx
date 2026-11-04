'use client'

import { useRef, type PointerEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '@/content/types'
import { SITE, SOCIALS } from '@/content/site'
import { UI, t } from '@/content/i18n'
import { bus } from '@/scene/bus'
import { RevealText } from '../motion/Reveal'
import { openTerminal } from '../Terminal'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Outro({ lang }: { lang: Lang }) {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'center center',
        onUpdate: (self) => { bus.outro = self.progress },
        onLeaveBack: () => { bus.outro = 0 },
      })
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(gsap.utils.toArray('.outro-row > *', root.current), {
          autoAlpha: 0, y: 24, duration: 0.9, ease: 'power4.out', stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 55%', toggleActions: 'play none none reverse' },
        })
      })
    },
    { scope: root },
  )

  // magnetic buttons
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    gsap.to(el, { x: ((e.clientX - r.left) / r.width - 0.5) * 14, y: ((e.clientY - r.top) / r.height - 0.5) * 10, duration: 0.4, ease: 'power3.out' })
  }
  const onLeave = (e: PointerEvent<HTMLElement>) => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: 'expo.out' })

  return (
    <section ref={root} className="outro" id="contact">
      <RevealText className="outro-title">{t(UI.outro, lang)}</RevealText>
      <div className="outro-row">
        <a className="cta p" href={`https://github.com/${SITE.githubUser}`} target="_blank" rel="noopener" onPointerMove={onMove} onPointerLeave={onLeave}>{t(UI.allRepos, lang)} ↗</a>
        {SOCIALS.filter((s) => s.key !== 'github').map((s) => (
          <a key={s.key} className="cta" href={s.url} target="_blank" rel="me noopener" onPointerMove={onMove} onPointerLeave={onLeave}>{s.label} {s.handle} ↗</a>
        ))}
        <button className="cta" type="button" onClick={openTerminal} onPointerMove={onMove} onPointerLeave={onLeave}>{t(UI.tryTerminal, lang)}</button>
      </div>
      {SITE.email ? <p className="outro-mail">{SITE.email}</p> : null}
    </section>
  )
}
