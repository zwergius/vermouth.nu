module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  plugins: ["svelte3"],
  ignorePatterns: ["*.cjs"],
  overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],

  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    "array-callback-return": "error",
    "no-return-await": "error",
    "require-await": "error",
    "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "no-undef": "off",
    "no-var": "error",
    "prefer-template": "error",
    "no-else-return": "error",
    "template-curly-spacing": "error",
    "one-var": ["error", "never"],
    eqeqeq: "error",
    "object-shorthand": "error",
    "no-unneeded-ternary": "error",
    "quote-props": ["error", "as-needed"],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-duplicate-imports": "error",
  },
}
