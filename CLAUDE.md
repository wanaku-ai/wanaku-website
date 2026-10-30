# Wanaku Website

VitePress-based documentation site for the Wanaku project.

## Project Structure

- `.vitepress/` — VitePress config and theme
- `docs/` — documentation pages (pulled from upstream repos via Makefile)
  - `docs/next/`, `docs/classic/` — Wanaku docs, the `docs/` folder of wanaku-ai/wanaku (`main` + Java 0.2.x tag)
  - `docs/barn/` — Wanaku Barn docs, cloned from wanaku-ai/wanaku-barn + landing page
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

The Makefile clones specific tagged versions of upstream repos into `docs/`:

| Variable | Repository | Clone target |
|---|---|---|
| `WANAKU_CLASSIC_VERSION` | wanaku-ai/wanaku | `docs/classic` |
| `WANAKU_BARN_VERSION` | wanaku-ai/wanaku-barn | `docs/barn/wanaku-barn-current` |
| `WANAKU_DEMOS_VERSION` | wanaku-ai/wanaku-demos | `docs/demos/wanaku-demos-current` |
| `WCJSDK_VERSION` | wanaku-ai/wanaku-capabilities-java-sdk | `docs/java-sdk/wanaku-capabilities-java-sdk-current` |
| `CAMEL_INTEGRATION_CAPABILITY_VERSION` | wanaku-ai/camel-integration-capability | `docs/camel-integration-capability/camel-integration-capability-current` |

Each repo is cloned twice: once at the pinned tag and once at `main`.

Wanaku is the exception: only the `docs/` folder of each ref is published, at a URL that names its state rather than
a git ref. `main` goes to `docs/next/` (`/docs/next/`) and the Java 0.2.x tag goes to `docs/classic/` (`/docs/classic/`).
The build turns the `docs/redirects.txt` file of the `next` tree (and of a future `latest` tree) into 301s
(`.vitepress/genRedirects.ts`), and `public/.htaccess` redirects the old `/docs/version/` URLs.
The `/docs/next/` sidebar comes from the `docs/nav.json` file of the same tree (`.vitepress/nextSidebar.ts`). A docs
PR in wanaku-ai/wanaku that adds a page to `nav.json` needs no website change.
The build also appends one line for each `nav.json` page, with its frontmatter `description`, to the
`public/llms.txt` file (`.vitepress/genLlms.ts`).

## Release Process

When a new version is released, update the website as follows:

1. Check the latest release/tag for each upstream repo:
   - `gh release list --repo wanaku-ai/wanaku --limit 1` (Rust engine)
   - `gh release list --repo wanaku-ai/wanaku-barn --limit 1` (Java/Barn)
   - `gh release list --repo wanaku-ai/wanaku-demos --limit 1`
   - `gh release list --repo wanaku-ai/wanaku-capabilities-java-sdk --limit 1`
   - `gh release list --repo wanaku-ai/camel-integration-capability --limit 1`
2. Update the version variables at the top of `Makefile` to match the latest tags.
   - Wanaku (Rust) and Barn (Java) have independent release cycles.
   - `WANAKU_CLASSIC_VERSION` tracks the Java 0.2.x line only. Do not set it to a Rust release: the Rust docs come
     from `main` (`/docs/next/`), so a Rust release needs no Makefile change yet.
3. Run `make clean && make docs` to verify the build fetches and renders correctly.
4. Commit to a `quick-fix/update-to-<VERSION>` branch and open a PR.
