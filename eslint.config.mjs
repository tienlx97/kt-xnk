import js from '@eslint/js';
import next from 'eslint-config-next';
import stylexPlugin from '@stylexjs/eslint-plugin';

const config = [
  js.configs.recommended,
  ...next,
  {
    plugins: { '@stylexjs': stylexPlugin },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-unused': 'error',
      '@stylexjs/valid-shorthands': 'warn',
      '@stylexjs/sort-keys': 'warn',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'harness/**',
      'babel.config.js',
      'postcss.config.js',
    ],
  },
];

export default config;
