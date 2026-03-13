# AGENTS.md - Vermouth.NU Development Guide

## Project Overview

This is a SvelteKit e-commerce project for a vermouth store using:

- **Framework**: SvelteKit with Svelte 5 (runes: `$state`, `$derived`, `$effect`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + PostCSS
- **Testing**: Vitest (unit) + Playwright (integration)
- **E-commerce**: Medusa JS SDK
- **Deployment**: Cloudflare Pages / static adapter

---

## Commands

### Development

```bash
npm run dev              # Start dev server (host mode)
npm run build            # Build for production
npm run preview          # Preview production build
npm run check            # TypeScript check (svelte-check)
npm run check:watch      # Watch mode for type checking
```

### Linting & Formatting

```bash
npm run lint             # Run ESLint + Prettier checks
npm run format           # Format code with Prettier
npm run fix              # Fix import paths for Medusa SDK
```

### Testing

```bash
npm run test             # Run all tests (unit + integration)
npm run test:unit        # Run Vitest unit tests only
npm run test:integration # Run Playwright integration tests only

# Single test file examples:
npx vitest run src/lib/helpers/numbers.test.ts
npx playwright test tests/main-page.spec.ts
```

---

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
