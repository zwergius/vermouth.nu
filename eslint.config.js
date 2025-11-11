import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import tseslint from 'typescript-eslint'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs[('flat/recommended', 'flat/prettier')],
  prettier,
  {
    files: ['**/*.server.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        fetch: false,
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'], // Add support for additional file extensions, such as .svelte
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      'array-callback-return': 'error',
      'prefer-destructuring': 'error',
      'no-return-await': 'error',
      'no-undef': 'off',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'prefer-template': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-else-return': 'error',
      'template-curly-spacing': 'error',
      'one-var': ['error', 'never'],
      eqeqeq: 'error',
      'object-shorthand': 'error',
      'no-unneeded-ternary': 'error',
      'quote-props': ['error', 'as-needed'],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'svelte/no-at-html-tags': 'off',
      'svelte/no-at-debug-tags': 'error',
      'svelte/no-inspect': 'error',
      'svelte/button-has-type': 'error',
      'svelte/no-unnecessary-state-wrap': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
    },
  },
  {
    ignores: ['build/', 'dist/'],
  },
)
