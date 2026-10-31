import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { genFeed } from './genFeed'
import { genLlms } from './genLlms'
import { genRedirects } from './genRedirects'
import { nextSidebar } from './nextSidebar'
import { docsTrees, treeOf } from './docsTrees'

const siteUrl = 'https://wanaku.ai'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Wanaku",
    description: "The open-source governed action proxy for AI agents",
    ignoreDeadLinks: true,
    base: '/',
    outDir: 'dist',
    srcExclude: [
        '**/node_modules/**',
        'camel-integration-capability/main/**',
        '**/tests/plans/**',
        '**/CLAUDE.md',
        '**/AGENTS.md',
        '**/CONTRIBUTING.md',
        '**/SECURITY.md',
    ],

    sitemap: {
        hostname: siteUrl,
        // Leave out the unreleased main trees of the other repos, which duplicate their released pages,
        // and the source-tree files that the clones publish. docs/next is the main tree of wanaku and stays in.
        transformItems: (items) => items.filter((item) => !/-main\/|\/src\/|\/tests\//.test(item.url)),
    },

    transformPageData(pageData) {
        const isHome = pageData.relativePath === 'index.md'
        const isBlogPost = pageData.relativePath.startsWith('blog/posts/')

        // The docs trees use the same page names, so their titles name the tree.
        const site = treeOf(pageData.relativePath)?.site
            ?? (pageData.relativePath.startsWith('docs/classic/') ? 'Wanaku Classic'
            : pageData.relativePath.startsWith('docs/barn/') ? 'Wanaku Barn'
            : 'Wanaku')
        if (site !== 'Wanaku') pageData.titleTemplate = `:title | ${site}`

        const title = isHome
            ? 'Wanaku — The Open-Source Governed Action Proxy for AI Agents'
            : `${pageData.title} | ${site}`

        const description = pageData.description || 'The open-source governed action proxy for AI agents'

        const canonicalUrl = `${siteUrl}/${pageData.relativePath}`
            .replace(/index\.md$/, '')
            .replace(/\.md$/, '.html')

        const ogImage = `${siteUrl}${pageData.frontmatter.image || '/images/wanaku.png'}`

        const ogType = isBlogPost ? 'article' : 'website'

        pageData.frontmatter.head ??= []
        pageData.frontmatter.head.push(
            ['link', { rel: 'canonical', href: canonicalUrl }],
            ['meta', { property: 'og:title', content: title }],
            ['meta', { property: 'og:description', content: description }],
            ['meta', { property: 'og:url', content: canonicalUrl }],
            ['meta', { property: 'og:type', content: ogType }],
            ['meta', { property: 'og:image', content: ogImage }],
            ['meta', { property: 'og:site_name', content: 'Wanaku' }],
            ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
            ['meta', { name: 'twitter:title', content: title }],
            ['meta', { name: 'twitter:description', content: description }],
            ['meta', { name: 'twitter:image', content: ogImage }],
        )

        if (isHome) {
            pageData.frontmatter.head.push(
                ['script', { type: 'application/ld+json' }, JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Wanaku',
                    url: siteUrl,
                    logo: `${siteUrl}/images/wanaku.png`,
                    sameAs: [
                        'https://github.com/wanaku-ai/',
                        'https://www.youtube.com/@WanakuAI'
                    ]
                })],
                ['script', { type: 'application/ld+json' }, JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Wanaku',
                    url: siteUrl
                })]
            )
        }

        if (isBlogPost) {
            pageData.frontmatter.head.push(
                ['script', { type: 'application/ld+json' }, JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: pageData.frontmatter.title || pageData.title,
                    datePublished: pageData.frontmatter.date,
                    author: {
                        '@type': 'Person',
                        name: pageData.frontmatter.author || 'Wanaku Team'
                    },
                    description: description
                })]
            )
        }
    },

    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Documentation', link: '/docs/' },
            { text: 'Blog', link: '/blog/' },
            { text: 'Community', link: '/community/' },
            { text: 'About', link: '/about/' },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/wanaku-ai/' },
            { icon: 'youtube', link: 'https://www.youtube.com/@WanakuAI' },
        ],
        // The sidebar of each tree in docsTrees.ts comes from the docs/nav.json file of its repository.
        // Other pages keep no sidebar.
        sidebar: nextSidebar(),
        search: {
            provider: 'local',
        },
        editLink: {
            // VitePress sends this function to the browser as source text, so it cannot use imports. The tree table
            // goes into the function body as a literal.
            pattern: new Function('{ filePath }', `
                const trees = ${JSON.stringify(docsTrees.map(({ dir, repo }) => ({ dir, repo })))}
                const tree = trees.find((t) => filePath.startsWith('docs/' + t.dir + '/'))
                return tree
                    ? 'https://github.com/wanaku-ai/' + tree.repo + '/edit/main/docs/' + filePath.slice(('docs/' + tree.dir + '/').length)
                    : 'https://github.com/wanaku-ai/wanaku-website/edit/main/' + filePath
            `) as (payload: { filePath: string }) => string,
            text: 'Edit this page on GitHub',
        },
    },

    async buildEnd(siteConfig) {
        await genFeed(siteConfig)
        genRedirects(siteConfig)
        genLlms(siteConfig)
    },

    markdown: {
        config(md) {
            md.use(tabsMarkdownPlugin)

            // Upstream docs are written for GitHub, where `{{...}}` in inline code is plain text.
            // Mark inline code as v-pre so Vue does not parse it as a template expression.
            const defaultCodeInline = md.renderer.rules.code_inline!.bind(md.renderer.rules)
            md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
                tokens[idx].attrSet('v-pre', '')
                return defaultCodeInline(tokens, idx, options, env, self)
            }

            const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules)
            md.renderer.rules.fence = (tokens, idx, options, env, self) => {
                const token = tokens[idx]
                if (token.info.trim() === 'mermaid') {
                    const encoded = token.content
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                    return `<pre class="mermaid">${encoded}</pre>`
                }
                return defaultFence(tokens, idx, options, env, self)
            }
        },
    },
});
