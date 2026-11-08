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
        const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' })
        gsap.fromTo(track, { xPercent: 0 }, {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => skew(gsap.utils.clamp(-12, 12, self.getVelocity() / -220)),
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
