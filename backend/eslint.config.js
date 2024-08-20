/** @type {import('eslint').Linter.Config} */
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**'
    ]
  };
  