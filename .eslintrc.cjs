module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['react', '@typescript-eslint'],
  // Note: 'react-hooks' plugin is intentionally not listed below to avoid duplicate loading
  rules: {
    // Project-specific overrides
    // Relax some rules during migration/build: convert strict errors to warnings
    'react/forbid-dom-props': ['warn', { forbid: ['style'] }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    // Allow explicit any during migration but warn about it
    '@typescript-eslint/no-explicit-any': ['warn'],
    // Allow unused variables if they start with an underscore (common pattern)
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
  // JSX text may contain quotes/apostrophes across the UI; disable this rule to avoid noisy warnings
  'react/no-unescaped-entities': 'off',
  },
};
