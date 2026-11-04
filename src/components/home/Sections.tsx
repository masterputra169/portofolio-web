import Link from 'next/link'
import type { Lang } from '@/content/types'
import { CERTIFICATES, EXPERIENCE, EXPERTISE } from '@/content/site'
import { UI, href, t } from '@/content/i18n'
import { RevealGroup, RevealText } from '../motion/Reveal'
import { Marquee } from './Marquee'
import { TiltCard } from './TiltCard'

export function Expertise({ lang }: { lang: Lang }) {
  return (
    <section className="section expertise" id="fields">
      <div className="sec-head">
        <span className="eyebrow">BLOCK #4</span>
        <RevealText className="sec-title">{t(UI.expertiseTitle, lang)}</RevealText>
      </div>
      <Marquee items={EXPERTISE.shipping} />
      <RevealGroup className="two-col">
        <div className="rv">
          <h3 className="col-title">{t(UI.shipping, lang)}</h3>
          <ul className="chips">
            {EXPERTISE.shipping.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div className="rv">
          <h3 className="col-title">{t(UI.obsessed, lang)}</h3>
          <ul className="obsessed">
            {EXPERTISE.obsessed.map((s) => <li key={s.en}>{t(s, lang)}</li>)}
          </ul>
        </div>
      </RevealGroup>
    </section>
  )
}

export function Experience({ lang }: { lang: Lang }) {
  return (
    <section className="section experience" id="experience">
      <div className="sec-head">
        <span className="eyebrow">BLOCK #5</span>
        <RevealText className="sec-title">{t(UI.experienceTitle, lang)}</RevealText>
      </div>
      <RevealGroup as="ol" className="xp-list">
        {EXPERIENCE.map((x) => (
          <li key={x.org} className="rv">
            <span className="xp-period">{t(x.period, lang)}</span>
            <div>
              <h3>{x.org}</h3>
              <p className="xp-role">{t(x.role, lang)}</p>
              <p className="xp-note">{t(x.note, lang)}</p>
            </div>
          </li>
        ))}
      </RevealGroup>
    </section>
  )
}

export function Certificates({ lang, all = false }: { lang: Lang; all?: boolean }) {
  return (
    <section className="section certs" id="certificates">
      {!all ? (
        <div className="sec-head">
          <span className="eyebrow">BLOCK #6</span>
          <RevealText className="sec-title">{t(UI.certsTitle, lang)}</RevealText>
        </div>
      ) : null}
      <RevealGroup className="cert-grid">
        {CERTIFICATES.map((c) => (
          <TiltCard key={c.slug} className="rv cert">
            <img src={`/certificates/${c.slug}.webp`} alt={`${c.title} — ${c.issuer}`} loading="lazy" width={900} height={640} />
            <div className="cert-body">
              <span className="cert-date">{t(c.date, lang)}</span>
              {all ? <h2>{c.title}</h2> : <h3>{c.title}</h3>}
              <p className="cert-issuer">{c.issuer}</p>
              <p className="cert-topics">{t(c.topics, lang)}</p>
              <div className="cert-links">
                <a href={`/certificates/${c.slug}.pdf`} target="_blank" rel="noopener">{t(UI.viewPdf, lang)} ↗</a>
                {c.verify ? <a href={c.verify} target="_blank" rel="noopener">{t(UI.verify, lang)} ↗</a> : null}
              </div>
            </div>
          </TiltCard>
        ))}
      </RevealGroup>
      {!all ? <Link className="more" href={href(lang, '/certificates/')}>{t(UI.allCerts, lang)} →</Link> : null}
    </section>
  )
}
