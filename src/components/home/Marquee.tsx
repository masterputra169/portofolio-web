'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Stack ticker driven by the scroll: it moves only while the visitor scrolls (and skews with the
 * scroll speed), so nothing slides on its own and no pause button is needed.
 */
export function Marquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = root.current?.querySelector('.mq-track')
        if (!track) return
        const skew = gsap.quickTo(track, 'skewX', { duration: 0.9, ease: 'power2.out' })
        // the row drifts at ~0.35x the scroll speed (it used to cover ~1.2x, faster than the page),
        // with a soft scrub and only a slight lean, so the words stay readable while they move
        const SPEED = 0.35
        gsap.fromTo(track, { x: 0 }, {
          x: () => -(window.innerHeight + (root.current?.offsetHeight ?? 0)) * SPEED,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => skew(gsap.utils.clamp(-3, 3, self.getVelocity() / -900)),
            onToggle: (self) => { if (!self.isActive) skew(0) },
          },
        })
      })
    },
    { scope: root },
  )
  const row = [...items, ...items]
  return (
    <div ref={root} className="marquee" aria-hidden="true">
      <div className="mq-track">
        {row.map((s, i) => (
          <span key={i}>{s}<i>◆</i></span>
        ))}
      </div>
    </div>
  )
}
