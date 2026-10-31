import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import type { SiteConfig } from 'vitepress'
import { docsTrees } from './docsTrees'

interface NavItem {
  text: string
  link: string
  items?: NavItem[]
}

// Reads the description from the frontmatter of a page of a docs tree. A page link that ends with a slash is a section index.
function description(dir: string, link: string): string {
  const file = path.join(dir, link.endsWith('/') ? `${link}index.md` : `${link}.md`)
  const frontmatter = readFileSync(file, 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const value = frontmatter.match(/^description:\s*(.*)$/m)?.[1] ?? ''
  return value.replace(/^"(.*)"$/, '$1')
}

// Appends one section for each docs tree to the llms.txt that public/ provides, with one link line for each page of
// the nav.json sidebar of the tree.
export function genLlms(config: SiteConfig) {
  const sections: string[] = []
  for (const { dir: tree, heading } of docsTrees) {
    const dir = path.join(config.srcDir, 'docs', tree)
    const navFile = path.join(dir, 'nav.json')
    if (!existsSync(navFile)) continue

    const lines: string[] = []
    const add = (items: NavItem[]) => {
      for (const item of items) {
        const url = `https://wanaku.ai/docs/${tree}/${item.link.endsWith('/') ? item.link : `${item.link}.html`}`
        lines.push(`- [${item.text}](${url}): ${description(dir, item.link)}`)
        if (item.items) add(item.items)
      }
    }
    const nav = JSON.parse(readFileSync(navFile, 'utf-8')) as { sidebar: NavItem[] }
    add(nav.sidebar)
    sections.push('', `## ${heading}`, ...lines)
  }
  if (sections.length === 0) return

  const llms = path.join(config.outDir, 'llms.txt')
  writeFileSync(llms, [readFileSync(llms, 'utf-8').trimEnd(), ...sections, ''].join('\n'))
}
