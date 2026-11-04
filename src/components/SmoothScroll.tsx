'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { bus } from '@/scene/bus'

gsap.registerPlugin(ScrollTrigger)

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: false })
    bus.lenis = lenis
    if (bus.introPending) lenis.stop()
    lenis.on('scroll', (l: Lenis) => {
      bus.velocity = l.velocity
      ScrollTrigger.update()
    })
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      bus.lenis = null
    }
  }, [])
  return null
}
