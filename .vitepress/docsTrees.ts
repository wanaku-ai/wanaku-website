// The docs trees that publish the docs/ folder of a repository: a latest tree from the last release tag and a next
// tree from the main branch. Each tree has a nav.json (sidebar and llms.txt) and a redirects.txt (301s) in that
// folder. To add a tree, add an entry here, a Makefile target that copies the docs/ folder to docs/<dir>, and
// .htaccess rules for its old URLs.
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

// A latest tree and a next tree of the same repository
function trees(base: string, repo: string, name: string, oldNextPrefixes: string[] = []): DocsTree[] {
    const prefix = base ? `${base}/` : ''
    return [
        { dir: `${prefix}latest`, repo, site: name, heading: `${name} documentation`, oldPrefixes: [] },
        {
            dir: `${prefix}next`,
            repo,
            site: `${name} next`,
            heading: `${name} documentation (next, unreleased)`,
            oldPrefixes: oldNextPrefixes,
        },
    ]
}

// The latest trees come first, so that llms.txt lists the released pages first
const all = [
    trees('', 'wanaku', 'Wanaku', ['/docs/version/wanaku-main/docs/']),
    trees('barn', 'wanaku-barn', 'Wanaku Barn', ['/docs/barn/wanaku-barn-main/docs/']),
    trees('java-sdk', 'wanaku-capabilities-java-sdk', 'Wanaku Capabilities Java SDK',
        ['/docs/java-sdk/wanaku-capabilities-java-sdk-main/docs/']),
    trees('semantic-router', 'wanaku-semantic-router', 'Wanaku Semantic Router'),
    trees('camel-integration-capability', 'camel-integration-capability', 'Camel Integration Capability',
        ['/docs/camel-integration-capability/camel-integration-capability-main/docs/']),
]

export const docsTrees: DocsTree[] = [...all.map((pair) => pair[0]), ...all.map((pair) => pair[1])]

// Returns the tree that a page path (relative to the site root) belongs to
export function treeOf(relativePath: string): DocsTree | undefined {
    return docsTrees.find((tree) => relativePath.startsWith(`docs/${tree.dir}/`))
}
