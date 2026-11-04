'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Infinite stack ticker that skews and speeds up with scroll velocity. */
export function Marquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = root.current?.querySelector('.mq-track')
        if (!track) return
        const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
        const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' })
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity()
            skew(gsap.utils.clamp(-12, 12, v / -220))
            loop.timeScale(1 + Math.min(6, Math.abs(v) / 400))
          },
          onToggle: (self) => { if (!self.isActive) { skew(0); loop.timeScale(1) } },
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
