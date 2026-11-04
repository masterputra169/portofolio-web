'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang, Project } from '@/content/types'
import { UI, href, t } from '@/content/i18n'
import { bus } from '@/scene/bus'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const CAT_COLOR: Record<string, string> = { web3: 'var(--crypto)', ml: 'var(--ai)', tools: 'var(--dev)', research: 'var(--ai)', fullstack: 'var(--dev)', other: 'var(--mut)' }
const TX = ['0x3fa1…9c2', '0x40d8…a07', '0x428f…b5c', '0x4446…c11']

/** Pinned scroll narrative: the camera flies along the chain and each block opens into a project. */
export function ChainSection({ lang, projects }: { lang: Lang; projects: Project[] }) {
  const root = useRef<HTMLElement>(null)
  const featured = projects.slice(0, 4)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const panels = q('.chain-panel')
      const bars = q('.rail i b')
      const mm = gsap.matchMedia()

      mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        const { motion } = ctx.conditions as { motion: boolean }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * (featured.length + 0.6)}`,
            pin: q('.chain-stage')[0],
            scrub: motion ? 1 : true,
            anticipatePin: 1,
            onUpdate: (self) => {
              bus.scroll = self.progress
              const seg = self.progress * (featured.length + 0.6) - 0.3
              bus.focus = Math.max(0, seg + 0.5)
              bus.active = seg >= 0 && seg < featured.length ? Math.floor(seg) : -1
            },
            onLeave: () => { bus.active = -1 },
            onLeaveBack: () => { bus.active = -1; bus.scroll = 0; bus.focus = 0 },
          },
        })
        tl.to({}, { duration: 0.3 })
        panels.forEach((p, i) => {
          const kids = p.querySelectorAll('.cp-item')
          const at = 0.3 + i
          if (motion) {
            tl.fromTo(p, { autoAlpha: 0, y: 70, rotateX: -8 }, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.18, ease: 'power3.out' }, at)
              .fromTo(kids, { autoAlpha: 0, y: 26, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.16, stagger: 0.022, ease: 'power3.out' }, at + 0.02)
              .fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 1 }, at)
              .to(p, { autoAlpha: 0, y: -60, duration: 0.16, ease: 'power2.in' }, at + 0.84)
          } else {
            tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, at).to(p, { autoAlpha: 0, duration: 0.05 }, at + 0.9)
          }
        })
        tl.to({}, { duration: 0.3 })
      })
    },
    { scope: root, dependencies: [featured.length] },
  )

  return (
    <section ref={root} className="chain" id="work" aria-label={lang === 'en' ? 'Selected work' : 'Karya pilihan'}>
      <div className="chain-stage">
        <div className="rail" aria-hidden="true">
          {featured.map((p, i) => (
            <div key={p.slug}><i><b /></i><span>#{i + 1}</span></div>
          ))}
        </div>
        {featured.map((p, i) => (
          <article key={p.slug} className="chain-panel" aria-labelledby={`cp-${p.slug}`}>
            <div className="cp-item cp-tx"><span>block #{i + 1} · tx {TX[i]}</span><b>● {t(UI.confirmed, lang)}</b></div>
            <div className="cp-item cp-cat" style={{ color: CAT_COLOR[p.categories[0]] ?? 'var(--mut)' }}>
              {p.categories.map((c) => t(UI.categories[c], lang)).join(' · ')}
            </div>
            <h2 className="cp-item" id={`cp-${p.slug}`}>{p.title}</h2>
            <p className="cp-item">{t(p.summary, lang)}</p>
            {p.stats.length ? (
              <div className="cp-item stats">
                {p.stats.slice(0, 3).map((s) => (
                  <div key={s.value + s.label.en}><b>{s.value}</b><span>{t(s.label, lang)}</span></div>
                ))}
              </div>
            ) : null}
            <div className="cp-item cp-links">
              <Link href={href(lang, `/work/${p.slug}/`)}>{t(UI.readCase, lang)} →</Link>
              {p.repoUrl ? <a href={p.repoUrl} target="_blank" rel="noopener">{t(UI.onGithub, lang)} ↗</a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
