'use client'

import { useRef, type ReactNode, type PointerEvent } from 'react'
import gsap from 'gsap'

/** Card that tilts toward the pointer (fine pointers only, off for reduced motion). */
export function TiltCard({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const ok = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!ok() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 10, y: -6, duration: 0.5, ease: 'power3.out', transformPerspective: 900 })
  }
  const onLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: 'expo.out' })
  }
  return (
    <article ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </article>
  )
}
