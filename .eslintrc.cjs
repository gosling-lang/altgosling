module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'examples', 'tmp', 'old', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'semi': [2, 'always'],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-trailing-spaces': ['error', { "skipBlankLines": true, "ignoreComments": true }],
  },
}
