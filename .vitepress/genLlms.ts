import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import type { SiteConfig } from 'vitepress'

interface NavItem {
  text: string
  link: string
  items?: NavItem[]
}

// Reads the description from the frontmatter of a docs/next page. A page link that ends with a slash is a section index.
function description(dir: string, link: string): string {
  const file = path.join(dir, link.endsWith('/') ? `${link}index.md` : `${link}.md`)
  const frontmatter = readFileSync(file, 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const value = frontmatter.match(/^description:\s*(.*)$/m)?.[1] ?? ''
  return value.replace(/^"(.*)"$/, '$1')
}

// Appends one link line for each page of the docs/next/nav.json sidebar to the llms.txt that public/ provides.
export function genLlms(config: SiteConfig) {
  const dir = path.join(config.srcDir, 'docs', 'next')
  const navFile = path.join(dir, 'nav.json')
  if (!existsSync(navFile)) return

  const lines: string[] = []
  const add = (items: NavItem[]) => {
    for (const item of items) {
      const url = `https://wanaku.ai/docs/next/${item.link.endsWith('/') ? item.link : `${item.link}.html`}`
      lines.push(`- [${item.text}](${url}): ${description(dir, item.link)}`)
      if (item.items) add(item.items)
    }
  }
  const nav = JSON.parse(readFileSync(navFile, 'utf-8')) as { sidebar: NavItem[] }
  add(nav.sidebar)

  const llms = path.join(config.outDir, 'llms.txt')
  writeFileSync(llms, [readFileSync(llms, 'utf-8').trimEnd(), '', '## Wanaku documentation', ...lines, ''].join('\n'))
}
