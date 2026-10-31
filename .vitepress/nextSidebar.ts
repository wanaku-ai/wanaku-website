import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

// The docs trees that publish the docs/ folder of a repository, each with the nav.json file of that folder
const TREES = ['docs/next', 'docs/barn/next']

interface NavItem {
    text: string
    link: string
    collapsed?: boolean
    items?: NavItem[]
}

function toSidebar(dir: string, items: NavItem[]): DefaultTheme.SidebarItem[] {
    return items.map((item) => ({
        text: item.text,
        link: `/${dir}/${item.link}`,
        collapsed: item.collapsed,
        items: item.items ? toSidebar(dir, item.items) : undefined,
    }))
}

// Builds the sidebar of each tree from its nav.json file.
// Leaves out a tree whose file is absent, for example before `make fetch`.
export function nextSidebar(): DefaultTheme.SidebarMulti {
    const sidebar: DefaultTheme.SidebarMulti = {}
    for (const dir of TREES) {
        const navFile = path.join(dir, 'nav.json')
        if (!fs.existsSync(navFile)) continue
        const nav = JSON.parse(fs.readFileSync(navFile, 'utf-8')) as { sidebar: NavItem[] }
        sidebar[`/${dir}/`] = toSidebar(dir, nav.sidebar)
    }
    return sidebar
}
