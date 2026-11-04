export type Lang = 'en' | 'id'
export type L10n = Record<Lang, string>

export type Category = 'web3' | 'ml' | 'fullstack' | 'tools' | 'research' | 'other'

export type Stat = { value: string; label: L10n }

export type CaseStudy = {
  overview: L10n
  problem: L10n
  approach: L10n
  broke: L10n
  results: L10n
}

export type CuratedProject = {
  slug: string
  /** GitHub repo name under masterputra169, when the project has a public repo */
  repo?: string
  title: string
  categories: Category[]
  journeys: Array<'crypto' | 'dev' | 'ai'>
  summary: L10n
  stats: Stat[]
  stack: string[]
  homepage?: string
  team?: L10n
  caseStudy: CaseStudy
}

export type Project = {
  slug: string
  title: string
  summary: L10n
  categories: Category[]
  journeys: Array<'crypto' | 'dev' | 'ai'>
  stats: Stat[]
  stack: string[]
  featured: boolean
  fork: boolean
  repoUrl?: string
  homepage?: string
  stars: number
  language?: string
  pushedAt?: string
  team?: L10n
  caseStudy?: CaseStudy
  readme?: L10n
}
