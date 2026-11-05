'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang } from '@/content/types'
import { ARCS, SITE, SOCIALS } from '@/content/site'
import { UI, href, t } from '@/content/i18n'
import { mine, sha256, shortHash } from '@/lib/pow'
import { bus } from '@/scene/bus'
import type { GenesisScene } from '@/scene/genesis'

gsap.registerPlugin(useGSAP, SplitText, ScrambleTextPlugin, ScrollTrigger)

const EASE_OUT = 'expo.out'
const EASE_IN_OUT = 'power3.inOut'

export function HeroGenesis({ lang }: { lang: Lang }) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const mobile = window.matchMedia('(max-width: 720px)').matches
      const q = gsap.utils.selector(root)
      const header = document.getElementById('site-header')
      let scene: GenesisScene | null = null
      let cancelled = false
      let arcTimer = 0
      const splits: SplitText[] = []
      let introStarted = false
      let settled = false
      let introTl: gsap.core.Timeline | null = null
      let watchdog = 0

      if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
      bus.introPending = true
      bus.lenis?.stop()

      gsap.set(q('.hero-eyebrow, .hero-sub, .scroll-hint'), { autoAlpha: 0, y: 10 })
      if (header) gsap.set(header, { autoAlpha: 0, y: -8 })

      const init = async () => {
        try {
          const { GenesisScene } = await import('@/scene/genesis')
          if (cancelled || !canvas.current) return
          scene = new GenesisScene(canvas.current, {
            mobile,
            reduced,
            onContextLost: () => document.documentElement.classList.add('nogl'),
          })
          scene.start()
        } catch {
          document.documentElement.classList.add('nogl')
        }

        const nonceEl = q('.m-nonce')[0], hashEl = q('.m-hash')[0], rateEl = q('.m-rate')[0], barEl = q('.m-bar i')[0], statusEl = q('.m-status')[0]
        const s = scene?.state
        if (s && !reduced) {
          gsap.to(s, { alpha: 1, duration: 1.4, ease: 'power2.out' })
          gsap.to(s, { spread: 1.9, flow: 0.55, duration: 3.6, ease: EASE_IN_OUT })
          gsap.to(s, { bloom: 0.5, duration: 2, ease: 'power2.out' })
        } else if (s) {
          Object.assign(s, { alpha: 1, spread: 1.25, flow: 0.4, bloom: 0.8 })
        }

        const seed = `${SITE.url}|genesis|${new Date().toISOString().slice(0, 10)}|${Math.random().toString(36).slice(2, 8)}`
        const zeros = (h: string) => { const z = h.match(/^0*/)?.[0].length ?? 0; return `<span class="z">${h.slice(0, z)}</span>${h.slice(z)}` }
        const t0 = performance.now()
        const r = await mine(seed, {
          prefix: reduced ? '0000' : '00000',
          budgetMs: reduced ? 400 : 2600,
          onTick: (tk) => {
            if (nonceEl) nonceEl.textContent = tk.nonce.toLocaleString('en-US')
            if (hashEl) hashEl.innerHTML = zeros(tk.best)
            if (rateEl) rateEl.textContent = tk.rate.toLocaleString('en-US')
            if (barEl) gsap.set(barEl, { scaleX: Math.min(0.94, tk.progress) })
          },
        })
        // keep the miner on screen long enough to read, even on very fast machines
        const MIN_MS = reduced ? 0 : 2200
        const left = MIN_MS - (performance.now() - t0)
        if (left > 0) await new Promise((res) => setTimeout(res, left))
        if (cancelled) return
        if (nonceEl) nonceEl.textContent = r.nonce.toLocaleString('en-US')
        if (hashEl) hashEl.innerHTML = zeros(r.hash)
        if (barEl) gsap.set(barEl, { scaleX: 1 })
        if (statusEl) {
          statusEl.classList.remove('blink')
          statusEl.textContent = `${t(UI.mining.found, lang)} ✓  nonce ${r.nonce.toLocaleString('en-US')} · ${(r.ms / 1000).toFixed(2)}s`
        }
        q('.g-hash').forEach((el) => (el.textContent = shortHash(r.hash)))

        // give each block a real hash chained from the genesis hash
        await document.fonts.ready
        if (scene) {
          let prev = r.hash
          for (let i = 0; i < scene.blocks.length; i++) {
            const h = i === 0 ? r.hash : await sha256(`${prev}|block|${i}`)
            scene.drawLabel(scene.blocks[i], i, h)
            prev = h
          }
        }
        bus.setMined(r.hash, r.ms)
        runIntro(scene, reduced)
      }

      const release = () => {
        settled = true
        window.clearTimeout(watchdog)
        bus.introPending = false
        bus.lenis?.start()
        ScrollTrigger.refresh()
      }

      // Show the finished hero at once. Used when mining or the scene fails or stalls: the page
      // starts hidden and scroll-locked, so without this an error would leave it black for good.
      const revealNow = () => {
        if (settled) return
        introStarted = true
        introTl?.kill()
        splits.forEach((sp) => sp.revert())
        splits.length = 0
        gsap.set(q('.miner'), { autoAlpha: 0, y: 0 })
        q('.hero-title')[0]?.classList.add('ready')
        gsap.set(q('.hero-eyebrow, .hero-sub, .scroll-hint'), { autoAlpha: 1, y: 0 })
        if (header) gsap.set(header, { autoAlpha: 1, y: 0 })
        const st = scene?.state
        if (scene && st) {
          Object.assign(st, { alpha: 1, intro: 0, packets: 1, spread: 1.25, flow: 0.4, bloom: 0.8 })
          scene.blocks.forEach((b) => Object.assign(b, { on: 1, scale: 1 }))
          scene.links.forEach((l) => (l.draw = 1))
        }
        release()
      }
      // mining + labels normally finish in under 6 s, even on slow machines
      watchdog = window.setTimeout(revealNow, 9000)

      const runIntro = (sc: GenesisScene | null, rm: boolean) => {
        if (settled || introStarted) return
        introStarted = true
        // the intro timeline itself lasts ~4.5 s; if it has not released the page by then, finish it
        window.clearTimeout(watchdog)
        watchdog = window.setTimeout(revealNow, 8000)
        try {
          playIntro(sc, rm)
        } catch (err) {
          console.error('[intro]', err)
          revealNow()
        }
      }

      const playIntro = (sc: GenesisScene | null, rm: boolean) => {
        const words = q('.hero-title')[0]
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, onComplete: release })
        introTl = tl
        const st = sc?.state

        if (rm) {
          words?.classList.add('ready')
          gsap.set(q('.miner'), { autoAlpha: 0 })
          gsap.set(q('.hero-eyebrow, .hero-sub, .scroll-hint'), { autoAlpha: 1, y: 0 })
          if (header) gsap.set(header, { autoAlpha: 1, y: 0 })
          if (sc && st) {
            Object.assign(st, { intro: 0, packets: 1 })
            sc.blocks.forEach((b) => Object.assign(b, { on: 1, scale: 1 }))
            sc.links.forEach((l) => (l.draw = 1))
          }
          release()
          return
        }

        tl.addLabel('suck', 0.35)
        if (st) {
          tl.to(st, { rush: 2.6, suck: 1, spread: 0.45, duration: 0.6, ease: EASE_IN_OUT }, 'suck')
        }
        tl.to(q('.miner'), { autoAlpha: 0, y: -14, duration: 0.5 }, 'suck')

        tl.addLabel('ignite', '>-0.05')
        if (sc && st) {
          const g = sc.blocks[0]
          tl.to(g, { on: 1, scale: 1, duration: 0.9 }, 'ignite')
            .set(st, { bloom: 2.6, rgb: 0.014, shake: 0.22, exposure: 1.6 }, 'ignite')
            .to(st, { bloom: 0.9, rgb: 0.0012, exposure: 1, duration: 1.6, ease: 'expo.out' }, 'ignite')
            .to(st, { shake: 0, duration: 0.9, ease: 'power2.out' }, 'ignite')
            .to(st, { rush: 0, duration: 1.4, ease: 'power2.out' }, 'ignite')
            .to(st, { suck: 0, spread: 1.25, duration: 2, ease: EASE_IN_OUT }, 'ignite')
            .call(() => sc.faceRingToCamera(), undefined, 'ignite')
            .fromTo(sc.ring.scale, { x: 0.5, y: 0.5, z: 0.5 }, { x: 10, y: 10, z: 10, duration: 1.6 }, 'ignite')
            .fromTo(sc.ring.material as unknown as { opacity: number }, { opacity: 0.95 }, { opacity: 0, duration: 1.6, ease: 'power2.out' }, 'ignite')
            // camera dollies back from the genesis block to the hero framing
            .to(st, { intro: 0, duration: 2.6, ease: EASE_IN_OUT }, 'ignite+=0.2')
          // the chain extends: link, then block, one after another
          sc.links.forEach((l, i) => {
            const at = `ignite+=${0.4 + i * 0.13}`
            tl.to(l, { draw: 1, duration: 0.34, ease: 'power2.out' }, at)
            tl.to(sc.blocks[i + 1], { on: 1, scale: 1, duration: 0.7 }, `${at}+=0.22`)
          })
          tl.to(st, { packets: 1, duration: 0.8, ease: 'power2.out' }, `ignite+=${0.4 + sc.links.length * 0.13}`)
        }

        // type: masked words rise, then the rest of the UI
        tl.addLabel('type', 'ignite+=0.9')
        if (words) {
          const split = new SplitText(words, { type: 'words', mask: 'words' })
          gsap.set(split.words, { yPercent: 110 })
          words.classList.add('ready')
          splits.push(split)
          tl.to(split.words, { yPercent: 0, duration: 1.15, stagger: 0.045 }, 'type')
          tl.call(() => split.revert(), undefined, '>+0.05')
        }
        tl.to(q('.hero-eyebrow, .hero-sub, .scroll-hint'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power4.out' }, 'type+=0.55')
        if (header) tl.to(header, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power4.out' }, 'type+=0.6')
        tl.call(() => startArcs(), undefined, 'type+=1.4')
      }

      // "current arc" label scrambles through the arcs while the hero is visible
      const startArcs = () => {
        const el = q('.arc-text')[0]
        if (!el || reduced) return
        let i = 0
        const next = () => {
          if (window.scrollY > window.innerHeight * 0.9 || document.hidden) return
          i = (i + 1) % ARCS.length
          gsap.to(el, { duration: 0.8, scrambleText: { text: ARCS[i].label, chars: '0123456789abcdef', speed: 0.6 } })
        }
        arcTimer = window.setInterval(next, 7000)
        ;(root.current as HTMLDivElement & { __nextArc?: () => void }).__nextArc = next
      }

      init().catch((err) => {
        console.error('[intro]', err)
        revealNow()
      })

      // The canvas is fixed behind the page, so it always "intersects" the viewport. Between the
      // chain and the outro the opaque .solid sections hide it completely; stop rendering there.
      // .solid fades in over its first 18vh, so it covers the viewport once its top is 18% above it.
      const solid = document.querySelector<HTMLElement>('.solid')
      const cover = solid
        ? ScrollTrigger.create({
            trigger: solid, start: 'top -18%', end: 'bottom bottom',
            // measured after the pinned chain section adds its spacer (created later, by ChainSection)
            refreshPriority: -1,
            onToggle: (self) => { bus.covered = self.isActive },
          })
        : null

      return () => {
        cover?.kill()
        bus.covered = false
        cancelled = true
        window.clearTimeout(watchdog)
        window.clearInterval(arcTimer)
        splits.forEach((sp) => sp.revert())
        scene?.dispose()
        bus.introPending = false
        bus.lenis?.start()
      }
    },
    { scope: root },
  )

  const nextArc = () => (root.current as (HTMLDivElement & { __nextArc?: () => void }) | null)?.__nextArc?.()

  return (
    <div ref={root} className="hero-wrap">
      <canvas ref={canvas} className="gl" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="miner" aria-live="polite">
        <div>
          <div className="m-row"><span>&gt; task</span><span>{t(UI.mining.task, lang)}</span></div>
          <div className="m-row"><span>target</span><span>00000…</span></div>
          <div className="m-row"><span>nonce</span><span className="m-nonce">0</span></div>
          <div className="m-row"><span>hash/s</span><span className="m-rate">—</span></div>
          <div className="m-row"><span>sha-256</span><span className="m-hash">—</span></div>
          <div className="m-bar"><i /></div>
          <div className="m-status blink">{t(UI.mining.searching, lang)}</div>
        </div>
      </div>

      <section className="hero" id="top">
        <div className="hero-eyebrow">{t(UI.heroEyebrow, lang)} · <b className="g-hash">mining…</b></div>
        <h1 className={`hero-title${t(SITE.tagline, lang).length > 52 ? ' long' : ''}`}>{t(SITE.tagline, lang)}</h1>
        <div className="hero-sub">
          <p className="hero-lede">{t(SITE.identity, lang)}</p>
          <div className="hero-row">
            <a className="cta p" href={href(lang, '/work/')}>{t(UI.viewWork, lang)}</a>
            {SITE.cv ? <a className="cta" href={SITE.cv[lang].url} download={SITE.cv[lang].file} hrefLang={lang}>{t(UI.cv, lang)}</a> : null}
            <button className="arc" type="button" onClick={nextArc} aria-label="Current arc. Click to switch.">
              <span className="dot" aria-hidden="true" />
              <span>{t(UI.currentArc, lang)}&nbsp;</span>
              <span className="arc-text">{ARCS[0].label}</span>
            </button>
          </div>
          <div className="soc">
            {SOCIALS.map((s) => (
              <a key={s.key} href={s.url} rel="me noopener" target="_blank"><span>{s.label}</span> {s.handle}</a>
            ))}
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true">{t(UI.scroll, lang)}<i /></div>
      </section>
    </div>
  )
}
