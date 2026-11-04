'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import type { Lang } from '@/content/types'
import { JOURNEYS } from '@/content/journeys'
import { UI, href, t } from '@/content/i18n'
import { RevealText } from '../motion/Reveal'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin)

/** Three lanes whose lines draw with scroll; milestones light up as the line reaches them. */
export function Journeys({ lang, showTitle = true }: { lang: Lang; showTitle?: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lanes = gsap.utils.toArray<HTMLElement>('.lane', root.current)
        lanes.forEach((lane, li) => {
          const line = lane.querySelector('.lane-line')
          const steps = lane.querySelectorAll('.step')
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            // clamp(): on /journey the page ends just below the lanes, so "bottom 55%" lies past
            // the max scroll — the timeline never finished and the last steps stayed dimmed.
            scrollTrigger: { trigger: lane, start: 'top 75%', end: 'clamp(bottom 55%)', scrub: 1 },
          })
          if (line) tl.fromTo(line, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, 0)
          steps.forEach((s, i) => {
            const at = (i / Math.max(1, steps.length - 1)) * 0.9
            tl.fromTo(s, { autoAlpha: 0.12, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.15, ease: 'power2.out' }, at)
            const dot = s.querySelector('.dot')
            if (dot) tl.fromTo(dot, { scale: 0.4 }, { scale: 1, duration: 0.1 }, at)
          })
          const head = lane.querySelector('.lane-head')
          if (head) gsap.from(head, {
            autoAlpha: 0, y: 30, duration: 1, ease: 'expo.out', delay: li * 0.08,
            scrollTrigger: { trigger: lane, start: 'top 85%', toggleActions: 'play none none reverse' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section journeys" id="journey">
      {showTitle ? (
        <div className="sec-head">
          <span className="eyebrow">BLOCKS #1 – #3</span>
          <RevealText className="sec-title">{t(UI.journeysTitle, lang)}</RevealText>
          <p className="sec-lead">{t(UI.journeysLead, lang)}</p>
        </div>
      ) : null}
      <div className="lanes">
        {JOURNEYS.map((j) => (
          <div key={j.key} className="lane" style={{ ['--lane' as string]: j.color }}>
            <div className="lane-head">
              <span className="lane-chip" />
              <h3>{t(j.name, lang)}</h3>
            </div>
            <div className="lane-body">
              <svg className="lane-svg" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="2" y1="0" x2="2" y2="100" className="lane-track" />
                <line x1="2" y1="0" x2="2" y2="100" className="lane-line" />
              </svg>
              <ol>
                {j.steps.map((s, i) => (
                  <li key={i} className="step">
                    <span className="dot" aria-hidden="true" />
                    <h4>{t(s.title, lang)}</h4>
                    <p>{t(s.body, lang)}</p>
                    {s.project ? <Link className="step-link" href={href(lang, `/work/${s.project}/`)}>{t(UI.readCase, lang)} →</Link> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
