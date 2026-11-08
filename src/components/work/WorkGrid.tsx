'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import type { Category, Lang, Project } from '@/content/types'
import { UI, href, t } from '@/content/i18n'

gsap.registerPlugin(useGSAP, Flip)

const ORDER: Category[] = ['web3', 'ml', 'fullstack', 'tools', 'research', 'other']
/** everything that moves when the filter changes; the archive heading too, or it jumps while the rows glide */
const FLIP_TARGETS = '.wcard, .archive-title'

/** Filterable project grid; filtering animates with GSAP Flip so cards glide to their new places. */
export function WorkGrid({ lang, projects }: { lang: Lang; projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)

  const cats = useMemo(() => ORDER.filter((c) => projects.some((p) => p.categories.includes(c))), [projects])
  const withCase = projects.filter((p) => p.caseStudy || p.readme)
  const archive = projects.filter((p) => !p.caseStudy && !p.readme)
  const shown = (p: Project) => filter === 'all' || p.categories.includes(filter)

  const { contextSafe } = useGSAP({ scope: root })

  // Every card stays in the DOM; filtered-out cards get `hidden` (display: none). That is what lets Flip
  // fade leaving cards out and entering cards in, instead of React removing or adding them mid-animation.
  const pick = contextSafe((c: Category | 'all') => {
    if (c === filter) return
    // recorded mid-flight too, so a click during an animation continues from where the cards are
    flipState.current = Flip.getState(gsap.utils.toArray(FLIP_TARGETS, root.current))
    setFilter(c)
  })

  useGSAP(
    () => {
      const state = flipState.current
      if (!state) return
      flipState.current = null
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      Flip.from(state, {
        targets: gsap.utils.toArray(FLIP_TARGETS, root.current),
        duration: reduce ? 0 : 0.6,
        ease: 'power3.inOut',
        // in-flow (not absolute): the grid keeps its height while cards move, so the page does not jump
        scale: false,
        nested: true,
        prune: true,
        // leaving cards are lifted out of the grid while they fade, so the rest can move into their place
        absoluteOnLeave: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.3, ease: 'power3.out' }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: reduce ? 0 : 0.25, ease: 'power2.in' }),
      })
    },
    { scope: root, dependencies: [filter] },
  )

  return (
    <div ref={root} className="section work">
      <div className="filters" role="group" aria-label="Filter">
        <button type="button" aria-pressed={filter === 'all'} onClick={() => pick('all')}>{t(UI.filterAll, lang)}</button>
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={filter === c} onClick={() => pick(c)}>{t(UI.categories[c], lang)}</button>
        ))}
      </div>
      <div className="wgrid">
        {withCase.map((p, i) => (
          <Link key={p.slug} href={href(lang, `/work/${p.slug}/`)} className={`wcard${p.caseStudy ? ' case' : ''}`} data-flip-id={p.slug} hidden={!shown(p)}>
            <span className="w-tx">block #{i + 1}{p.caseStudy ? ` · ${t(UI.caseLabel, lang)}` : ''}{p.fork ? ` · ${t(UI.fork, lang)}` : ''}{p.stars ? ` · ★ ${p.stars}` : ''}</span>
            <span className="w-cat">{p.categories.map((c) => t(UI.categories[c], lang)).join(' · ')}</span>
            <h2>{p.title}</h2>
            {t(p.summary, lang) ? <p>{t(p.summary, lang)}</p> : null}
            {p.caseStudy && p.stats.length ? (
              <span className="w-stats">
                {p.stats.slice(0, 3).map((s) => (
                  <span key={s.value}><b>{s.value}</b>{t(s.label, lang)}</span>
                ))}
              </span>
            ) : null}
            <span className="w-stack">{p.stack.slice(0, 4).join(' · ')}</span>
          </Link>
        ))}
      </div>
      {archive.length ? (
        <>
          <h2 className="archive-title" data-flip-id="archive-title" hidden={!archive.some(shown)}>{t(UI.archive, lang)}</h2>
          <ul className="archive">
            {archive.map((p) => (
              <li key={p.slug} className="wcard arow" data-flip-id={p.slug} hidden={!shown(p)}>
                <a href={p.repoUrl} target="_blank" rel="noopener"><b>{p.title}</b>{p.fork ? <em>{t(UI.fork, lang)}</em> : null}</a>
                <span>{t(p.summary, lang)}</span>
                <span className="a-meta">{p.language ?? ''}{p.pushedAt ? ` · ${p.pushedAt.slice(0, 10)}` : ''}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}
