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

  const pick = contextSafe((c: Category | 'all') => {
    flipState.current = Flip.getState(gsap.utils.toArray('.wcard', root.current))
    setFilter(c)
  })

  useGSAP(
    () => {
      if (!flipState.current) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      Flip.from(flipState.current, {
        duration: reduce ? 0 : 0.7,
        ease: 'power3.inOut',
        absolute: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: 'power2.in' }),
      })
      flipState.current = null
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
        {withCase.filter(shown).map((p, i) => (
          <Link key={p.slug} href={href(lang, `/work/${p.slug}/`)} className={`wcard${p.featured ? ' featured' : ''}`} data-flip-id={p.slug}>
            <span className="w-tx">block #{i + 1}{p.fork ? ` · ${t(UI.fork, lang)}` : ''}{p.stars ? ` · ★ ${p.stars}` : ''}</span>
            <span className="w-cat">{p.categories.map((c) => t(UI.categories[c], lang)).join(' · ')}</span>
            <h2>{p.title}</h2>
            {t(p.summary, lang) ? <p>{t(p.summary, lang)}</p> : null}
            <span className="w-stack">{p.stack.slice(0, 4).join(' · ')}</span>
          </Link>
        ))}
      </div>
      {archive.filter(shown).length ? (
        <>
          <h2 className="archive-title">{t(UI.archive, lang)}</h2>
          <ul className="archive">
            {archive.filter(shown).map((p) => (
              <li key={p.slug} className="wcard arow" data-flip-id={p.slug}>
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
