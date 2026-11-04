import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Lang, Project } from '@/content/types'
import { FAQ, SITE, SOCIALS } from '@/content/site'
import { UI, href, t } from '@/content/i18n'
import { getProjects } from '@/lib/github'
import { JsonLd, faqJsonLd, profilePageJsonLd, projectJsonLd } from '@/lib/seo'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HtmlLang } from '@/components/HtmlLang'
import { HeroGenesis } from '@/components/home/HeroGenesis'
import { ChainSection } from '@/components/home/ChainSection'
import { Journeys } from '@/components/home/Journeys'
import { Certificates, Experience, Expertise } from '@/components/home/Sections'
import { Outro } from '@/components/home/Outro'
import { RevealGroup, RevealText } from '@/components/motion/Reveal'
import { WorkGrid } from '@/components/work/WorkGrid'

function Page({ lang, children, home = false }: { lang: Lang; children: ReactNode; home?: boolean }) {
  return (
    <div lang={lang} className={home ? 'page page-home' : 'page'}>
      <HtmlLang lang={lang} />
      <a className="skip" href="#main">{lang === 'en' ? 'Skip to content' : 'Langsung ke konten'}</a>
      <Header lang={lang} hidden={home} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
    </div>
  )
}

export async function HomeView({ lang }: { lang: Lang }) {
  const projects = await getProjects()
  return (
    <Page lang={lang} home>
      <HeroGenesis lang={lang} />
      <ChainSection lang={lang} projects={projects.filter((p) => p.caseStudy)} />
      <div className="solid">
        <Journeys lang={lang} />
        <Expertise lang={lang} />
        <Experience lang={lang} />
        <Certificates lang={lang} />
      </div>
      <Outro lang={lang} />
    </Page>
  )
}

export async function WorkView({ lang }: { lang: Lang }) {
  const projects = await getProjects()
  return (
    <Page lang={lang}>
      <section className="section page-head">
        <span className="eyebrow">/work</span>
        <RevealText as="h1" className="page-title">{t(UI.workTitle, lang)}</RevealText>
        <p className="sec-lead">{t(UI.workLead, lang)}</p>
      </section>
      <WorkGrid lang={lang} projects={projects} />
    </Page>
  )
}

export async function CaseStudyView({ lang, slug }: { lang: Lang; slug: string }) {
  const projects = await getProjects()
  const idx = projects.findIndex((p) => p.slug === slug)
  const p = projects[idx] as Project
  const next = projects[(idx + 1) % projects.length]
  const cs = p.caseStudy
  const sections = cs
    ? ([['overview', cs.overview], ['problem', cs.problem], ['approach', cs.approach], ['broke', cs.broke], ['results', cs.results]] as const)
    : []
  return (
    <Page lang={lang}>
      <JsonLd data={projectJsonLd(p, lang)} />
      <article className="case">
        <header className="section case-head">
          <span className="eyebrow">block #{idx + 1} · {p.categories.map((c) => t(UI.categories[c], lang)).join(' · ')}{p.fork ? ` · ${t(UI.fork, lang)}` : ''}</span>
          <RevealText as="h1" className="page-title">{p.title}</RevealText>
          {t(p.summary, lang) ? <p className="sec-lead">{t(p.summary, lang)}</p> : null}
          {p.team ? <p className="case-team">{t(p.team, lang)}</p> : null}
          <div className="case-links">
            {p.repoUrl ? <a className="cta" href={p.repoUrl} target="_blank" rel="noopener">{t(UI.onGithub, lang)} ↗</a> : null}
            {p.homepage ? <a className="cta" href={p.homepage} target="_blank" rel="noopener">{t(UI.liveSite, lang)} ↗</a> : null}
          </div>
          {p.stats.length ? (
            <div className="stats big">
              {p.stats.map((s) => <div key={s.value + s.label.en}><b>{s.value}</b><span>{t(s.label, lang)}</span></div>)}
            </div>
          ) : null}
          {p.stack.length ? <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul> : null}
        </header>
        {sections.length ? (
          <RevealGroup className="section case-body">
            {sections.map(([k, v]) => (
              <section key={k} className="rv case-sec">
                <h2>{t(UI[k], lang)}</h2>
                <p>{t(v, lang)}</p>
              </section>
            ))}
          </RevealGroup>
        ) : null}
        {p.readme ? (
          <section className="section readme">
            <h2 className="readme-title">{t(UI.fromReadme, lang)}</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: t(p.readme, lang) }} />
          </section>
        ) : null}
        {next && next.slug !== p.slug ? (
          <Link className="next-block" href={href(lang, `/work/${next.slug}/`)}>
            <span>{t(UI.next, lang)} →</span>
            <b>{next.title}</b>
          </Link>
        ) : null}
      </article>
    </Page>
  )
}

export function AboutView({ lang }: { lang: Lang }) {
  return (
    <Page lang={lang}>
      <JsonLd data={profilePageJsonLd(lang)} />
      <JsonLd data={faqJsonLd(lang)} />
      <section className="section about">
        <div className="about-text">
          <span className="eyebrow">/about</span>
          <RevealText as="h1" className="page-title">{SITE.name}</RevealText>
          <p className="about-lead">{t(SITE.identity, lang)}</p>
          <p>{lang === 'en'
            ? 'I came to code through markets. Four years of trading, airdrop hunting and alpha hunting taught me risk, patience and how protocols feel from the user’s side. Now I build the tools I wished I had: bots that know when to stop, payment rails for freelancers like me, and models I can explain.'
            : 'Saya sampai ke dunia coding lewat pasar. Empat tahun trading, berburu airdrop, dan berburu alpha mengajari saya soal risiko, kesabaran, dan rasanya memakai protokol dari sisi user. Sekarang saya membangun tools yang dulu saya cari: bot yang tahu kapan berhenti, jalur pembayaran untuk freelancer seperti saya, dan model yang bisa saya jelaskan.'}</p>
          <ul className="soc-list">
            {SOCIALS.map((s) => <li key={s.key}><a href={s.url} target="_blank" rel="me noopener"><span>{s.label}</span>{s.handle} ↗</a></li>)}
          </ul>
        </div>
        <figure className="about-photo">
          <picture>
            <source srcSet={SITE.photo} type="image/webp" />
            <img src={SITE.photoJpg} alt={SITE.name} width={1200} height={1226} loading="eager" />
          </picture>
          <figcaption>{lang === 'en' ? 'Timotius in East Java.' : 'Timotius di Jawa Timur.'}</figcaption>
        </figure>
      </section>
      <section className="section faq">
        <RevealText className="sec-title">{t(UI.faqTitle, lang)}</RevealText>
        <RevealGroup as="dl" className="faq-list">
          {FAQ.map((f) => (
            <div key={f.q.en} className="rv">
              <dt>{t(f.q, lang)}</dt>
              <dd>{t(f.a, lang)}</dd>
            </div>
          ))}
        </RevealGroup>
      </section>
    </Page>
  )
}

export function JourneyView({ lang }: { lang: Lang }) {
  return (
    <Page lang={lang}>
      <section className="section page-head">
        <span className="eyebrow">/journey</span>
        <RevealText as="h1" className="page-title">{t(UI.journeysTitle, lang)}</RevealText>
        <p className="sec-lead">{t(UI.journeysLead, lang)}</p>
      </section>
      <Journeys lang={lang} showTitle={false} />
    </Page>
  )
}

export function CertificatesView({ lang }: { lang: Lang }) {
  return (
    <Page lang={lang}>
      <section className="section page-head">
        <span className="eyebrow">/certificates</span>
        <RevealText as="h1" className="page-title">{t(UI.certsTitle, lang)}</RevealText>
      </section>
      <Certificates lang={lang} all />
    </Page>
  )
}
