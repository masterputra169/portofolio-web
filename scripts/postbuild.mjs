// The site has one root layout, so every exported page starts as <html lang="en">.
// Pages under /id/ are Indonesian: rewrite the attribute so crawlers and screen readers get it right.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('../out/id/', import.meta.url).pathname

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* htmlFiles(p)
    else if (e.name.endsWith('.html')) yield p
  }
}

let n = 0
for await (const file of htmlFiles(root)) {
  const html = await readFile(file, 'utf8')
  const next = html.replace('<html lang="en"', '<html lang="id"')
  if (next === html) throw new Error(`postbuild: no <html lang="en"> in ${file}`)
  await writeFile(file, next)
  n++
}
console.log(`postbuild: set lang="id" on ${n} pages under /id/`)
