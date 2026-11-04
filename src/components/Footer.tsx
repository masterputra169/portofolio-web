'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/content/types'
import { UI, t } from '@/content/i18n'
import { SITE } from '@/content/site'
import { bus } from '@/scene/bus'
import { shortHash } from '@/lib/pow'

export function Footer({ lang }: { lang: Lang }) {
  const [mined, setMined] = useState<{ hash: string; ms: number } | null>(null)
  useEffect(() => {
    const off = bus.onMined(() => setMined({ hash: bus.genesisHash, ms: bus.genesisMs }))
    return () => {
      off()
    }
  }, [])
  const sha = process.env.NEXT_PUBLIC_BUILD_SHA ?? 'local'
  const date = process.env.NEXT_PUBLIC_BUILD_DATE ?? ''
  return (
    <footer className="site-footer">
      {mined ? (
        <span>
          {t(UI.latestBlock, lang)} · <b>{shortHash(mined.hash)}</b> · {t(UI.minedIn, lang)} <b>{(mined.ms / 1000).toFixed(2)}s</b>
        </span>
      ) : (
        <span>© {date.slice(0, 4) || new Date().getFullYear()} {SITE.name}</span>
      )}
      <span>
        {t(UI.built, lang)} <b>{sha}</b> · {date} · {t(SITE.location, lang)}
      </span>
    </footer>
  )
}
