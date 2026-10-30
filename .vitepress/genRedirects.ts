import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import type { SiteConfig } from 'vitepress'

// The trees whose docs/redirects.txt applies, with every URL prefix that served them. Pinned versions keep the
// paths they shipped with. Keep the old /docs/version/wanaku-main/ prefix in sync with public/.htaccess.
const trees: Record<string, string[]> = {
  latest: ['/docs/latest/'],
  next: ['/docs/next/', '/docs/version/wanaku-main/docs/'],
}

// Turns each "old new" line into a 301 from every prefix of the tree to the final page, so that an old URL reaches it
// in one hop. The rules go above the prefix rules of public/.htaccess, because the first matching rule wins.
// A trailing slash marks a section index page. Any line that would publish a broken redirect fails the build.
export function genRedirects(config: SiteConfig) {
  const rules: string[] = []

  for (const [tree, prefixes] of Object.entries(trees)) {
    const dir = path.join(config.srcDir, 'docs', tree)
    if (!existsSync(dir)) continue

    const file = path.join(dir, 'redirects.txt')
    const moves = new Map<string, string>()
    readFileSync(file, 'utf-8').split('\n').forEach((line, i) => {
      const fields = line.trim().split(/\s+/)
      if (!fields[0] || fields[0].startsWith('#')) return
      if (fields.length !== 2 || !fields.every((field) => /^[\w-]+(\/[\w-]+)*\/?$/.test(field))) {
        throw new Error(`${file}:${i + 1}: expected "old new" with relative page paths, got "${line}"`)
      }
      moves.set(fields[0], fields[1])
    })

    const published = (page: string) =>
      existsSync(path.join(config.outDir, 'docs', tree, page.endsWith('/') ? `${page}index.html` : `${page}.html`))

    rules.push(`# Generated from docs/${tree}/redirects.txt`)
    for (const from of moves.keys()) {
      let to = from
      const seen = new Set<string>()
      while (moves.has(to)) {
        if (seen.has(to)) throw new Error(`${file}: redirect loop through "${to}"`)
        seen.add(to)
        to = moves.get(to)!
      }
      if (published(from)) throw new Error(`${file}: "${from}" is a published page, the redirect would hide it`)
      if (!published(to)) throw new Error(`${file}: "${from}" leads to "${to}", which is not a published page`)

      const source = from.endsWith('/') ? `${from.slice(0, -1)}(?:/|/index\\.html)?` : `${from}\\.html`
      const target = to.endsWith('/') ? to : `${to}.html`
      for (const prefix of prefixes) {
        rules.push(`RedirectMatch 301 ^${prefix}${source}$ /docs/${tree}/${target}`)
      }
    }
    rules.push('')
  }

  const htaccess = path.join(config.outDir, '.htaccess')
  writeFileSync(htaccess, [...rules, readFileSync(htaccess, 'utf-8')].join('\n'))
}
