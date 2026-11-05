'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ARCS, CERTIFICATES, SOCIALS, SITE } from '@/content/site'
import { CURATED } from '@/content/projects'
import { mine, shortHash } from '@/lib/pow'
import { bus } from '@/scene/bus'

const EVT = 'mp:terminal'
export const openTerminal = () => window.dispatchEvent(new CustomEvent(EVT))

type Line = { id: number; html: string }
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string)

const HELP = `<span class="m">available commands</span>
  whoami      who is this
  ls          list featured projects
  cat &lt;name&gt;  show a project   (e.g. cat sapux)
  journey     three chains, one builder
  arc         the current arc
  socials     where to find me
  certs       certificates
  mine        mine a fresh block, right now, in your browser
  gpu         how the 3D scene is rendering on this device
  intro       how the genesis intro went on this visit
  clear       clear screen
  exit        close terminal`

export function Terminal() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const hist = useRef<string[]>([])
  const hi = useRef(0)
  const idRef = useRef(0)
  const input = useRef<HTMLInputElement>(null)
  const out = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<Element | null>(null)
  const openRef = useRef(false)
  useEffect(() => { openRef.current = open }, [open])

  const print = useCallback((html: string) => setLines((ls) => [...ls, { id: ++idRef.current, html }]), [])

  const show = useCallback(() => {
    lastFocus.current = document.activeElement
    setOpen(true)
    setLines((ls) => (ls.length ? ls : [{ id: ++idRef.current, html: `<span class="m">masterputra.tech shell · genesis ${bus.genesisHash ? shortHash(bus.genesisHash) : 'pending'}</span>\ntype <span class="c">help</span> to start.` }]))
    setTimeout(() => input.current?.focus(), 60)
  }, [])
  const hide = useCallback(() => {
    setOpen(false)
    const el = lastFocus.current as HTMLElement | null
    el?.focus?.()
  }, [])

  useEffect(() => {
    const onOpen = () => show()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.target === input.current) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '`' || e.key === '~') {
        e.preventDefault()
        if (openRef.current) hide()
        else show()
      }
    }
    window.addEventListener(EVT, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(EVT, onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [show, hide])

  useEffect(() => {
    out.current?.scrollTo({ top: out.current.scrollHeight })
  }, [lines])

  const run = async (raw: string) => {
    const [cmd = '', ...args] = raw.trim().split(/\s+/)
    print(`<span class="c">guest@mp:~$</span> ${esc(raw)}`)
    const c = cmd.toLowerCase()
    if (!c) return
    switch (c) {
      case 'help': return print(HELP)
      case 'whoami': return print(`${SITE.name} <span class="m">(${SITE.alias})</span>\nWeb3 developer · Informatics @ UDINUS Kediri · ~4 years in crypto\ntrader → airdrop hunter → alpha hunter → <span class="c">builder</span>\n<span class="m">now:</span> ${esc(SITE.status.en)}`)
      case 'ls': return print(CURATED.map((p) => `<span class="c">${p.slug}</span>`).join('   ') + `\n<span class="m">…plus every public repo on github.com/${SITE.githubUser}</span>`)
      case 'cat': {
        const q = (args[0] ?? '').toLowerCase()
        const p = CURATED.find((x) => x.slug === q || x.title.toLowerCase() === q || x.repo?.toLowerCase() === q)
        return print(p ? `<span class="c">${esc(p.title)}</span>\n${esc(p.summary.en)}\n<span class="m">${p.stack.join(' · ')}</span>` : `cat: ${esc(args[0] ?? '')}: no such project — try <span class="c">ls</span>`)
      }
      case 'journey':
        return print(`<span class="y">crypto     </span> trader ─ airdrop ─ alpha ─────┐\n<span class="b">developer  </span> informatics ─ infra ─ bots ─┼──▶ <span class="c">builder</span>\n<span class="g">ai explorer</span> ml ─ vision ─ production ───┘`)
      case 'arc': return print(ARCS.map((a) => `<span class="c">${a.label}</span>  ${esc(a.meaning.en)}`).join('\n'))
      case 'socials': return print([
        ...(SITE.email ? [`${'Email'.padEnd(10)}<a href="mailto:${SITE.email}">${SITE.email}</a>`] : []),
        ...SOCIALS.map((s) => `${s.label.padEnd(10)}<a href="${s.url}">${s.handle}</a>`),
      ].join('\n'))
      case 'certs': return print(CERTIFICATES.map((x) => `${esc(x.title)} <span class="m">· ${esc(x.issuer)} · ${x.date.en}</span>`).join('\n'))
      case 'mine': {
        print('<span class="m">mining… target 0000</span>')
        const prev = bus.genesisHash || '0'.repeat(64)
        const r = await mine(`${prev}|guest|${Date.now()}`, { budgetMs: 3500 })
        const z = r.hash.match(/^0*/)?.[0].length ?? 0
        return print(`block found · nonce ${r.nonce.toLocaleString('en-US')} · ${(r.ms / 1000).toFixed(2)}s\nprev  ${shortHash(prev)}\nhash  <span class="c">${r.hash.slice(0, z)}</span>${r.hash.slice(z)}\n<span class="m">real SHA-256 work, done by your machine.</span>`)
      }
      case 'gpu': return print(`3d scene  ${esc(bus.gl)}\n<span class="m">full = GPU · lite = no hardware acceleration (fewer particles, no glow) · off = static background</span>`)
      case 'intro': {
        const fallback = document.documentElement.hasAttribute('data-js-fallback')
        return print([
          `intro     ${esc(bus.intro)}`,
          bus.introInfo ? `timing    ${esc(bus.introInfo)}` : '',
          `3d scene  ${esc(bus.gl)}`,
          fallback ? 'note      the scripts took over 15 s to load, so the page showed its static layout first' : '',
          `<span class="m">open the home page, wait for the intro, then type intro</span>`,
        ].filter(Boolean).join('\n'))
      }
      case 'clear': return setLines([])
      case 'exit': return hide()
      default: return print(`command not found: ${esc(cmd)} — try <span class="c">help</span>`)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = value
    if (v.trim()) {
      hist.current.push(v)
      hi.current = hist.current.length
    }
    setValue('')
    void run(v)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') { hi.current = Math.max(0, hi.current - 1); setValue(hist.current[hi.current] ?? ''); e.preventDefault() }
    if (e.key === 'ArrowDown') { hi.current = Math.min(hist.current.length, hi.current + 1); setValue(hist.current[hi.current] ?? ''); e.preventDefault() }
    if (e.key === 'Escape') hide()
  }

  return (
    <div className={`term${open ? ' open' : ''}`} role="dialog" aria-label="Terminal" aria-hidden={!open}>
      <div className="term-bar">
        <span>guest@masterputra.tech — type <b>help</b></span>
        <button type="button" onClick={hide} aria-label="Close terminal" tabIndex={open ? 0 : -1}>esc ✕</button>
      </div>
      <div className="term-out" ref={out}>
        {lines.map((l) => <div key={l.id} dangerouslySetInnerHTML={{ __html: l.html }} />)}
      </div>
      <form className="term-form" onSubmit={onSubmit} autoComplete="off">
        <label htmlFor="term-in">guest@mp:~$</label>
        <input id="term-in" ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} spellCheck={false} tabIndex={open ? 0 : -1} />
      </form>
    </div>
  )
}
