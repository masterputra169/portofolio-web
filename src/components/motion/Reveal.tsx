'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const DURATION = 1.1
const EASE = 'expo.out'

/** Masked word-by-word headline reveal on scroll. Text stays visible without JS or with reduced motion. */
export function RevealText({ as: Tag = 'h2', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let split: SplitText | null = null
        document.fonts.ready.then(() => {
          if (!ref.current) return
          split = new SplitText(ref.current, { type: 'words', mask: 'words' })
          gsap.from(split.words, {
            yPercent: 110,
            duration: DURATION,
            ease: EASE,
            stagger: 0.05,
            scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          })
        })
        return () => split?.revert()
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/** Batched rise-in for groups of children marked with `.rv`. */
export function RevealGroup({ as: Tag = 'div', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('.rv', ref.current)
        gsap.set(items, { autoAlpha: 0, y: 28 })
        ScrollTrigger.batch(items, {
          start: 'top 90%',
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07, overwrite: true }),
          onLeaveBack: (batch) => gsap.to(batch, { autoAlpha: 0, y: 28, duration: 0.3, ease: 'power2.in', overwrite: true }),
        })
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
