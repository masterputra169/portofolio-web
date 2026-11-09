'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '@/content/types'
import { UI, t } from '@/content/i18n'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** seconds for the row to travel one full set of items: slow enough to read every word */
const LOOP_SECONDS = 60

/**
 * Stack ticker that drifts on its own (the owner's choice, DESIGN.md) and speeds up a little while
 * the page scrolls. Moving longer than 5 s needs a way to stop it (WCAG 2.2.2): it pauses while
 * hovered or focused, while off screen, and with the pause button; reduced motion keeps it still.
 */
export function Marquee({ items, lang }: { items: string[]; lang: Lang }) {
  const root = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const syncRef = useRef<() => void>(() => {})

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const box = root.current?.querySelector<HTMLElement>('.marquee')
        const track = box?.querySelector('.mq-track')
        if (!box || !track) return
        const loop = gsap.to(track, { xPercent: -50, duration: LOOP_SECONDS, ease: 'none', repeat: -1, paused: true })
        const skew = gsap.quickTo(track, 'skewX', { duration: 0.9, ease: 'power2.out' })
        let hovered = false
        let visible = false
        const sync = () => { if (pausedRef.current || hovered || !visible) loop.pause(); else loop.resume() }
        syncRef.current = sync

        ScrollTrigger.create({
          trigger: box,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => { visible = self.isActive; if (!self.isActive) skew(0); sync() },
          onUpdate: (self) => {
            const v = self.getVelocity()
            skew(gsap.utils.clamp(-3, 3, v / -900))
            // a gentle push while scrolling (at most 3x the resting speed), easing back afterwards
            gsap.to(loop, {
              timeScale: 1 + Math.min(2, Math.abs(v) / 1200),
              duration: 0.3,
              overwrite: true,
              onComplete: () => { gsap.to(loop, { timeScale: 1, duration: 1.4, ease: 'power2.out', overwrite: true }) },
            })
          },
        })
        const enter = () => { hovered = true; sync() }
        const leave = () => { hovered = false; sync() }
        box.addEventListener('pointerenter', enter)
        box.addEventListener('pointerleave', leave)
        return () => {
          box.removeEventListener('pointerenter', enter)
          box.removeEventListener('pointerleave', leave)
          syncRef.current = () => {}
        }
      })
    },
    { scope: root },
  )

  useEffect(() => {
    pausedRef.current = paused
    syncRef.current()
  }, [paused])

  const row = [...items, ...items]
  return (
    <div ref={root} className="mq-wrap">
      <div className="marquee" aria-hidden="true">
        <div className="mq-track">
          {row.map((s, i) => (
            <span key={i}>{s}<i>◆</i></span>
          ))}
        </div>
      </div>
      <button type="button" className="mq-ctl" onClick={() => setPaused((p) => !p)}>
        <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span> {t(paused ? UI.mqPlay : UI.mqPause, lang)}
      </button>
    </div>
  )
}
