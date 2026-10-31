// The docs trees that publish the docs/ folder of a repository main branch. Each tree has a nav.json (sidebar and
// llms.txt) and a redirects.txt (301s) in that folder. To add a tree, add an entry here, a Makefile target that
// copies the docs/ folder to docs/<dir>, and .htaccess rules for its old URLs.
export interface DocsTree {
    // Path under docs/ and under the site root /docs/
    dir: string
    // The wanaku-ai repository that owns the docs/ folder
    repo: string
    // The page title suffix
    site: string
    // The llms.txt section heading
    heading: string
    // Old URL prefixes that served the same pages, kept in sync with public/.htaccess
    oldPrefixes: string[]
}

export const docsTrees: DocsTree[] = [
    {
        dir: 'next',
        repo: 'wanaku',
        site: 'Wanaku next',
        heading: 'Wanaku documentation',
        oldPrefixes: ['/docs/version/wanaku-main/docs/'],
    },
    {
        dir: 'barn/next',
        repo: 'wanaku-barn',
        site: 'Wanaku Barn',
        heading: 'Wanaku Barn documentation',
        oldPrefixes: ['/docs/barn/wanaku-barn-main/docs/'],
    },
    {
        dir: 'java-sdk/next',
        repo: 'wanaku-capabilities-java-sdk',
        site: 'Wanaku Java SDK',
        heading: 'Wanaku Capabilities Java SDK documentation',
        oldPrefixes: ['/docs/java-sdk/wanaku-capabilities-java-sdk-main/docs/'],
    },
]

// Returns the tree that a page path (relative to the site root) belongs to
export function treeOf(relativePath: string): DocsTree | undefined {
    return docsTrees.find((tree) => relativePath.startsWith(`docs/${tree.dir}/`))
}
