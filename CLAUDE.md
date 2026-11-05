# Wanaku Website

VitePress-based documentation site for the Wanaku project.

## Project Structure

- `.vitepress/` — VitePress config and theme
- `docs/` — documentation pages (pulled from upstream repos via Makefile)
  - `docs/latest/`, `docs/next/`, `docs/classic/` — Wanaku docs, the `docs/` folder of wanaku-ai/wanaku (last release tag, `main`, Java 0.2.x tag)
  - `docs/barn/` — Wanaku Barn docs from wanaku-ai/wanaku-barn (`latest/` from the last release tag, `next/` from `main`, `wanaku-barn-current/` from the 0.2.x tag) + landing page
- `blog/` — blog posts
- `about/`, `community/` — static pages
- `public/` — static assets
- `Makefile` — build orchestration and upstream doc fetching

## Commands

- `npm run docs:dev` — start dev server
- `npm run docs:build` — build the site (run `make docs` instead, which fetches deps first)
- `npm run docs:preview` — preview production build locally
- `make fetch` — clone upstream repos at pinned versions
- `make clean` — remove cloned repos and build artifacts
- `make docs` — fetch + build

## How Docs Are Fetched

Each upstream repository publishes only its `docs/` folder, at a URL that names its state rather than a git ref:

- `latest` is the last release tag (`v<version>`), at `/docs/latest/` for Wanaku and `/docs/<repo>/latest/` for the
  others (`barn`, `java-sdk`, `semantic-router`, `camel-integration-capability`).
- `next` is the `main` branch, at `/docs/next/` and `/docs/<repo>/next/`. It is the unreleased development version.

| Variable | Repository | Tree |
|---|---|---|
| `WANAKU_LATEST_VERSION` | wanaku-ai/wanaku | `docs/latest` |
| `BARN_LATEST_VERSION` | wanaku-ai/wanaku-barn | `docs/barn/latest` |
| `WCJSDK_LATEST_VERSION` | wanaku-ai/wanaku-capabilities-java-sdk | `docs/java-sdk/latest` |
| `CIC_LATEST_VERSION` | wanaku-ai/camel-integration-capability | `docs/camel-integration-capability/latest` |
| `SEMANTIC_ROUTER_LATEST_VERSION` | wanaku-ai/wanaku-semantic-router | `docs/semantic-router/latest` |

The Java 0.2 line keeps its old trees. They are frozen and do not change at a new release:

| Variable | Repository | Clone target |
|---|---|---|
| `WANAKU_CLASSIC_VERSION` | wanaku-ai/wanaku | `docs/classic` (only the `docs/` folder) |
| `WANAKU_BARN_VERSION` | wanaku-ai/wanaku-barn | `docs/barn/wanaku-barn-current` |
| `WCJSDK_VERSION` | wanaku-ai/wanaku-capabilities-java-sdk | `docs/java-sdk/wanaku-capabilities-java-sdk-current` |
| `CAMEL_INTEGRATION_CAPABILITY_VERSION` | wanaku-ai/camel-integration-capability | `docs/camel-integration-capability/camel-integration-capability-current` |
| `WANAKU_DEMOS_VERSION` | wanaku-ai/wanaku-demos | `docs/demos/wanaku-demos-current` (demos also clone `main`) |

`.vitepress/docsTrees.ts` lists every `latest` and `next` tree. The sidebar (`.vitepress/nextSidebar.ts`, from the
`docs/nav.json` file of each tree), the 301s (`.vitepress/genRedirects.ts`, from the `docs/redirects.txt` file of each
tree), the `llms.txt` lines (`.vitepress/genLlms.ts`), the page title suffix, the version banner, and the edit links
read it. A docs PR in an upstream repository that adds a page to `nav.json` needs no website change.

The sitemap leaves out the `next` trees, because they duplicate the pages of the `latest` trees.
`public/.htaccess` redirects the old URLs (`/docs/version/`, and the `-main/` clones of Barn, the SDK, and CIC) to
the `next` trees.

To add a repository, add a `trees(...)` entry in `docsTrees.ts`, `latest` and `next` Makefile targets, and `.htaccess`
rules for its old URLs.

## Release Process

When a new version is released, update the website as follows:

1. Check the latest release tag for each upstream repo:
   - `gh release list --repo wanaku-ai/wanaku --limit 1`
   - `gh release list --repo wanaku-ai/wanaku-barn --limit 1`
   - `gh release list --repo wanaku-ai/wanaku-capabilities-java-sdk --limit 1`
   - `gh release list --repo wanaku-ai/camel-integration-capability --limit 1`
   - `gh release list --repo wanaku-ai/wanaku-semantic-router --limit 1`
2. Update the `*_LATEST_VERSION` variables at the top of `Makefile` to match the latest tags (without the `v`).
   - The repositories can release independently. Change only the variables of the repositories that released.
   - Do not change the Java 0.2 variables (`WANAKU_CLASSIC_VERSION` and the others in the second table).
3. Run `make clean && make docs` to verify the build fetches and renders correctly. The build fails when a
   `redirects.txt` line of a tree leads to a page that does not exist.
4. Commit to a `quick-fix/update-to-<VERSION>` branch and open a PR.
