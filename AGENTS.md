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

## Commands

Prefer the scripts defined in `package.json` for standard project workflows.
Use direct `pnpm exec ...` commands only when there is no matching script or when
running a focused command against specific files.

### Branch And Issue Workflow

- Follow the global Codex branch isolation rules: one Linear issue, one branch.
- Include the single Linear issue ID in the branch name, for example `codex/VNU-4-mobile-kurv-checkboxes`.
- If the user asks to fix multiple Linear issues, split them into separate branches/worktrees and handle one issue at a time.

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

## Local Setup And Verification Notes

- Use `pnpm install`, not `npm install`. The ecommerce branch is pnpm-locked, and npm can fail with peer dependency resolution conflicts.
- `pnpm check` requires local env values for static `$env` imports. For local verification, placeholder values are enough:

```bash
PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test \
PUBLIC_VITE_BACKEND_URL=http://127.0.0.1:9000 \
EPAY_API_KEY=test \
PUBLIC_COOKIE_YES_ID= \
PUBLIC_GA_MEASUREMENT_ID= \
pnpm check
```

- If `/kurv` renders a Vite 500 with `ERR_UNSUPPORTED_DIR_IMPORT` from `@medusajs/js-sdk/dist/esm/admin`, run `pnpm fix` and restart the dev server before browser verification.
- For focused UI fixes, at minimum run `pnpm exec prettier --check <changed files>`, `pnpm exec eslint <changed files>`, `git diff --check`, and `pnpm check` with the env values above.

## Code Style Guidelines

### Formatting (Prettier)

- 2 space indentation
- No semicolons
- Single quotes
- Trailing commas: `all`
- Print width: 100 characters
- Svelte sort order: `options-scripts-markup-styles`

### ESLint Rules

- Prefer `const` (with destructuring)
- No `var`, use `const`/`let`
- Prefer template literals
- Use object shorthand
- No `else return`
- Use `eqeqeq` (strict equality)
- No duplicate imports
- Array callbacks must return
- Prefer destructuring

### TypeScript

- **Strict mode enabled** - all strict checks on
- **No `any`** - use `unknown` or proper types
- **No unused vars** - prefix with `_` if intentional (e.g., `_event`)
- **Use interfaces** - with single extends allowed

### Svelte 5 Conventions

```svelte
<script lang="ts">
  // Use runes for reactive state
  let count = $state(0)
  const doubled = $derived(count * 2)

  // Props with $props()
  let { title, count = 0 }: { title: string; count?: number } = $props()

  // Effects
  $effect(() => {
    // side effects
  })
</script>
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

To bypass (use cautiously): `git commit --no-verify`

---

## Notes

- The project uses `@medusajs/js-sdk` for e-commerce functionality
- Run `npm run fix` after installing/updating Medusa SDK to fix import paths
- Build includes pre-build fix step: `npm run prebuild`
