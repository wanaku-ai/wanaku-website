# Wanaku Website

VitePress-based documentation site for the Wanaku project.

## Project Structure

- `.vitepress/` — VitePress config and theme
- `docs/` — documentation pages (pulled from upstream repos via Makefile)
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
| `WANAKU_ROUTER_VERSION` | wanaku-ai/wanaku | `docs/version/wanaku-current` |
| `WANAKU_DEMOS_VERSION` | wanaku-ai/wanaku-demos | `docs/demos/wanaku-demos-current` |
| `WCJSDK_VERSION` | wanaku-ai/wanaku-capabilities-java-sdk | `docs/java-sdk/wanaku-capabilities-java-sdk-current` |
| `CAMEL_INTEGRATION_CAPABILITY_VERSION` | wanaku-ai/camel-integration-capability | `docs/camel-integration-capability/camel-integration-capability-current` |

Each repo is cloned twice: once at the pinned tag (e.g., `wanaku-0.2.0`) and once at `main`.

## Release Process

When a new Wanaku version is released, update the website as follows:

1. Check the latest release/tag for each upstream repo:
   - `gh release list --repo wanaku-ai/wanaku --limit 1`
   - `gh release list --repo wanaku-ai/wanaku-demos --limit 1` (may not have GitHub releases; check tags with `gh api repos/wanaku-ai/wanaku-demos/git/refs/tags/wanaku-demos-<VERSION>`)
   - `gh release list --repo wanaku-ai/wanaku-capabilities-java-sdk --limit 1`
   - `gh release list --repo wanaku-ai/camel-integration-capability --limit 1`
2. Update the version variables at the top of `Makefile` to match the latest tags.
   - Versions may differ across repos (e.g., java-sdk may be ahead of the others).
3. Run `make clean && make docs` to verify the build fetches and renders correctly.
4. Commit to a `quick-fix/update-to-<VERSION>` branch and open a PR.
