# AGENTS.md - Vermouth.NU Development Guide

## Project Overview

This is a SvelteKit e-commerce project for a vermouth store using:

- **Framework**: SvelteKit with Svelte 5 (runes: `$state`, `$derived`, `$effect`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + PostCSS
- **Testing**: Vitest (unit) + Playwright (integration)
- **E-commerce**: Medusa JS SDK
- **Deployment**: Cloudflare adapter with SSR environment

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.


## Way Of Working

### Start Here: Required First Actions

Before any coding or project edit, you must:

1. For implementation work that changes product behavior or project scope, read [Linear](/Users/zwergius/.codex/LINEAR.md); if no issue is provided, ask whether to create one before editing.
2. Read [Git](/Users/zwergius/.codex/GIT.md); confirm isolation and include the Linear ID in the branch name when present.
3. For GitHub, PR, issue, or CI work, read [GitHub](/Users/zwergius/.codex/GITHUB.md).
4. Confirm the branch is current with the repository default branch unless told otherwise.
5. In separate worktrees, symlink ignored env files from the main checkout when present: `.env`, `.env.local`, `.dev.vars`.
6. Run dependency install only when required by the repo or missing dependencies; otherwise use the existing lockfile/install state.
7. Run the repo's relevant checks, such as `pnpm check`, focused tests, and `pnpm test:integration` when applicable.
8. Before editing, state a short startup receipt: docs read, local overrides checked, scope, Linear issue or none, branch/worktree, expected files, task-specific companion files from [AGENTS](/Users/zwergius/.codex/AGENTS.md), and verification plan.

If you have not done these steps, do not edit files.

### End

Before handing work back, you must:

1. Run the planned verification commands, including focused checks for changed files.
2. Run `git diff --check` and review the diff for unrelated changes.
3. Stop dev servers or background processes started for the task.
4. Remove accidental temp files, logs, screenshots, or generated artifacts unless they are part of the deliverable.
5. Report any verification that failed, was skipped, or needs external services.
6. Summarize the behavior changed and the files touched.
7. Leave the branch/worktree scoped to the task and never bypass git hooks.
8. After a PR is merged, delete the task worktree and local branch only after confirming no uncommitted work remains.
9. If the task used Linear, state whether the issue needs a comment, status change, or follow-up.

---

## Commands

Prefer the scripts defined in `package.json` for standard project workflows.

### Development

```bash
pnpm dev                 # Start dev server (host mode)
pnpm build               # Build for production
pnpm preview             # Preview production build
pnpm check               # TypeScript check (svelte-check)
pnpm check:watch         # Watch mode for type checking
```

### Linting & Formatting

```bash
pnpm lint                # Run ESLint + Prettier checks
pnpm format              # Format code with Prettier
pnpm fix                 # Fix import paths for Medusa SDK
```

### Testing

```bash
pnpm test                # Run all tests (unit + integration)
pnpm test:unit           # Run Vitest unit tests only
pnpm test:integration    # Run Playwright integration tests only

# Single test file examples:
pnpm exec vitest run src/lib/helpers/numbers.test.ts
pnpm exec playwright test tests/main-page.spec.ts
```

---

## Naming Conventions

| Type              | Convention       | Example                                |
| ----------------- | ---------------- | -------------------------------------- |
| Variables         | camelCase        | `cartId`, `isLoading`                  |
| Functions         | camelCase        | `formatPrice()`, `getProducts()`       |
| Components        | PascalCase       | `ProductGrid`, `Hero`                  |
| Types/Interfaces  | PascalCase       | `Product`, `CartItem`                  |
| Constants         | UPPER_SNAKE_CASE | `MAX_QUANTITY`                         |
| Files (Svelte/TS) | kebab-case       | `product-grid.svelte`, `cart-utils.ts` |
| CSS classes       | kebab-case       | `text-brand-blue`                      |

---

## Import Conventions

### Use $lib alias

```typescript
import { sdk } from '$lib/medusa'
import { productSrcSet } from '$lib/helpers/images'
import type { Product } from '$lib/types'
```

### Import order (automatic with Prettier)

1. External libraries (`@medusajs/...`, `$env/...`)
2. Internal `$lib` imports
3. Relative imports (`../`, `./`)

---

## Error Handling

- Use `try/catch` for async operations and parsing
- Use `console.error` for logging errors (console.warn for warnings)
- Never expose sensitive data in error messages
- Handle localStorage with try/catch:

```typescript
try {
  state = JSON.parse(stored)
} catch (error) {
  console.error('Error parsing localStorage', error)
}
```

---

## Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable Svelte components
│   ├── data/          # Static data (products, locations)
│   ├── helpers/       # Utility functions
│   ├── medusa/        # Medusa SDK client
│   ├── stores/        # Svelte stores (runes-based)
│   └── actions/       # Svelte actions
├── routes/            # SvelteKit routes
│   ├── +page.svelte   # Route page
│   ├── +page.server.ts # Server load
│   └── [+param]/      # Dynamic routes
├── params/            # Route param matchers
└── app.css            # Global styles
tests/
├── *.spec.ts          # Playwright integration tests
```

---

## Testing Guidelines

### Unit Tests (Vitest)

- Place in `src/` alongside components
- Filename: `*.test.ts` or `*.spec.ts`
- Run: `npx vitest run <file>`

### Integration Tests (Playwright)

- Place in `tests/` directory
- Filename: `*.spec.ts`
- Use page object patterns for complex tests
- Run: `npx playwright test <file>`

---

## Git Hooks (Husky)

Pre-commit hooks run automatically:

- TypeScript check
- ESLint
- Prettier format

It is strictly forbidden to bypass pre-commit hooks.

---

## Notes

- The project uses `@medusajs/js-sdk` for e-commerce functionality
- Run `npm run fix` after installing/updating Medusa SDK to fix import paths
- Build includes pre-build fix step: `npm run prebuild`
