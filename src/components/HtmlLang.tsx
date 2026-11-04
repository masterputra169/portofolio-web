'use client'

import { useEffect } from 'react'
import type { Lang } from '@/content/types'

/**
 * Keeps <html lang> in step with the page after client-side navigation between
 * /… and /id/…. The exported HTML already carries the right value (scripts/postbuild.mjs).
 */
export function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return null
}
