import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { genFeed } from './genFeed'

const siteUrl = 'https://wanaku.ai'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Wanaku",
    description: "The first open-source MCP Router for AI workflows",
    ignoreDeadLinks: true,
    base: '/',
    outDir: 'dist',
    srcExclude: ['**/node_modules/**', 'camel-integration-capability/main/**', '**/tests/plans/**'],

    sitemap: {
        hostname: siteUrl
    },

    transformPageData(pageData) {
        const isHome = pageData.relativePath === 'index.md'
        const isBlogPost = pageData.relativePath.startsWith('blog/posts/')

        const title = isHome
            ? 'Wanaku — The First Open-Source MCP Router'
            : `${pageData.title} | Wanaku`

        const description = pageData.description || 'The first open-source MCP Router for AI workflows'

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
        docFooter: {
            prev: false,
            next: false,
        },
    },

    async buildEnd(siteConfig) {
        await genFeed(siteConfig)
    },

    markdown: {
        config(md) {
            md.use(tabsMarkdownPlugin)

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
