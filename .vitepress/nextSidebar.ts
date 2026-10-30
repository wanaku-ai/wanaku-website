import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

const NEXT_DIR = 'docs/next'

interface NavItem {
    text: string
    link: string
    collapsed?: boolean
    items?: NavItem[]
}

function toSidebar(items: NavItem[]): DefaultTheme.SidebarItem[] {
    return items.map((item) => ({
        text: item.text,
        link: `/${NEXT_DIR}/${item.link}`,
        collapsed: item.collapsed,
        items: item.items ? toSidebar(item.items) : undefined,
    }))
}

// Builds the /docs/next/ sidebar from the nav.json file of the published docs tree.
// Returns no sidebar when the file is absent, for example before `make fetch`.
export function nextSidebar(): DefaultTheme.Sidebar {
    const navFile = path.join(NEXT_DIR, 'nav.json')
    if (!fs.existsSync(navFile)) {
        return {}
    }
    const nav = JSON.parse(fs.readFileSync(navFile, 'utf-8')) as { sidebar: NavItem[] }
    return { [`/${NEXT_DIR}/`]: toSidebar(nav.sidebar) }
}
