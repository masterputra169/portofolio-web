'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const DURATION = 1.1
const EASE = 'expo.out'

/**
 * MOTION dial (DESIGN.md): the home page is the cinematic one; secondary pages stay calm.
 * Headlines there do not animate, and groups only fade in once.
 */
const onHome = (el: Element | null) => !!el?.closest('.page-home')

/** Masked word-by-word headline reveal on scroll (home only). Text stays visible without JS or with reduced motion. */
export function RevealText({ as: Tag = 'h2', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let split: SplitText | null = null
        document.fonts.ready.then(() => {
          if (!ref.current || !onHome(ref.current)) return
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

/** Batched rise-in for groups of children marked with `.rv` (a plain one-time fade on secondary pages). */
export function RevealGroup({ as: Tag = 'div', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('.rv', ref.current)
        // opacity, not autoAlpha: hidden items must stay focusable, or Tab skips links that have not
        // scrolled in yet. Focusing one shows it at once.
        const onFocus = (e: FocusEvent) => {
          const item = (e.target as Element).closest('.rv')
          if (item) gsap.to(item, { opacity: 1, y: 0, duration: 0.2, overwrite: true })
        }
        const el = ref.current
        el?.addEventListener('focusin', onFocus)
        const off = () => el?.removeEventListener('focusin', onFocus)
        if (!onHome(ref.current)) {
          gsap.set(items, { opacity: 0 })
          ScrollTrigger.batch(items, { start: 'top 95%', once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.4, ease: 'power1.out', stagger: 0.04 }) })
          return off
        }
        gsap.set(items, { opacity: 0, y: 28 })
        ScrollTrigger.batch(items, {
          start: 'top 90%',
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07, overwrite: true }),
          onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 28, duration: 0.3, ease: 'power2.in', overwrite: true }),
        })
        return off
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
