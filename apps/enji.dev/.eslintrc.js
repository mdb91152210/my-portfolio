/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next-typescript'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'next/no-html-link-for-pages': 'off', // Disable pages/ directory rule
    'react-hooks/exhaustive-deps': 'warn', // (optional) silence missing deps error
    'react/require-default-props': 'off', // (optional) silence defaultProps warning
  },
};
