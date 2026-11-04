# masterputra.tech

Portfolio of **Timotius Kusuma Wardana Putra** (masterputra) — Web3 developer from Kediri, Indonesia.

Static Next.js site: every page is exported to plain HTML at build time.

## What's inside

- **Genesis intro** — the visitor's browser mines a real SHA-256 block (target `0000…`) before the page opens. Every visitor gets a different genesis hash, which is then shown in the hero and footer.
- **three.js scene** (`src/scene/genesis.ts`) — three GPU particle streams (crypto / developer / AI) braid into a chain of blocks. Blocks carry their real chained hashes on their faces and open up to reveal a glowing core as you scroll past their project. Bloom, RGB shift and particle turbulence react to scroll velocity.
- **GSAP** — a single intro timeline, a pinned ScrollTrigger narrative through the featured projects, SplitText headline reveals, DrawSVG journey lanes, a velocity-skewed stack marquee, and Flip-animated filters on `/work`. Smooth scrolling with Lenis.
- **Terminal** — press `` ` `` (or the `>_ terminal` button). Try `help`, `whoami`, `ls`, `cat sapux`, `mine`.
- **English by default, Indonesian under `/id/`.**
- **SEO & GEO** — canonical + hreflang, JSON-LD (Person, WebSite, ProfilePage, FAQPage, SoftwareSourceCode), `sitemap.xml`, `robots.txt` that welcomes every crawler including AI assistants, and `llms.txt`.

## Content

| What | Where |
| --- | --- |
| Name, tagline, socials, current arcs, expertise, experience, certificates, FAQ | `src/content/site.ts` |
| Journeys (crypto / developer / AI explorer) | `src/content/journeys.ts` |
| Featured case studies | `src/content/projects.ts` |
| UI strings (EN / ID) | `src/content/i18n.ts` |

### Projects come from GitHub

Every **public repo** on `github.com/masterputra169` shows up on `/work` automatically at build time (forks are labelled). Repos with a README get their own page; the README is rendered as part of the case study.

| Repo topic | Effect |
| --- | --- |
| `portfolio-featured` | listed as featured |
| `web3`, `ml`, `fullstack`, `tools` | category filter (no topic → "Other") |
| `portfolio-hide` | hidden from the site |

Optional `README.id.md` in a repo is used for the Indonesian page. A GitHub Action rebuilds the site every Monday so new repos appear on their own.

### To do before launch

- Add `public/cv.pdf` and set `SITE.cvUrl = '/cv.pdf'` in `src/content/site.ts`.
- Set `SITE.email` once email routing for the domain works.
- Fill in milestone years in `src/content/journeys.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

Set `GITHUB_TOKEN` when building locally to avoid GitHub's unauthenticated rate limit.

## Deploy

Any static host works. On Cloudflare Pages: build command `npm run build`, output directory `out`, environment variable `GITHUB_TOKEN` (a fine-grained token with public-repo read access), then point `masterputra.tech` at the project.
