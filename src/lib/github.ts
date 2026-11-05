import { CURATED } from '@/content/projects'
import { SITE } from '@/content/site'
import type { Category, Project } from '@/content/types'
import { renderReadme } from './markdown'

type Repo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  fork: boolean
  archived: boolean
  private: boolean
  stargazers_count: number
  language: string | null
  topics?: string[]
  pushed_at: string
  default_branch: string
}

const API = 'https://api.github.com'
const headers = (accept = 'application/vnd.github+json'): HeadersInit => {
  const h: Record<string, string> = { Accept: accept, 'User-Agent': 'masterputra-tech-build', 'X-GitHub-Api-Version': '2022-11-28' }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: headers(), cache: 'force-cache' })
    if (!res.ok) {
      // Visible in the build log: a missing/expired GITHUB_TOKEN shows up as 401 or 403 here.
      console.warn(`[github] ${res.status} ${res.statusText} for ${url} (rate limit remaining: ${res.headers.get('x-ratelimit-remaining') ?? '?'})`)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    console.warn(`[github] request failed for ${url}: ${(e as Error).message}`)
    return null
  }
}

async function getRaw(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: headers('application/vnd.github.raw+json'), cache: 'force-cache' })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

const CATEGORY_TOPICS: Category[] = ['web3', 'ml', 'fullstack', 'tools']
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function categoriesFrom(topics: string[]): Category[] {
  const c = CATEGORY_TOPICS.filter((k) => topics.includes(k))
  return c.length ? c : ['other']
}

let cache: Promise<Project[]> | null = null

/** All projects: curated case studies merged with every public repo on GitHub. */
export function getProjects(): Promise<Project[]> {
  if (!cache) cache = load()
  return cache
}

async function load(): Promise<Project[]> {
  const user = SITE.githubUser
  const repos = (await getJson<Repo[]>(`${API}/users/${user}/repos?per_page=100&type=owner&sort=pushed`)) ?? []
  const visible = repos.filter((r) => !r.private && !(r.topics ?? []).includes('portfolio-hide') && r.name.toLowerCase() !== `${user}.github.io`)
  const byName = new Map(visible.map((r) => [r.name.toLowerCase(), r]))
  console.log(`[github] token: ${process.env.GITHUB_TOKEN ? 'set' : 'NOT set'} · ${visible.length} public repos listed`)

  const readmeFor = async (repo: Repo) => {
    const [en, id] = await Promise.all([
      getRaw(`${API}/repos/${repo.full_name}/readme`),
      getRaw(`${API}/repos/${repo.full_name}/contents/README.id.md`),
    ])
    if (!en && !id) return undefined
    const base = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/`
    const enHtml = en ? renderReadme(en, base, repo.html_url) : ''
    const idHtml = id ? renderReadme(id, base, repo.html_url) : enHtml
    return { en: enHtml || idHtml, id: idHtml }
  }

  const featured: Project[] = await Promise.all(
    CURATED.map(async (c) => {
      const repo = byName.get((c.repo ?? c.slug).toLowerCase())
      return {
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        categories: c.categories,
        journeys: c.journeys,
        stats: c.stats,
        stack: c.stack,
        featured: true,
        fork: false,
        repoUrl: repo?.html_url ?? (c.repo ? `https://github.com/${user}/${c.repo}` : undefined),
        homepage: c.homepage ?? repo?.homepage ?? undefined,
        stars: repo?.stargazers_count ?? 0,
        language: repo?.language ?? undefined,
        pushedAt: repo?.pushed_at,
        team: c.team,
        gallery: c.gallery,
        caseStudy: c.caseStudy,
        readme: repo ? await readmeFor(repo) : undefined,
      }
    }),
  )

  const curatedRepos = new Set(CURATED.map((c) => (c.repo ?? c.slug).toLowerCase()))
  const usedSlugs = new Set(CURATED.map((c) => c.slug))
  const rest: Project[] = await Promise.all(
    visible
      .filter((r) => !curatedRepos.has(r.name.toLowerCase()))
      .map(async (r) => {
        let slug = slugify(r.name) || 'repo'
        while (usedSlugs.has(slug)) slug += '-repo'
        usedSlugs.add(slug)
        const topics = r.topics ?? []
        const desc = r.description ?? ''
        return {
          slug,
          title: r.name,
          summary: { en: desc, id: desc },
          categories: categoriesFrom(topics),
          journeys: [],
          stats: [],
          stack: [r.language, ...topics.filter((t) => !CATEGORY_TOPICS.includes(t as Category) && !t.startsWith('portfolio'))].filter(Boolean) as string[],
          featured: topics.includes('portfolio-featured'),
          fork: r.fork,
          repoUrl: r.html_url,
          homepage: r.homepage || undefined,
          stars: r.stargazers_count,
          language: r.language ?? undefined,
          pushedAt: r.pushed_at,
          readme: r.fork ? undefined : await readmeFor(r),
        }
      }),
  )

  return [...featured, ...rest]
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug)
}
