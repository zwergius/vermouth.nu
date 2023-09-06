module.exports = {
  root: true,

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:svelte/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'no-console': 'error',
    'array-callback-return': 'error',
    'prefer-destructuring': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-undef': 'off',
    'no-var': 'error',
    'prefer-template': 'error',
    'no-else-return': 'error',
    'no-unused-vars': 'error',
    'template-curly-spacing': 'error',
    'one-var': ['error', 'never'],
    eqeqeq: 'error',
    'object-shorthand': 'error',
    'no-unneeded-ternary': 'error',
    'quote-props': ['error', 'as-needed'],
    // "no-console": ["warn", { allow: ["warn", "error"] }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: false,
        },
      },
    ],
  },
}
